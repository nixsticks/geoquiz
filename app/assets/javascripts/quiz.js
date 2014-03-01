var $map = $("#map"),
    $inputBox = $("#answer_content"),
    $countryBox = $("#answer_unit_id"),
    $nextButton = $("#next"),
    $notification = $("#notification"),
    width = $map.width(),
    height = $map.height(),
    projection = d3.geo.orthographic()
                   .scale(width / 4.5)
                   .translate([width / 3.3, height / 2])
                   .clipAngle(90),
    path = d3.geo.path().projection(projection),
    svg = d3.select("#map").append("svg")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("preserveAspectRatio", "xMidYMid"),
    g = svg.append("g"),
    names = {},
    clickable = true,
    answer,
    alternatives,
    countries,
    country,
    centered;

svg.append("rect")
   .attr("class", "transparent")
   .attr("width", width)
   .attr("height", height);

g.append("path")
    .datum({type: "Sphere"})
    .attr("id", "globe");

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
      $.get("/units/" + country.id, function(data) { $("#unitdata").html(data); })
      $(".info-container").slideDown();
    }
  });
});

d3.select(window).on('resize', resize);

function resize() {
  width = parseInt($("#map").style("width"));
  height = parseInt($("#map").style("height"));

  projection.scale(width / 4.2).translate([width / 3.3, height / 2]);
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

  g.append("g")
    .selectAll("path.land")
    .data(countries)
    .enter().append("path")
    .attr("class", "land")
    .attr("d", path);

  g.on("click", clicked);

  g.insert("path", ".graticule")
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
  
  projection.rotate([end.lon,end.lat]);

  svg.selectAll("path").attr("d", path);
});

function changeCountry() {
  var oldcountry = country;
  d3.select(".active").classed("active", false);
  if (countries.length > 1) {
    while (country === oldcountry) {
     country = countries[Math.floor(Math.random() * countries.length)]; 
    }
  } else {
    country = countries[0];
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

  if (!countries.length) {
    var score = $(".correct").size();
    $(".input-container").html("<h1>CONGRATULATIONS!</h1><p>You finished the game!</p><p>Your score: " + score + "</p>");
  } else if (countries.length == 1) {
    $(".title").html("<h1>Keep going! You have one left!</h1>");
  } else {
    changeCountry();
    clearBoxes();
    $inputBox.focus();
    transition();
  }
}

function clicked(d) { 
  var x, y, z, k;

  if (!centered) {
    var active = d3.select(".active"), centroid;
    active.each(function(d) {
      centroid = path.centroid(d);
      console.log(d);
    })

    x = centroid[0];
    y = centroid[1];
    k = 2;
    z = 3.3;
    centered = true;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    z = 2;
    centered = false;
  }

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / z + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
      // .style("stroke-width", 1.5 / k + "px");
}