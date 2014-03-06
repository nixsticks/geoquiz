var width = 800,
    height = 800;

var projection = d3.geo.orthographic()
                       .scale(350)
                       .translate([width/2, height/2])
                       .clipAngle(90);

var path = d3.geo.path().projection(projection);

var graticule = d3.geo.graticule();

// var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(c);

var names = {};

var places;

// svg.append("path")
//    .datum({type: "Sphere"})
//    .attr("id", "globe")
//    .attr("d", path);

// svg.append("path")
//    .datum(graticule)
//    .attr("class", "graticule")
//    .attr("d", path);

queue()
.defer(d3.json, "/datafiles/world.json")
.defer(d3.tsv, "/datafiles/countrynames.tsv")
.await(ready);

function ready(error, world, places) {
  places.forEach(function(d) {
    names[d.id] = d.name;
  });

  var land = topojson.feature(world, world.objects.land),
 countries = topojson.feature(world, world.objects.countries).features,
   borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
         i = -1,
         n = countries.length;

  countries = countries.filter(function (d) {
    return places.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  });

  function transition() {
    d3.transition()
      .duration(1250)
      .each("start", function() {
          d3.select("h1").text(countries[i = (i + 1) % n].name);
      })
      .tween("rotate", function() {
        var p = d3.geo.centroid(countries[i]),
            r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          c.clearRect(0, 0, width, height);
          c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
          c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
          c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
          // c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
        };
      })
    .transition()
      .each("end", transition);
  }

  transition();
}

  // var globe = {type: "Sphere"},
  //     land = topojson.feature(world, world.objects.land),
  //     countries = topojson.feature(world, world.objects.countries).features,
  //     borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
  //     i = -1,
  //     n = countries.length;

var drag = d3.behavior.drag().on('drag', function() {
  var start = { 
    lon: projection.rotate()[0], 
    lat: projection.rotate()[1]
  },

  delta = { 
    x: d3.event.dx,
    y: d3.event.dy  
  },
    
  scale = 0.25,

  end = { 
    lon: start.lon + delta.x * scale, 
    lat: start.lat - delta.y * scale 
  };

  end.lat = end.lat >  30 ?  30 :
            end.lat < -30 ? -30 :
            end.lat;
  
  projection.rotate([end.lon,end.lat]);

  svg.selectAll("path").attr("d", path);
});
