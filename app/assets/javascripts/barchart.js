var data = gon.data,
    width = $("#unitdata").width(),
    barHeight = 25,
    height = barHeight * data.length,
    scale = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d.percentage; })])
              .range([0, width]),
    chart = d3.select("#unitdata").append("svg")
            .attr("class", "barchart")
            .attr("width", width)
            .attr("height", height);
    bar = chart.selectAll("g")
             .data(data)
             .enter().append("g")
             .attr("transform", function(d, i) {
              return "translate(0," + i * barHeight + ")";
             });

bar.append("rect")
   .attr("class", "bar")
   .attr("width", function(d) { return scale(d.percentage); })
   .attr("height", barHeight - 2);

bar.append("text")
   .attr("class", "barlabel")
   .attr("x", 3)
   .attr("y", barHeight / 2)
   .attr("dy", ".35em")
   .text(function(d) {
    return (d.answer + ", " + d.percentage + "%" );
   });