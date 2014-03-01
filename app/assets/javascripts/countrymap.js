var $map = $("#map"),
    $inputBox = $("#answer_content"),
    $unitBox = $("#answer_unit_id"),
    $nextButton = $("#next"),
    $notification = $("#notification"),
    width = $map.width(),
    height = $map.height(),
    projection = d3.geo.albersUsa()
                   .scale(1000)
                   .translate([width / 3, height / 2]),
    path = d3.geo.path().projection(projection),
    svg = d3.select("#map").append("svg")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("preserveAspectRatio", "xMidYMid"),
    g = svg.append("g"),
    states = {},
    clickable = true,
    answer,
    units,
    unit,
    centered;

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

      removeUnit();
      toggleInput();
      changeButton("Next");
      $.get("/units/" + states[unit.properties.name], function(data) { $("#unitdata").html(data); })
      $(".info-container").slideDown();
    }
  });
});

d3.select(window).on('resize', resize);

function resize() {
  width = parseInt($("#map").style("width"));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  projection.scale(1000).translate([width / 3, height / 2]);
  svg.selectAll("path").attr("d", path);
}

d3.json("/datafiles/usa.json", function(error, data) {
  units = topojson.feature(data, data.objects.states).features;
  unit = units[Math.floor(Math.random() * units.length)];
  setAnswer();
  var i = 896;

  units.forEach(function(unit) {
    states[unit.properties.name] = i;
    i++;
  });

  $unitBox.val(states[unit.properties.name]);

  g.append("g")
   .selectAll(".state")
   .data(topojson.feature(data, data.objects.states).features)
   .enter().append("path")
   .attr("class", "state")
   .attr("d", path)
   .on("click", clicked);

  g.append("path")
     .datum(topojson.mesh(data, data.objects.states, function(a, b) { return a !== b; }))
     .attr("class", "boundary")
     .attr("d", path);

  transition();
});

function changeUnit() {
  var oldunit = unit;
  d3.select(".active").classed("active", false);
  if (units.length > 1) {
    while (unit === oldunit) {
     unit = units[Math.floor(Math.random() * units.length)]; 
    }
  } else {
    unit = units[0];
  }
  setAnswer();
}

function removeUnit() {
  var i = units.indexOf(unit);
  units.splice(i, 1);
}

function correctAnswer(input) {
  return (input.toLowerCase() === unit.properties.name.toLowerCase() || input.toLowerCase() === unit.properties.abbr.toLowerCase());
}

function setNotification(command) {
  if (command === "correct") {
    $notification.html("<h1>Good job!</h1>");  
  } else if (command === "wrong") {
    $notification.html("<h1>Nope! It's " + answer + ".</h1>")
  }
}

function clearBoxes() {
  $inputBox.val("");
  $unitBox.val(states[unit.properties.name]);
}

function setAnswer() {
  if (unit) {
    answer = unit.properties.name;
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

  if (!units.length) {
    var score = $(".correct").size(),
        total = $(".correct, .wrong").size();

    $(".input-container").html("<h1>GREAT JOB!</h1><p>Your score:<br>" + score + "/" + total + "</p>");
  } else {
    changeUnit();
    clearBoxes();
    $inputBox.focus();
    transition();
  }
}

function transition() {
  svg.selectAll(".state").classed("active", function(d, i) {
    return d.properties.name === unit.properties.name; });
}

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2;
    z = 2;
    centered = d;
  } else {
    x = width / 3;
    y = height / 2;
    k = 1;
    z = 3;
    centered = null;
  }

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / z + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}