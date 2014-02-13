var width = $("#map").width(),
    height = $("#map").height(),
    projection = d3.geo.orthographic()
                       .scale(height / 2.3)
                       .translate([width / 2, height / 2])
                       .clipAngle(90),
    path = d3.geo.path().projection(projection),
    svg = d3.select("#map").append("svg").attr("width", width).attr("height", height),
    $inputBox = $("#answer"),
    $countryBox = $("#answer_country_id"),
    $nextButton = $("#next"),
    $notification = $("#notification"),
    names = {},
    clickable = true,
    answer,
    countries,
    country;

svg.append("path")
    .datum({type: "Sphere"})
    .attr("id", "globe")
    .attr("d", path);

queue()
    .defer(d3.json, "/datafiles/world.json")
    .defer(d3.tsv, "/datafiles/countrynames.tsv")
    .await(ready);

$(document).ready(function() {
  $inputBox.keypress(function(event) {
    if (clickable === true && event.which === 13) {
      var $this = $(this),
          value = $this.val(),
          active = d3.select(".active").classed("active", false);

      if (checkAnswer(value)) {
        active.classed("correct", true);
        setNotification("correct");
      } else {
        active.classed("wrong", true);
        setNotification("wrong");
      }

      removeCountry();
      toggleInput();
    }
  });

  $nextButton.on("click", function(e) {
    if (!clickable) {
      toggleInput();
    }
    $(".info-container").slideUp();
    changeCountry();
    clearBoxes();
    transition();
  });

  $("a.flip").on("click", function(e) {
    e.preventDefault();
    $(".card").toggleClass("flipped");
  });

  $("#new_answer").on("ajax:success", function(e, data, status, xhr) {
    $.get("/countries/" + country.id, function(data) {
      $("#countrydata").html(data);
    })
    $(".info-container").slideDown();
  });
})

function ready(error, world, places) {
  countries = topojson.feature(world, world.objects.countries).features;
    country = countries[Math.floor(Math.random() * countries.length)];

  $countryBox.val(country.id);

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

function changeCountry() {
  d3.select(".active").classed("active", false);
  country = countries[Math.floor(Math.random() * countries.length)];
}

function removeCountry() {
  var i = countries.indexOf(country);
  countries.splice(i, 1);
}

function checkAnswer(input) {
  if (answer.match(/(.*),/)) {
    var shortAnswer = answer.match(/(.*),/)[1];
    return (input.toLowerCase() === shortAnswer.toLowerCase());
  } else {
    return (input.toLowerCase() === answer.toLowerCase());
  }
}

function setNotification(command) {
  if (command === "correct") {
    $notification.html("<h1>Good job!</h1>");  
  } else if (command === "wrong") {
    $notification.html("<h1>Nope! It's " + answer + ".</h1>")
  }
}

function transition() {
  var p = d3.geo.centroid(country);

  d3.transition()
    .duration(2500)
    .tween("rotate", function() {
      var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
      return function(t) {
        projection.rotate(r(t));
        setAnswer();
        svg.selectAll("path").attr("d", path)
          .classed("active", function(d, i) { return d.id == country.id; });
    };
  });
}

function clearBoxes() {
  $inputBox.val("");
  $countryBox.val(country.id);
}

function setAnswer() {
  if (country) {
    answer = names[country.id];
  }
}

function toggleInput() {
  if (clickable) {
    document.getElementById("answer").disabled = true;
    clickable = false;
  } else {
    document.getElementById("answer").disabled = false;
    clickable = true;
  }
}