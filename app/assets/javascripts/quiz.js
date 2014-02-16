var $map = $("#map"),
    $inputBox = $("#answer_content"),
    $countryBox = $("#answer_unit_id"),
    $nextButton = $("#next"),
    $notification = $("#notification"),
    width = $map.width(),
    height = $map.height(),
    projection = d3.geo.orthographic()
                   .scale(width / 2.3)
                   .translate([width / 2, height / 2])
                   .clipAngle(90),
    path = d3.geo.path().projection(projection),
    svg = d3.select("#map").append("svg")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("preserveAspectRatio", "xMidYMid"),
    names = {},
    clickable = true,
    answer,
    alternatives,
    countries,
    country;

svg.append("path")
    .datum({type: "Sphere"})
    .attr("id", "globe")
    .attr("d", path);

queue()
    .defer(d3.json, "/datafiles/world.json")
    .defer(d3.json, "/datafiles/countrynames.json")
    .await(ready);

$(document).ready(function() {
  $(this).keypress(function(event) {
    if (event.which === 13 ) {
      if (!clickable || !$inputBox.val()) { skip(); }
    }
  })

  $("#submit").on("click", function(event) { event.preventDefault(); })

  $nextButton.on("click", skip);

  $("a.flip").on("click", function(event) {
    event.preventDefault();
    $(".card").toggleClass("flipped");
  });

  $("#new_answer").on("ajax:success", function(e, data, status, xhr) {
    var value = $inputBox.val(),
        active = d3.select(".active");

    if (value) {
      if (correctAnswer(value)) {
        active.classed("active", false).classed("correct", true);
        setNotification("correct");
      } else {
        active.classed("active", false).classed("wrong", true);
        setNotification("wrong");
      }

      removeCountry();
      toggleInput();
      changeButton("Next");
      $.get("/units/" + country.id, function(data) { $("#countrydata").html(data); })
      $(".info-container").slideDown();
    }
  });
});

d3.select(window).on('resize', resize);

function resize() {
  width = parseInt($("#map").style("width"));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  projection.scale(width / 2.3).translate([width / 2, height / 2]);
  svg.selectAll("path").attr("d", path);
}

function ready(error, world, places) {
  countries = topojson.feature(world, world.objects.countries).features;
    country = countries[Math.floor(Math.random() * countries.length)];

  $countryBox.val(country.id);

  places.forEach(function(d) {
    d.alternatives.forEach(function(alternative) {
      alternative.toLowerCase;
    });
    names[d.id] = [d.name].concat(d.alternatives);
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
  var oldcountry = country;
  d3.select(".active").classed("active", false);
  while (country === oldcountry) {
   country = countries[Math.floor(Math.random() * countries.length)]; 
  }
}

function removeCountry() {
  var i = countries.indexOf(country);
  countries.splice(i, 1);
}

function correctAnswer(input) {
  if (answer.match(/the (.*)/)) {
    var shortAnswer = answer.match(/the (.*)/)[1];
    return (input.toLowerCase() === shortAnswer.toLowerCase() || input.toLowerCase() === answer.toLowerCase() || alternatives.indexOf(input.toLowerCase()) > -1);
  } else {
    return (input.toLowerCase() === answer.toLowerCase() || alternatives.indexOf(input.toLowerCase()) > -1);
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
        changeButton("Skip");
        svg.selectAll("path").attr("d", path)
          .classed("active", function(d, i) { return d.id === country.id; }); 
    };
  });
}

function clearBoxes() {
  $inputBox.val("");
  $countryBox.val(country.id);
}

function setAnswer() {
  if (country) {
    answer = names[country.id][0];
    alternatives = names[country.id].slice(1, names[country.id].length).map(function(x) { return x.toLowerCase(); });
  }
}

function toggleInput() {
  if (clickable) {
    document.getElementById("answer_content").disabled = true;
    clickable = false;
  } else {
    document.getElementById("answer_content").disabled = false;
    clickable = true;
  }
}

function changeButton(command) {
  $nextButton.html("<p>" + command + "</p>")
}

function skip() {
  if (!clickable) { toggleInput(); }
  $(".info-container").slideUp();
  $(".card").removeClass("flipped");
  changeCountry();
  clearBoxes();
  $inputBox.focus();
  transition();
}