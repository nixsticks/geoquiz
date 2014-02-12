var width = 800,
  height = 800,
  projection = d3.geo.orthographic()
                       .scale(350)
                       .translate([width/2, height/2])
                       .clipAngle(90),
  path = d3.geo.path().projection(projection),
  svg = d3.select("#map").append("svg").attr("width", width).attr("height", height),
  $inputBox = $("#answer"),
  names = {},
  answer, countries, country;

svg.append("path")
   .datum({type: "Sphere"})
   .attr("id", "globe")
   .attr("d", path);

queue()
.defer(d3.json, "/datafiles/world.json")
.defer(d3.tsv, "/datafiles/countrynames.tsv")
.await(ready);

function ready(error, world, places) {
  countries = topojson.feature(world, world.objects.countries).features;
    country = countries[Math.floor(Math.random() * countries.length)];

  places.forEach(function(d) {
    names[d.id] = d.name;
  });

  svg.selectAll("path.land")
     .data(countries)
     .enter().append("path")
     .attr("class", "land")
     .attr("d", path);

  svg.insert("path", ".graticule")
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  svg.call(drag);

  transition();
}

function transition() {
  var p = d3.geo.centroid(country);

  d3.transition()
    .duration(2500)
    .tween("rotate", function() {
      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
      return function(t) {
        projection.rotate(r(t));
        answer = names[country.id];
        console.log(country.id);
        d3.select("h1").text(answer);
        svg.selectAll("path").attr("d", path)
          .classed("active", function(d, i) { return d.id == country.id; });
    };
  });
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


$inputBox.keypress(function(e) {
  if (event.which === 13) {
    var $this = $(this),
        value = $this.val(),
        active = d3.select(".active").classed("active", false);;

    if (checkAnswer(value)) {
      active.classed("correct", true);
      changeCountry();
    } else {
      active.classed("wrong", true);
      changeCountry();
    }
  }
});

function changeCountry() {
  d3.select(".active").classed("active", false).classed("complete", true);
  var i = countries.indexOf(country);
  countries.splice(i, 1);
  country = countries[Math.floor(Math.random() * countries.length)];
  $inputBox.val("");
  transition(country);
}

function checkAnswer(input) {
  if (answer.match(/(.*),/)) {
    var shortAnswer = answer.match(/(.*),/)[1];
    return (input.toLowerCase() === shortAnswer.toLowerCase());
  } else {
    return (input.toLowerCase() === answer.toLowerCase());
  }
}