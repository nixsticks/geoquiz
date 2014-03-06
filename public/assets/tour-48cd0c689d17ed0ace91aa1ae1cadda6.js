$("#map").height(window.innerheight - $(".tooltip").height());

var width = $("#map").width(),
    height = $("#map").height();

var projection = d3.geo.orthographic()
                       .scale(height/2.5)
                       .translate([width/2, height/2.5])
                       .clipAngle(90);

var path = d3.geo.path().projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#map").append("svg")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("preserveAspectRatio", "xMidYMid");

var title = d3.select(".tooltip h1");

var names = {};

var globe = svg.append("path")
               .datum({type: "Sphere"})
               .attr("id", "globe")
               .attr("d", path);

d3.json("/datafiles/world.json", function(error, data) {
  var countries = topojson.feature(data, data.objects.units).features,
      i = -1,
      n = countries.length;

  svg.selectAll("path.land")
     .data(topojson.feature(data, data.objects.units).features)
     .enter().append("path")
     .attr("class", "unit")
     .attr("d", path);

  svg.insert("path", ".graticule")
     .datum(topojson.mesh(data, data.objects.units, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  countries = countries.sort(function(a, b) {
    return a.properties.name.localeCompare(b.properties.name);
  });

  transition();

  function transition() {
    d3.transition()
      .duration(1500)
      .each("start", function() {
        title.text(countries[i = (i + 1) % n].properties.name);
      })
      .tween("rotate", function() {
        var p = d3.geo.centroid(countries[i]),
            r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svg.selectAll("path").attr("d", path)
            .classed("active", function(d) { return d.id === countries[i].id; });
          }
        })
      .transition()
        .each("end", transition);
  }
});
