import {
  select,
  csv,
  geoPath,
  geoMercator,
  scaleTime,
  scaleLinear,
  max,
  extent,
  mean,
  scaleSequential,
  interpolateReds,
  line,
  axisLeft,
  axisBottom,
  scaleOrdinal,
  group,
  schemeCategory10,
} from 'd3';

let csvData = null;
let selectedGeoPlaceName = null;

async function loadCsvData() {
  csvData = await csv('data.csv');
  console.log('CSV Data Loaded', csvData);
}

async function loadAndDisplayGeoJSON(selectedMap) {
  const response = await fetch(selectedMap.url);
  const data = await response.json();
  const maxValue = max(csvData, (d) => +d.Data_Value);
  const spikeScale = scaleLinear()
    .domain([0, maxValue])
    .range([0, -500]);
  const svg = select('#mapSvg').empty()
    ? select('body')
        .append('svg')
        .attr('id', 'mapSvg')
        .attr('width', 960)
        .attr('height', 600)
    : // .style('flex', '1') // flex property
      // .style('order', '1')
      select('#mapSvg');
  svg.selectAll('*').remove();
  const placeNames = {};
  csvData.forEach((d) => {
    placeNames[d.Geo_Join_ID] = d.Geo_Place_Name;
  });
  const tooltip = select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('padding', '10px')
    .style('background', 'white')
    .style('border', '1px solid black')
    .style('border-radius', '5px')
    .style('pointer-events', 'none');

  const dataByRegion = csvData.reduce((acc, d) => {
    const key = placeNames[d.Geo_Join_ID];
    if (key && !acc[key]) acc[key] = [];
    if (key) acc[key].push(+d.Data_Value);
    return acc;
  }, {});

  const averages = {};
  Object.keys(dataByRegion).forEach((key) => {
    averages[key] = mean(dataByRegion[key]);
  });

  const maxAverage = Math.max(...Object.values(averages));
  const colorScale = scaleSequential(
    interpolateReds,
  ).domain([0, maxAverage]);

  const projection = geoMercator()
    .center([-73.94, 40.7])
    .scale(50000)
    .translate([960 / 2, 600 / 2]);
  const path = geoPath().projection(projection);

  svg
    .selectAll('path')
    .data(data.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', (d) => {
      const regionName =
        placeNames[d.properties.BoroCD] ||
        d.properties.BoroName ||
        d.properties.GEONAME ||
        d.properties.uhf_neigh;
      return colorScale(averages[regionName] || 0);
    })
    .attr('stroke', selectedMap.strokeColor)
    .attr('stroke-width', 0.5)
    .on('mouseover', function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      tooltip
        .html(
          placeNames[d.properties.BoroCD] ||
            d.properties.BoroName ||
            d.properties.GEONAME ||
            d.properties.uhf_neigh ||
            'Unknown',
        )
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', function () {
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    })
    .on('click', function (event, d) {
      selectedGeoPlaceName =
        placeNames[d.properties.BoroCD] ||
        d.properties.BoroName ||
        d.properties.GEONAME ||
        d.properties.uhf_neigh ||
        'Unknown';
      console.log(
        'Region Selected: ',
        selectedGeoPlaceName,
      );
      drawTimeSeriesChart();
    });
}
function createDropdownContainer() {
  const dropdownContainer = select('body')
    .append('div')
    .attr('id', 'dropdown-container')
    .style('display', 'flex')
    .style('flex-direction', 'row')
    .style('align-items', 'center')
    .style('margin-bottom', '10px');

  return dropdownContainer;
}
function setupMapSelectionDropdown(dropdownContainer) {
  const maps = [
    {
      name: 'UHF34',
      url: 'https://raw.githubusercontent.com/nycehs/NYC_geography/master/UHF34.geo.json',
      fillColor: 'lightblue',
      strokeColor: 'black',
    },
    {
      name: 'UHF42',
      url: 'https://gist.githubusercontent.com/miguelpaz/edbc79fc55447ae736704654b3b2ef90/raw/695b3144ec3eb4bbf289d1667a5135e950c9d787/uhf42.geojson',
      fillColor: 'lightblue',
      strokeColor: 'black',
    },
    {
      name: 'Borough',
      url: 'https://raw.githubusercontent.com/nycehs/NYC_geography/master/borough.geo.json',
      fillColor: 'lightcoral',
      strokeColor: 'black',
    },
    {
      name: 'Community Districts',
      url: 'https://gist.githubusercontent.com/mgiraldo/9cafbc5e9f562e326ebe/raw/edca02adcdd5191eaa53d127da303c905f276f46/nyc-community-districts.geojson',
      fillColor: 'lightgoldenrodyellow',
      strokeColor: 'black',
    },
  ];

  let mapSelect = dropdownContainer
    .append('select')
    .attr('id', 'mapSelect')
    .style('margin', '5px');
  mapSelect
    .selectAll('option')
    .data(maps)
    .enter()
    .append('option')
    .text((d) => d.name)
    .attr('value', (d, i) => i);

  mapSelect.on('change', function () {
    const selectedMap = maps[this.value];
    loadAndDisplayGeoJSON(selectedMap);
  });

  loadAndDisplayGeoJSON(maps[0]);
}

