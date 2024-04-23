# Data Visualization Project

## Data

The data I propose to visualize for my project is New York City air quality surveillance data. Air pollution is one of the most important environmental threat and many people are exposed to bad quality air every now and then. Exposures to common air pollutants have been a cause of respiratory and cardiovascular diseases, cancers, and premature deaths. The indicators in the dataset provide a perspective across time and regions in NYC to characterize air quality and health in the city.

Link to dataset : https://catalog.data.gov/dataset/air-quality

## Questions & Accomplishments

The following accomplishments and questions will drive the visualization and interaction decisions for this project:

 * How do NO2 levels vary across different regions over time?
   A time series graph has been implemented which shows the variation of NO2 levels as well as other parameters over time. Users need to select the regions on the map for which they need to see the variation of several parameters over time and also the parameter they       want to visualize

 * What is the impact of selecting different air quality criteria?
   The task is to explore how the choice of criteria influences the understanding of air quality in different areas. The visualization shows how different parameters like NO2 level, Deaths due to PM2.5, etc. has affected the city over time.
   
 * How user-friendly and intuitive is the interactive visualization for non-expert users?
   This task focuses on assessing the usability of the interactive visualization, ensuring that it is accessible to all. The visualization is user friendly and helps to navigate to the graphs easily and also understand the graph in much detail.

## Sketches

![Picture3](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/c7ee878a-6bb4-4f31-af96-a76679b1b9d4)

In this visualization, there is a map which shows different regions in New York City which the user can select. The map is created using New York City GeoJSON data which is available in the below URL:
https://github.com/nycehs/NYC_geography/blob/master/UHF34.geo.json?short_path=718030a. From the dataset we have Geo_Type_Name, Geo_Join_ID to uniquely determine the Geo_Place_Name and we could identify these areas from the GeoJSON file we have here in the mentioned GitHub link. After selecting the region, the user needs to also select a parameter that he/she needs to visualize from the drop down menu. Once this is selected, a time series graph will be displayed where the parameter will be visualized against time in that particular region.
With this we can answer the questions mentioned above like checking NO2 levels across different regions over time, comparing NO2 level within a timeframe, impact of selecting different air quality criteria and making the visualizations more user friendly.

This is an example of how the GeoJSON file looks
![github](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/cecaa2d0-db91-4789-98b3-49d3444584a7)


## Visualization outputs

I have created the visualizations as per the above sketch using D3.js. Here is the complete snapshot of how the visualization looks like:

![image](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/1d5eb5f3-045b-4a3b-95e1-bff1646f2575)

![image](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/3a22cac3-da2d-4167-9e84-ec7d79c6f866)

![image](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/8b64ede2-1156-45b5-9af3-806220de1adb)

The first image is a multiple line graph showing average Air Quality levels for the selected parameters across four divisions of NYC i.e. UHF34, UHF42, Borough and Community District(CD). Here the selected parameter is Nitrogen Dioxide (NO2) levels.
The second image is a map of the selected division (i.e. UHF34). The overall air quality is represented as a heatmap on top of the map with the darkest colors representing worser conditions and the lighter ones representing good conditions.
The third image is the trend of the selected parameter over the years. It can be seen as a time series graph with years on the X axis and Value on the Y axis.

Also here is the vizhub URL to the project:
https://vizhub.com/216vignesh/d52365615c8d40f0af3905df1a41eab0

I’ve also created a proof of concept visualization of this data. It's a bar chart and it shows top 5 regions with high NO2 levels. Also I have added new techniques to it like adding legends, color of the bar according to the values, hovering over to get the values, etc.

![Picture2](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/3a112698-ac86-46f9-bf1b-771b6eb02c50)
![Picture1](https://github.com/216vignesh/dataviz-project-template-proposal/assets/31122509/25be86eb-90b0-40f2-a121-e4f8be6a3226)

Links to prototypes:
https://vizhub.com/216vignesh/7bdfc6d96fc44dce847ac5bbb234d657
https://vizhub.com/216vignesh/a85e0ae7a2384b10a598b03d23899210

## Open Questions

How will geographic shapes for the map be integrated and matched with air quality data from different regions?
This has been done using the GeoJSON file we got from the above mentioned github link.

Is the data granular and consistent enough across regions and time periods to allow for meaningful comparisons and visualizations?
Yes the data is granular and consistent across regions and it allows meaningful comparisons of different air quality parameters across regions.

How can we ensure the interface is intuitive and accessible for users?
The interface is easy to use and the user just needs to select the region and the parameter to visualize.

## Milestones
Week 1: Research and data preparation including gathering all necessary air quality data, preparing geographic data for the map, and ensuring data consistency.
Week 2: Prototype development. Begin the development of the interactive map
Week 3: Adding interactive elements and criteria selection.
Week 4: Usability testing and refinement. 
Week 5: Final adjustments and project completion

## Conclusion:
This project effectively captures the data visualization of New York City's air quality, offering a comprehensive understanding of how air pollutants like NO2 fluctuate throughout various time periods and geographical areas. In addition to improving understanding of regional air quality trends, the interactive map selection feature that allows users to select different regions and view different air quality parameters in a time series format also gives users the ability to make well-informed observations about the environmental conditions affecting New York City.
In order to create this visualization, sophisticated D3.js techniques were used to render GeoJSON data efficiently. This resulted in an easy-to-use mapping interface where regions could be chosen and the relevant data could be shown dynamically. A thorough understanding of air quality trends is provided by the integration of numerous line graphs and heatmaps, which clearly illustrate the city's evolution in relation to air quality parameters such as NO2 levels and PM2.5-related fatalities
To conclude, this study not only answers the basic questions but also emphasizes how important good data visualization is for environmental monitoring and raising public health awareness. It lays the groundwork for upcoming improvements like adding more detailed data integration and extending interactive capabilities to include estimating air quality using predictive analytics.
