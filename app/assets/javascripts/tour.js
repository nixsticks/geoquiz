var width = window.innerWidth,
    height = window.innerHeight;

var projection = d3.geo.orthographic()
                  .scale(width / 5)
                  .translate([width/2, height/2])
                  .clipAngle(90),
    path = d3.geo.path().projection(projection);

var svg = d3.select("body").append("svg")
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMidYMid"),
    g = svg.append("g");

g.append("path")
 .datum({type: "Sphere"})
 .attr("id", "globe");

d3.json("/datafiles/world.json", function(error, data) {
  g.append("rect")
   .attr("class", "transparent")
   .attr("width", width)
   .attr("height", height);

  g.append("g")
   .selectAll("path.green")
   .data(topojson.feature(data, data.objects.units).features)
   .enter().append("path")
   .attr("class", "green")
   .attr("d", path);

  g.append("path")
   .datum(topojson.mesh(data, data.objects.units, function(a, b) { return a !== b; }))
   .attr("class", "boundary")
   .attr("d", path);
});