function drawMultipleLineChart(selectedParameter) {
  const multiSvg = select('#multipleLineChartSvg').empty()
    ? select('body')
        .append('svg')
        .attr('id', 'multipleLineChartSvg')
        .attr('width', 960)
        .attr('height', 500)
    : select('#multipleLineChartSvg');
  multiSvg.selectAll('*').remove();

  const margin = {
      top: 20,
      right: 100,
      bottom: 30,
      left: 150,
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  const g = multiSvg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  // Filter data for the selected parameter
  const dataFiltered = csvData.filter(
    (d) => d.Name === selectedParameter,
  );

  const dataGroupedByPlaceAndYear = group(
    dataFiltered,
    (d) => d.Geo_Type_Name,
    (d) => new Date(d.Start_Date).getFullYear(),
  );

  const xScale = scaleTime().range([0, width]);
  const yScale = scaleLinear().range([height, 0]);
  const color = scaleOrdinal(schemeCategory10);

  xScale.domain(
    extent(dataFiltered, (d) => new Date(d.Start_Date)),
  );
  yScale.domain([
    0,
    max(dataFiltered, (d) => +d.Data_Value),
  ]);
  const types = Array.from(
    new Set(dataFiltered.map((d) => d.Geo_Type_Name)),
  );
  const colorScale = scaleOrdinal(schemeCategory10).domain(
    types,
  );

  const lineGenerator = line()
    .x((d) => xScale(new Date(d.Year, 0, 1)))
    .y((d) => yScale(d.Average_Value));

  const linesData = Array.from(
    dataGroupedByPlaceAndYear,
    ([place, yearsMap]) => {
      const yearsData = Array.from(
        yearsMap,
        ([year, values]) => {
          return {
            Year: year,
            Average_Value: mean(
              values,
              (v) => +v.Data_Value,
            ),
          };
        },
      ).sort((a, b) => a.Year - b.Year);
      return { place, values: yearsData };
    },
  );

  linesData.forEach((placeData, index) => {
    g.append('path')
      .datum(placeData.values)
      .attr('fill', 'none')
      .attr('stroke', color(index))
      .attr('stroke-width', 1.5)
      .attr('d', lineGenerator);
  });
  const lines = g
    .selectAll('.line')
    .data(linesData)
    .enter()
    .append('path')
    .attr('class', (d, i) => 'line line-type-' + i)
    .attr('fill', 'none')
    .attr('stroke', (d, i) => colorScale(d.type))
    .attr('stroke-width', 1.5)
    .attr('d', (d) => lineGenerator(d.values))
    .style('opacity', 0.7);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(xScale));
  g.append('g').call(axisLeft(yScale));

  const legend = multiSvg
    .selectAll('.legend')
    .data(linesData)
    .enter()
    .append('g')
    .attr('class', 'legend')

    .attr(
      'transform',
      (d, i) =>
        `translate(${width + margin.left + 20},${i * 20})`,
    )
    .style('cursor', 'pointer')
    .on('click', function (event, d) {
      const isActive = d.active;
      linesData.forEach((d) => (d.active = false));
      d.active = !isActive;

      lines
        .style('stroke-width', (d) => (d.active ? 4 : 1.5))
        .style('opacity', (d) => (d.active ? 1 : 0.7));

      legend
        .selectAll('text')
        .style('font-weight', (d) =>
          d.active ? 'bold' : 'normal',
        );
    });

  legend
    .append('rect')
    .attr('x', 0)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', (d, i) => color(i));

  legend
    .append('text')
    .attr('x', 22)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text((d) => d.place);

  const visualizationTitleSvg = select(
    '#visualizationTitleSvg',
  );
  visualizationTitleSvg.selectAll('*').remove();
  visualizationTitleSvg
    .append('text')
    .attr('x', '100%')
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(
      `Air Quality in ${selectedGeoPlaceName} with Year on X axis and Value on Y axis`,
    );
}

