var data = gon.data,
    width = 300,
    barHeight = 30,
    height = barHeight * data.length || 100,
    scale = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d.percentage; })])
              .range([0, width]),
    chart = d3.select("#countrydata").append("svg")
            .attr("width", width)
            .attr("height", height),
    bar = chart.selectAll("g")
             .data(data)
             .enter().append("g")
             .attr("transform", function(d, i) {
              return "translate(0," + i * barHeight + ")";
             });

bar.append("rect")
   .attr("class", "bar")
   .attr("width", function(d) { return scale(d.percentage) - 30; })
   .attr("height", barHeight - 1);

bar.append("text")
   .attr("class", "barlabel")
   .attr("x", function(d) { return scale(d.percentage) / 2; })
   .attr("y", barHeight / 2)
   .attr("dy", ".35em")
   .text(function(d) {
    return (d.answer + ", " + d.percentage + "%" );
   });