# Data Visualization Project

## Data

The data I propose to visualize for my project is New York City air quality surveillance data. Air pollution is one of the most important environmental threat and many people are exposed to bad quality air every now and then. Exposures to common air pollutants have been a cause of respiratory and cardiovascular diseases, cancers, and premature deaths. The indicators in the dataset provide a perspective across time and regions in NYC to characterize air quality and health in the city.

Link to dataset : https://catalog.data.gov/dataset/air-quality

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * How do NO2 levels vary across different regions over time?
   We need to explore spatial and temporal trends in air quality data, focusing on NO2 levels for various areas
 * Can users compare NO2 level across different regions within a specific timeframe?
   Task is to enable users to select regions on map and visualize NO2 or other parameters over the period.
 * What is the impact of selecting different air quality criteria?
   The task is to explore how the choice of criteria influences the understanding of air quality in different areas.
 * How user-friendly and intuitive is the interactive visualization for non-expert users?
   This task focuses on assessing the usability of the interactive visualization, ensuring that it is accessible to all.

## Sketches

![Picture3](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/c7ee878a-6bb4-4f31-af96-a76679b1b9d4)

In this visualization, there is a map which shows different regions in New York City which the user can select. The map can be created using New York City GeoJSON data which is available in the below URL:
https://github.com/nycehs/NYC_geography/blob/master/UHF34.geo.json?short_path=718030a. From the dataset we have Geo_Type_Name, Geo_Join_ID to uniquely determine the Geo_Place_Name and we could identify these areas from the GeoJSON file we have here in the mentioned GitHub link. After selecting the region, the user needs to also select a parameter that he/she needs to visualize from the drop down menu. Once this is selected, a time series graph will be displayed where the parameter will be visualized against time in that particular region.
With this we can answer the questions mentioned above like checking NO2 levels across different regions over time, comparing NO2 level within a timeframe, impact of selecting different air quality criteria and making the visualizations more user friendly.

This is an example of how the GeoJSON file looks
![github](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/cecaa2d0-db91-4789-98b3-49d3444584a7)


## Prototypes

I’ve created a proof of concept visualization of this data. It's a bar chart and it shows top 5 regions with high NO2 levels. Also I have added new techniques to it like adding legends, color of the bar according to the values, hovering over to get the values, etc.

![Picture2](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/3a112698-ac86-46f9-bf1b-771b6eb02c50)
![Picture1](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/25be86eb-90b0-40f2-a121-e4f8be6a3226)

Links to prototypes:
https://vizhub.com/216vignesh/7bdfc6d96fc44dce847ac5bbb234d657
https://vizhub.com/216vignesh/a85e0ae7a2384b10a598b03d23899210

## Open Questions

How will geographic shapes for the map be integrated and matched with air quality data from different regions?
This can be done using the GeoJSON file we got from the above mentioned github link.

Is the data granular and consistent enough across regions and time periods to allow for meaningful comparisons and visualizations?
How can we ensure the interface is intuitive and accessible for users?

## Milestones
Week 1: Research and data preparation including gathering all necessary air quality data, preparing geographic data for the map, and ensuring data consistency.
Week 2: Prototype development. Begin the development of the interactive map
Week 3: Adding interactive elements and criteria selection.
Week 4: Usability testing and refinement. 
Week 5: Final adjustments and project completion

Project Self Critique and Prioritization:
Does the visualization answer initial questions?
The code integrates a map that allows users to click on different regions and dynamically updates time series chart based on the geoplace name and the parameter chosen, so it aligns with the initial questions.
Upon selection of a map region and a parameter, the code effectively filters csvData and updates the visualization to reflect these selections. This ensures that users can obtain specific insights into how various factors (as represented by the Name parameters) vary across different geographical areas over time.


Aesthetics : The code sets up a visual representation that includes a map and a time series chart, which are fundamental elements for spatial and temporal data analysis. In order to enhance the asthetics, I could add color legends for both map and graph to provide context on the data. I could also improve the styling of the map and place it properly on the screen for easy readability. Also I could make the visualization more interactive by adding tooltips that display when hovering over the map. Also I need to improve the clarity of the visualization.

I need to ensure that the visualization adjusts gracefully for different screen sizes and devices to improve accessibility and user experience.