function setupVisualizationParametersDropdown(
  dropdownContainer,
) {
  const visualizationParameters = [
    {
      name: 'Annual vehicle miles traveled',
      value: 'Annual vehicle miles traveled',
    },
    {
      name: 'Annual vehicle miles travelled (cars)',
      value: 'Annual vehicle miles travelled (cars)',
    },
    {
      name: 'Annual Vehicle miles travelled (trucks)',
      value: 'Annual Vehicle miles travelled (trucks)',
    },
    {
      name: 'Asthma emergency department visits due to PM2.5',
      value:
        'Asthma emergency department visits due to PM2.5',
    },
    {
      name: 'Asthma emergency departments visits due to Ozone',
      value:
        'Asthma emergency departments visits due to Ozone',
    },
    {
      name: 'Asthma hospitalizations due to Ozone',
      value: 'Asthma hospitalizations due to Ozone',
    },
    {
      name: 'Boiler Emissions- Total NOx Emissions',
      value: 'Boiler Emissions- Total NOx Emissions',
    },
    {
      name: 'Boiler Emissions- Total PM2.5 Emissions',
      value: 'Boiler Emissions- Total PM2.5 Emissions',
    },
    {
      name: 'Boiler Emissions- Total SO2 Emissions',
      value: 'Boiler Emissions- Total SO2 Emissions',
    },
    {
      name: 'Cardiac and respiratory deaths due to Ozone',
      value: 'Cardiac and respiratory deaths due to Ozone',
    },
    {
      name: 'Cardiovascular hospitalizations due to PM2.5 (age 40+)',
      value:
        'Cardiovascular hospitalizations due to PM2.5 (age 40+)',
    },
    {
      name: 'Deaths due to PM2.5',
      value: 'Deaths due to PM2.5',
    },
    {
      name: 'Fine particles (PM 2.5)',
      value: 'Fine particles (PM 2.5)',
    },
    {
      name: 'Nitrogen dioxide (NO2)',
      value: 'Nitrogen dioxide (NO2)',
    },
    {
      name: 'Outdoor Air Toxics - Benzene',
      value: 'Outdoor Air Toxics - Benzene',
    },
    {
      name: 'Outdoor Air Toxics - Formaldehyde',
      value: 'Outdoor Air Toxics - Formaldehyde',
    },
    { name: 'Ozone (O3)', value: 'Ozone (O3)' },
    {
      name: 'Respiratory hospitalizations due to PM2.5 (age 20+)',
      value:
        'Respiratory hospitalizations due to PM2.5 (age 20+)',
    },
  ];

  let paramSelect = dropdownContainer
    .append('select')
    .attr('id', 'visualizationParamSelect');
  paramSelect
    .selectAll('option')
    .data(visualizationParameters)
    .enter()
    .append('option')
    .text((d) => d.name)
    .attr('value', (d) => d.value);

  paramSelect.on('change', function () {
    const selectedParam = select(this).property('value');

    drawTimeSeriesChart();
    drawMultipleLineChart(selectedParam);
  });
  if (visualizationParameters.length > 0) {
    const initialParam = visualizationParameters[0].value;
    drawTimeSeriesChart(initialParam);
    drawMultipleLineChart(initialParam);
  }
}

