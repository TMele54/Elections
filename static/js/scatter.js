
// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 100, left: 30},
    width = 800 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.json("../static/data/vizdata/vizbaby.json", function(data) {

          var ob_lst = []
          $.each(data,function(index,value_list){
              $.each(value_list,function(index,value) {
                var ob = {}
                ob["year"] = value["year"]
                ob["state"] = value["state"]
                ob["winner"] = value["state_majority"]
                ob["points"] = value["points"]
                ob_lst.push(ob)
              });
          });

          var nested_data = d3.nest()
            .key(function(d) {if(d.state != "Totals"){return d.state}else{return null}}).sortKeys(d3.ascending)
            .rollup(function(leaves) { return leaves.length; })
            .entries(ob_lst);

          var states=[]
          $.each(nested_data,function(index,value){
                if(value['key'] != "null"){
                    states.push(value['key']);
                }

          });

          var x = d3.scalePoint().domain(states).range([0, width]);
          svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(51))
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(90)")
                .style("text-anchor", "start");

          svg.append("text").attr("text-anchor", "end").attr("x", 0).attr("y", height+100 ).text("States").attr("text-anchor", "start");

          var y = d3.scaleLinear().domain([35, 90]).range([ height, 35]);
          svg.append("g").call(d3.axisLeft(y));
          svg.append("text").attr("text-anchor", "end").attr("x", 0).attr("y", -20 ).text("Votes").attr("text-anchor", "start")

          var z = d3.scaleSqrt().domain([200000, 1310000000]).range([ 2, 30]);

          var myColor = d3.scaleOrdinal().domain(["Republican","Democrat"]).range(d3.schemeSet1);

          var tooltip = d3.select("#scatter")
            .append("div")
              .style("opacity", 0)
              .attr("class", "tooltip")
              .style("background-color", "black")
              .style("border-radius", "5px")
              .style("padding", "10px")
              .style("color", "white")

          var showTooltip = function(d) {
            tooltip
              .transition()
              .duration(200)
            tooltip
              .style("opacity", 1)
              .html("Country: " + d.country)
              .style("left", (d3.mouse(this)[0]+30) + "px")
              .style("top", (d3.mouse(this)[1]+30) + "px")
          }
          var moveTooltip = function(d) {
            tooltip
              .style("left", (d3.mouse(this)[0]+30) + "px")
              .style("top", (d3.mouse(this)[1]+30) + "px")
          }
          var hideTooltip = function(d) {
            tooltip
              .transition()
              .duration(200)
              .style("opacity", 0)
          }
          var highlight = function(d){
            // reduce opacity of all groups
            d3.selectAll(".bubbles").style("opacity", .05)
            // expect the one that is hovered
            d3.selectAll("."+d).style("opacity", 1)
          }
          var noHighlight = function(d){
            d3.selectAll(".bubbles").style("opacity", 1)
          }


          // ---------------------------//
          //       CIRCLES              //
          // ---------------------------//


          var votes = d3.nest().key(function(d) {return d.state}).sortKeys(d3.ascending)


              .rollup(

                            function(v) {
                                console.log(v.winner);
                                return {
                                    count: v.length,
                                    total: d3.sum(v, function(d) { return d.points; }),
                                    avg: d3.mean(v, function(d) { return d.points; })
                                };
                            })





              .entries(ob_lst);

          console.log("VOTES:::",votes)

          // Add dots
          svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("class", function(d) { return "bubbles " + d.state_majority })
              .attr("cx", function (d) { return x(d.state); } )
              .attr("cy", function (d) { return y(d.points); } )
              .attr("r", function (d) { return z(d.points); } )
              .style("fill", function (d) { return myColor(d.state_majority); } )
            // -3- Trigger the functions for hover
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )



            // ---------------------------//
            //       LEGEND              //
            // ---------------------------//

            // Add legend: circles
            var valuesToShow = [10000000, 100000000, 1000000000]
            var xCircle = 150
            var xLabel = 245
            svg
              .selectAll("legend")
              .data(valuesToShow)
              .enter()
              .append("circle")
                .attr("cx", xCircle)
                .attr("cy", function(d){ return height - 245 - z(d) } )
                .attr("r", function(d){ return z(d) })
                .style("fill", "none")
                .attr("stroke", "black")

            // Add legend: segments
            svg
              .selectAll("legend")
              .data(valuesToShow)
              .enter()
              .append("line")
                .attr('x1', function(d){ return xCircle + z(d) } )
                .attr('x2', xLabel)
                .attr('y1', function(d){ return height - 245 - z(d) } )
                .attr('y2', function(d){ return height - 245 - z(d) } )
                .attr('stroke', 'black')
                .style('stroke-dasharray', ('2,2'))

            // Add legend: labels
            svg
              .selectAll("legend")
              .data(valuesToShow)
              .enter()
              .append("text")
                .attr('x', xLabel)
                .attr('y', function(d){ return height - 245 - z(d) } )
                .text( function(d){ return d/1000000 } )
                .style("font-size", 10)
                .attr('alignment-baseline', 'middle')

            // Add one dot in the legend for each name.
            var size = 20
            var allgroups = ["Republican", "Democrat"]
            svg.selectAll("myrect")
              .data(allgroups)
              .enter()
              .append("circle")
                .attr("cx", 10)
                .attr("cy", function(d,i){ return i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d){ return myColor(d)})
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)


            // Add labels beside legend dots
            svg.selectAll("mylabels")
              .data(allgroups)
              .enter()
              .append("text")
                .attr("x", 5 + size*.8)
                .attr("y", function(d,i){ return i * (size + 5) +2}) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", function(d){ return myColor(d)})
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .on("mouseover", highlight)
                .on("mouseleave", noHighlight)
          })