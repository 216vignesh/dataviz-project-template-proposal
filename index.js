import {
    select,
    csv,
    json,
    geoPath,
    geoMercator,
    scaleTime,
    scaleLinear,
    max,
    extent,
    line,
    axisLeft,
    axisBottom,
  } from 'd3';
  
  let csvData = null;
  let selectedGeoPlaceName = null; // This will store the Geo_Place_Name from the clicked region
  
  async function loadCsvData() {
    csvData = await csv('data.csv');
  }
  
  async function loadAndDisplayGeoJSON(selectedMap) {
    const svg = select('#mapSvg').empty()
      ? select('body')
          .append('svg')
          .attr('id', 'mapSvg')
          .attr('width', 960)
          .attr('height', 600)
      : select('#mapSvg');
    svg.selectAll('*').remove(); // Clear the SVG for new map data
  
    const response = await fetch(selectedMap.url);
    const data = await response.json();
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
      .attr('fill', selectedMap.fillColor)
      .attr('stroke', selectedMap.strokeColor)
      .attr('stroke-width', 0.5)
      .on('click', function (event, d) {
        selectedGeoPlaceName =
          d.properties.Geo_Place_Name ||
          d.properties.BoroName ||
          d.properties.GEONAME ||
          d.properties.uhf_neigh; // Use the correct property for Geo_Place_Name
        drawTimeSeriesChart(); // Trigger the chart update when a region is clicked
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
      .attr('value', (d, i) => i); // Use index as value if URL is not unique or as a simple identifier
  
    mapSelect.on('change', function () {
      const selectedMapIndex = this.value;
      const selectedMap = maps[selectedMapIndex];
      loadAndDisplayGeoJSON(selectedMap);
    });
  
    // Load the first map by default
    if (maps.length > 0) loadAndDisplayGeoJSON(maps[0]);
  }
  
  function setupVisualizationParametersDropdown() {
    const visualizationParameters = [
      {
        name: 'Annual Vehicle Miles Travelled',
        value: 'Annual Vehicle Miles Travelled',
      },
      {
        name: 'Annual Vehicle Miles Travelled(Cars)',
        value: 'Annual Vehicle Miles Travelled(Cars)',
      },
      {
        name: 'Annual Vehicle Miles Travelled(Trucks)',
        value: 'Annual Vehicle Miles Travelled(Trucks)',
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
        name: 'Outdoor Air Toxics - Benzene',
        value: 'Nitrogen dioxide (NO2)',
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
      .filter(
        (d) =>
          d.Geo_Place_Name === selectedGeoPlaceName &&
          d.Name === selectedParam,
      )
      .map((d) => ({
        Year: new Date(d.Start_Date).getFullYear(),
        Data_Value: +d.Data_Value,
      }))
      .sort((a, b) => a.Year - b.Year);
  
    const svg = select('#timeSeriesChartSvg').empty()
      ? select('body')
          .append('svg')
          .attr('id', 'timeSeriesChartSvg')
          .attr('width', 960)
          .attr('height', 500)
      : select('#timeSeriesChartSvg');
    svg.selectAll('*').remove(); // Clear previous chart
  
    const margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50,
      },
      width = +svg.attr('width') - margin.left - margin.right,
      height =
        +svg.attr('height') - margin.top - margin.bottom;
  
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
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    await loadCsvData();
    setupMapSelectionDropdown();
    setupVisualizationParametersDropdown();
  });
  