function drawTimeSeriesChart() {
  if (
    !selectedGeoPlaceName ||
    !select('#visualizationParamSelect').node()
  )
    return;

  const selectedParam = select(
    '#visualizationParamSelect',
  ).property('value');
  const filteredData = csvData
    .filter((d) => {
      return (
        d.Geo_Place_Name === selectedGeoPlaceName &&
        d.Name === selectedParam
      );
    })
    .map((d) => ({
      Year: new Date(d.Start_Date).getFullYear(),
      Data_Value: +d.Data_Value,
    }))
    .sort((a, b) => a.Year - b.Year);
  const dataByYear = d3.group(filteredData, (d) => d.Year);
  const averagedData = Array.from(
    dataByYear,
    ([year, values]) => ({
      Year: year,
      Data_Value: d3.mean(values, (v) => v.Data_Value),
    }),
  ).sort((a, b) => a.Year - b.Year);

  console.log('Filtered Data:', filteredData);

  const svg = select('#timeSeriesChartSvg').empty()
    ? select('body')
        .append('svg')
        .attr('id', 'timeSeriesChartSvg')
        .attr('width', 960)
        .attr('height', 500)
    : select('#timeSeriesChartSvg');
  svg.selectAll('*').remove();
  if (filteredData.length === 0) {
    svg
      .append('text')
      .attr('x', 480)
      .attr('y', 250)
      .attr('text-anchor', 'middle')
      .text(
        'No data available for the selected region and parameter.',
      );
    console.log('No data to display for selected criteria');
    return;
  }

  const margin = {
      top: 20,
      right: 200,
      bottom: 30,
      left: 50,
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  const x = d3
    .scaleTime()
    .domain(
      d3.extent(
        averagedData,
        (d) => new Date(d.Year, 0, 1),
      ),
    )
    .range([0, width]);
  const svgWidth = 960 + margin.right;

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(averagedData, (d) => d.Data_Value)])
    .range([height, 0]);

  const chartLine = line()
    .x((d) => x(new Date(d.Year, 0, 1)))
    .y((d) => y(d.Data_Value));

  svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    )
    .call(axisLeft(y));
  svg
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${height + margin.top})`,
    )
    .call(axisBottom(x));
  svg
    .append('path')
    .datum(averagedData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', chartLine)
    .attr('transform', `translate(${margin.left},0)`);
  const tooltip = select('body')
    .append('div')
    .style('position', 'absolute')
    .style('text-align', 'center')
    .style('width', '120px')
    .style('height', '28px')
    .style('padding', '2px')
    .style('font', '12px sans-serif')
    .style('background', 'lightsteelblue')
    .style('border', '0px')
    .style('border-radius', '8px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  svg
    .selectAll('.data-point')
    .data(averagedData)
    .enter()
    .append('circle')
    .attr('class', 'data-point')
    .attr('cx', (d) => x(new Date(d.Year, 0, 1)))
    .attr('cy', (d) => y(d.Data_Value))
    .attr('r', 5)
    .attr('fill', 'red')
    .attr('transform', `translate(${margin.left},0)`)
    .on('mouseover', function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      tooltip
        .html(`Year: ${d.Year}<br/>Value: ${d.Data_Value}`)
        .style('left', event.pageX + 5 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', function (d) {
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });
  const existingTitle = select('#visualizationTitle');
  if (!existingTitle.empty()) {
    existingTitle.remove();
  }

  // Append the title below the chart
  const titleSvg = select('body')
    .append('svg')
    .attr('id', 'visualizationTitle')
    .attr('width', svgWidth)
    .attr('height', 60);

  titleSvg
    .append('text')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr('font-weight', 'bold')
    .text(
      `Air Quality in ${selectedGeoPlaceName} with Year on X axis and Value on Y axis`,
    );
}
function addVisualizationTitle() {
  const svg = select('body')
    .append('svg')
    .attr('width', 1500)
    .attr('height', 50);

  svg
    .append('text')
    .attr('x', 600)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr('font-weight', 'bold')
    .text(
      'Air Quality Time series graph for NYC. Select a region code and parameter and click on any region to visualize',
    );
  svg
    .append('text')
    .attr('x', 600)
    .attr('y', 45)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr('font-weight', 'bold')
    .text(
      'Air Qualities in different regions for the selected parameter',
    );
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadCsvData();

  addVisualizationTitle();
  const dropdownContainer = createDropdownContainer();
  setupMapSelectionDropdown(dropdownContainer);
  setupVisualizationParametersDropdown(dropdownContainer);

  select('body')
    .append('svg')
    .attr('id', 'visualizationTitleSvg')
    .attr('width', 900)
    .attr('height', 50);
  const svg = select('body')
    .append('svg')
    .attr('id', 'mapSvg')
    .attr('viewBox', '0 0 960 600')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%')
    .style('height', 'auto');
  function resize() {
    const parentDivWidth =
      select('#mapSvg').node().parentNode.clientWidth;
    svg
      .attr('width', parentDivWidth)
      .attr('height', 'auto');
  }
  window.addEventListener('resize', resize);
  resize();
});
