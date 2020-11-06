//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa().translate([width/2, height/2]).scale([1000]);

// Define path generator
var path = d3.geo.path().projection(projection);

// Define linear scale for output
var color = d3.scale.linear().range(["rgb(255,0,0)","rgb(0,0,255)"]);
var legendText = ["Democratic","Republican"];

//Create SVG element and append map to the SVG
var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Load in my states data!
d3.json("../static/data/vizdata/vizbaby.json", function(data) {
    color.domain([0,1]);
    data = data['2012']
    // Load GeoJSON data and merge with states data
    d3.json("../static/geo/us-states.geojson", function(json) {

        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {

            // Grab State Name
            var dataState = data[i].state;

            // Grab data value
            var dataValue = data[i].state_majority;

            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++)  {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                    // Copy the data value into the JSON
                    json.features[j].properties.state_majority = dataValue;

                // Stop looking through the JSON
                break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {
                var value = d.properties.state_majority;
                if (value == "Republican") {
                    var val = 0
                }else{
                    var val = 1
                }
                return color(val)
        });


    // Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
    var legend = d3.select("body").append("svg")
                    .attr("class", "legend")
                    .attr("width", 140)
                    .attr("height", 200)
                    .selectAll("g")
                    .data(color.domain().slice().reverse())
                    .enter()
                    .append("g")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

        legend.append("text")
              .data(legendText)
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .text(function(d) { return d; });
        });

});
