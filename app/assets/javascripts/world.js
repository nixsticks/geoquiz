var width = 800,
    height = 800;

var projection = d3.geo.orthographic()
                       .scale(350)
                       .translate([width/2, height/2])
                       .clipAngle(90);

var path = d3.geo.path().projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);

var names = {};

svg.append("path")
   .datum({type: "Sphere"})
   .attr("id", "globe")
   .attr("d", path);

// svg.append("path")
//    .datum(graticule)
//    .attr("class", "graticule")
//    .attr("d", path);

queue()
.defer(d3.json, "/datafiles/world.json")
.defer(d3.tsv, "/datafiles/countrynames.tsv")
.await(ready);

function ready(error, world, countries) {
  countries.forEach(function(d) {
    names[d.id] = d.name;
  });

  svg.selectAll("path.land")
     .data(topojson.feature(world, world.objects.countries).features)
     .enter().append("path")
     .attr("class", "land")
     .attr("d", path)
     .on("mouseover", function(d) {
        d3.select(this).attr("class", "active");

        svg.append("text")
           .text(names[d.id])
           .attr("x", d3.event.pageX + "px")
           .attr("y", d3.event.pageY + "px");
     })
     .on("mousemove", function(d) {
        d3.select("text")
          .attr("x", (d3.event.pageX) + "px")
          .attr("y", (d3.event.pageY) + "px");
      })
     .on("mouseout", function(d) {
        d3.select(this).classed('active', false).classed('land', true);
        d3.select("text").remove();
      });

  svg.insert("path", ".graticule")
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  svg.call(drag);
}

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

function getCentroid(selection) {
  // get the DOM element from a D3 selection
  // you could also use "this" inside .each()
  var element = selection.node(),
      // use the native SVG interface to get the bounding box
      bbox = element.getBBox();
  // return the center of the bounding box
  return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}