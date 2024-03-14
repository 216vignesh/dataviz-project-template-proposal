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

In this visualization, there is a map which shows different regions in New York City which the user can select. After selecting the region, the user needs to also select a parameter that he/she needs to visualize from the drop down menu. Once this is selected, a time series graph will be displayed where the parameter will be visualized against time in that particular region.
With this we can answer the questions mentioned above like checking NO2 levels across different regions over time, comparing NO2 level within a timeframe, impact of selecting different air quality criteria and making the visualizations more user friendly.


## Prototypes

I’ve created a proof of concept visualization of this data. It's a bar chart and it shows top 5 regions with high NO2 levels. Also I have added new techniques to it like adding legends, color of the bar according to the values, hovering over to get the values, etc.

![Picture2](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/3a112698-ac86-46f9-bf1b-771b6eb02c50)
![Picture1](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/25be86eb-90b0-40f2-a121-e4f8be6a3226)

Links to prototypes:
https://vizhub.com/216vignesh/7bdfc6d96fc44dce847ac5bbb234d657
https://vizhub.com/216vignesh/a85e0ae7a2384b10a598b03d23899210

## Open Questions

How will geographic shapes for the map be integrated and matched with air quality data from different regions?
Is the data granular and consistent enough across regions and time periods to allow for meaningful comparisons and visualizations?
How can we ensure the interface is intuitive and accessible for users?

## Milestones
Week 1: Research and data preparation including gathering all necessary air quality data, preparing geographic data for the map, and ensuring data consistency.
Week 2: Prototype development. Begin the development of the interactive map
Week 3: Adding interactive elements and criteria selection.
Week 4: Usability testing and refinement. 
Week 5: Final adjustments and project completion
