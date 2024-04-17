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
} from 'd3';

let csvData = null;
let selectedGeoPlaceName = null; // This will store the Geo_Place_Name from the clicked region

async function loadCsvData() {
  csvData = await csv('data.csv');
  console.log('CSV Data Loaded', csvData); // Check what the data looks like
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
    : select('#mapSvg');
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
      return colorScale(averages[regionName] || 0); // Apply color based on average
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
        d.properties.uhf_neigh;
      console.log(
        'Region Selected: ',
        selectedGeoPlaceName,
      ); // Debug which region is selected
      drawTimeSeriesChart();
    });
}

function setupMapSelectionDropdown() {
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
      // url: 'https://raw.githubusercontent.com/nycehs/NYC_geography/master/CD.geo.json',
      url: 'https://gist.githubusercontent.com/mgiraldo/9cafbc5e9f562e326ebe/raw/edca02adcdd5191eaa53d127da303c905f276f46/nyc-community-districts.geojson',
      fillColor: 'lightgoldenrodyellow',
      strokeColor: 'black',
    },
  ];

  let mapSelect = select('body')
    .append('select')
    .attr('id', 'mapSelect');
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

  loadAndDisplayGeoJSON(maps[0]); // Load the first map by default
}

function setupVisualizationParametersDropdown() {
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

  let paramSelect = select('body')
    .append('select')
    .attr('id', 'visualizationParamSelect');
  paramSelect
    .selectAll('option')
    .data(visualizationParameters)
    .enter()
    .append('option')
    .text((d) => d.name)
    .attr('value', (d) => d.value);

  paramSelect.on('change', drawTimeSeriesChart);
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
      // Log each Geo_Place_Name being processed
      // console.log(
      //   'Processing:',
      //   d.Geo_Place_Name,
      //   'Selected:',
      //   selectedGeoPlaceName,
      //   'selectedParam:',
      //   d.Name,
      //   d.Geo_Place_Name === selectedGeoPlaceName &&
      //     d.Name === selectedParam,
      // );

      // Filter condition
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

  // Additional logging to check the outcome of the filter
  console.log('Filtered Data:', filteredData);

  const svg = select('#timeSeriesChartSvg').empty()
    ? select('body')
        .append('svg')
        .attr('id', 'timeSeriesChartSvg')
        .attr('width', 960)
        .attr('height', 500)
    : select('#timeSeriesChartSvg');
  svg.selectAll('*').remove(); // Clear previous chart
  if (filteredData.length === 0) {
    // If no data is available, show a placeholder text or clear view
    svg
      .append('text')
      .attr('x', 480) // Center text horizontally
      .attr('y', 250) // Center text vertically
      .attr('text-anchor', 'middle') // Center the anchor at middle of text
      .text(
        'No data available for the selected region and parameter.',
      );
    console.log('No data to display for selected criteria');
    return;
  }
  const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50,
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  const x = scaleTime()
    .domain(
      extent(filteredData, (d) => new Date(d.Year, 0, 1)),
    )
    .range([0, width]);
  const y = scaleLinear()
    .domain([0, max(filteredData, (d) => d.Data_Value)])
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
    .datum(filteredData)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', chartLine)
    .attr('transform', `translate(${margin.left},0)`);
  // const g = svg
  //   .append('g')
  //   .attr(
  //     'transform',
  //     `translate(${margin.left},${margin.top})`,
  //   );
  // g.selectAll('circle')
  //   .data(filteredData)
  //   .enter()
  //   .append('circle')
  //   .attr('fill', 'red')
  //   .attr('r', 5)
  //   .attr('cx', (d) => x(new Date(d.Year, 0, 1)))
  //   .attr('cy', (d) => y(d.Data_Value))
  //   .on('mouseover', (event, d) => {
  //     select('.tooltip')
  //       .style('opacity', 1)
  //       .html(`Year: ${d.Year}<br/>Value: ${d.Data_Value}`)
  //       .style('left', `${event.pageX + 10}px`)
  //       .style('top', `${event.pageY - 28}px`);
  //   })
  //   .on('mouseout', () => {
  //     select('.tooltip').style('opacity', 0);
  //   });
  // const tooltip = select('body')
  //   .append('div')
  //   .attr('class', 'tooltip')
  //   .style('opacity', 0)
  //   .style('position', 'absolute')
  //   .style('padding', '10px')
  //   .style('background', 'white')
  //   .style('border', '1px solid black')
  //   .style('border-radius', '5px')
  //   .style('pointer-events', 'none');
}
function addVisualizationTitle() {
  const svg = select('body')
    .append('svg')
    .attr('width', 960)
    .attr('height', 50);

  svg
    .append('text')
    .attr('x', 480)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '24px')
    .attr('font-weight', 'bold')
    .text(
      'Air Quality Time series graph for NYC. Select a region code and parameter and click on any region to visualize',
    );
}
document.addEventListener('DOMContentLoaded', async () => {
  await loadCsvData();
  addVisualizationTitle();
  setupMapSelectionDropdown();
  setupVisualizationParametersDropdown();
});
