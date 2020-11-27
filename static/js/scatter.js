function scatter(container, data){
        
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 150, bottom: 100, left: 40}
    var width = 800 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
    .rollup(function(leaves) { return leaves.length; }).entries(ob_lst);
  var votes = d3.nest().key(function(d) {return d.state}).sortKeys(d3.ascending).rollup(function(v) {
                return {
                    number_elections: v.length,
                    total_votes: d3.sum(v, function(d) {if(d["winner"] == "Democrat"){return d.points;}}),
                    all_votes: d3.sum(v, function(d) {return d.points;}),
                    avg_voting_power: d3.mean(v, function(d) { return d.points; }),
                    type: "Democrat"
                };
            }).entries(ob_lst);
  var Rvotes = d3.nest().key(function(d) {return d.state}).sortKeys(d3.ascending).rollup(function(v) {
                return {
                    number_elections: v.length,
                    total_votes: d3.sum(v, function(d) {if(d["winner"] == "Republican"){return d.points;}}),
                    all_votes: d3.sum(v, function(d) {return d.points;}),
                    avg_voting_power: d3.mean(v, function(d) { return d.points; }),
                    type: "Republican"
                };
            }).entries(ob_lst);
  var all_votes = d3.nest().key(function(d) {return d.state}).sortKeys(d3.ascending).rollup(function(v) {
                return {
                    number_elections: v.length,
                    total_votes: d3.sum(v, function(d) {if(d["winner"] == "Democrat"){return d.points;}}),
                    all_votes: d3.sum(v, function(d) {return d.points;}),
                    avg_voting_power: d3.mean(v, function(d) { return d.points; }),
                    type: "Democrat"
                };
            }).entries(ob_lst);
  Array.prototype.push.apply(votes,Rvotes);
  Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
  var states_sort = Rvotes.sort(function(a, b) { return a["value"]["all_votes"] - b["value"]["all_votes"]; });
  var all_votes = all_votes.sort(function(a, b) { return a["value"]["all_votes"] - b["value"]["all_votes"]; });
  var states=[]
  $.each(states_sort,function(index,value){
        if(value['key'] != "null"){
            states.push(value['key']);
        }

  });
  states.remove("Totals")
  var x = d3.scalePoint().domain(states).range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(51))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

  svg.append("text").attr("text-anchor", "end").attr("x", 0).attr("y", height+130 ).text("States").attr("text-anchor", "start");

  var y = d3.scaleLinear().domain([1, 1200]).range([ height, 35]);
  svg.append("g").call(d3.axisLeft(y));
  svg.append("text").attr("text-anchor", "end").attr("x", 0).attr("y", -20 ).text("Total Influence (1900-2016)").attr("text-anchor", "start")

  var z = d3.scaleLinear().domain([1, 50]).range([1, 10]);
  var o = d3.scaleLinear().domain([1, 50]).range([0.250,1]);

  var myColor = d3.scaleOrdinal().domain(["Republican","Democrat"]).range(d3.schemeSet1);

  var tooltip = d3.select(container)
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "black")

  var showTooltip = function(d) {
    tooltip.transition().duration(1000)
    tooltip
      .style("opacity", 1)
      .html(
          "State: " + d["key"] + "<br>" +
          "Party: " + d["value"]["type"] + "<br>" +
          "Average Voting Power: " + d["value"]["avg_voting_power"] + "<br>" +
          "Number of Elections: "  + d["value"]["number_elections"]

        )
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
      .duration(1000)
      .style("opacity", 0)
  }
  var highlight   = function(d) {
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("visibility", "hidden")
    // expect the one that is hovered
    d3.selectAll("."+d).style("visibility", "visible")
  }
  var noHighlight = function(d) {
    d3.selectAll(".bubbles").style("visibility", "visible")
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(votes)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "bubbles " + d["value"]["type"]})
      .attr("cx", function (d) { return x(d["key"]); } )
      .attr("cy", function (d) { return y(d["value"]["total_votes"]); } )
      .attr("r", function (d) { return z(d["value"]["number_elections"]); } )
      .style("fill", function (d) { return myColor(d["value"]["type"]); } )
      .style("opacity", function (d) { return o(d["value"]["avg_voting_power"]); } )
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(all_votes)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d["key"]); } )
      .attr("cy", function (d) { return y(d["value"]["all_votes"]); } )
      .attr("r", 5)
      .style("fill", "#4B0082")
      .style("opacity", 1)

    // Add the line
    svg.append("path")
        .datum(all_votes)
        .attr("fill", "none")
        .attr("stroke", "#4B0082")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line().x(function(d) { return x(d["key"]) }).y(function(d) { return y(d["value"]["all_votes"]) }))

    // Add legend: circles
    var valuesToShow = [10, 50, 100]
    var xCircle = 150
    var xLabel = 245
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return height - 425 - z(d) } )
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
        .attr('y1', function(d){ return height - 425 - z(d) } )
        .attr('y2', function(d){ return height - 425 - z(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - 425 - z(d) } )
        .text( function(d){ return d/10 } )
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
  }
