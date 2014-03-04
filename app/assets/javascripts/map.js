var $map = $("#map"),
    $inputBox = $("#answer_content"),
    $unitBox = $("#answer_unit_id"),
    $nextButton = $("#next"),
    $notification = $("#notification"),
    $okButton = $(".ok"),
    inputBox = document.getElementById("answer_content"),
    width = $map.width(),
    height = $map.height(),
    projection = options.projection,
    path = d3.geo.path().projection(projection),
    svg = d3.select("#map").append("svg")
              .attr("viewBox", "0 0 " + width + " " + height)
              .attr("preserveAspectRatio", "xMidYMid"),
    g = svg.append("g"),
    transition = options.transition,
    skippable = false,
    answer,
    units,
    unit,
    centered;

$(document).ready(function() {
  $(this).keypress(function(event) {
    if (event.which === 13 ) {
      if (!units.length) {
        var score = $(".correct").size(),
            total = $(".correct, .unit").size();

        $(".input-container").html("<h1>GREAT JOB!</h1><p>Your score:<br>" + score + "/" + total + "</p>");
        $(".info-container").html("");

        return false;
      }

      if (skippable || !$inputBox.val()) { skip(); }
    }
  })

  $("#submit").on("click", function(event) { event.preventDefault(); })

  $nextButton.on("click", skip);

  $("a.flip").on("click", function(event) {
    event.preventDefault();
    $(".card").toggleClass("flipped");
  });

  $("#new_answer").on("ajax:before", function() {
    if ($inputBox.val()) {
      var value = $inputBox.val(),
          active = d3.select(".active");

      if (correctAnswer(value)) {
        active.classed("active", false).classed("correct", true);
        setNotification("correct");
      } else {
        active.classed("active", false).classed("wrong", true);
        setNotification("wrong");
      }

      skippable = true;
      removeUnit();
      changeButton("Next");
      $okButton.addClass("grayed");
    } else {
      return false;
    }
  }).bind("ajax:success", function(e, data, status, xhr) {
    if (skippable) {
      $.get("/units/" + unit.id, function(data) { $("#unitdata").html(data); });
      $(".info-container").slideDown();
    }
  });

  map(options);
});

d3.select(window).on('resize', resize);

function resize() {
  width = parseInt($("#map").style("width"));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  projection.scale(options.scale).translate([width / 3, height / 2]);
  svg.selectAll("path").attr("d", path);
}

function map(options) {
  d3.json("/datafiles/" + options.file, function(error, data) {
    if (options.globe) {
      g.append("path")
       .datum({type: "Sphere"})
       .attr("id", "globe");
    }

    g.append("rect")
    .attr("class", "transparent")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

    units = topojson.feature(data, data.objects.units).features;
    unit = units[Math.floor(Math.random() * units.length)];
    setAnswer();

    $unitBox.val(unit.id);

    g.append("g")
     .selectAll("path.unit")
     .data(units)
     .enter().append("path")
     .attr("class", "unit")
     .attr("d", path)
     .on("click", clicked);

    g.append("path")
       .datum(topojson.mesh(data, data.objects.units, function(a, b) { return a !== b; }))
       .attr("class", "boundary")
       .attr("d", path);

    if (options.drag) { svg.call(drag); }

    transition();
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
  
  projection.rotate([end.lon,end.lat]);

  svg.selectAll("path").attr("d", path);
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
  return (unit.properties.names.indexOf(input.toLowerCase()) !== -1);
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
  $unitBox.val(unit.id);
}

function setAnswer() {
  if (unit) {
    answer = unit.properties.name;
  }
}

function changeButton(command) {
  $nextButton.html("<p>" + command + "</p>")
}

function skip() {
  inputBox.disabled = false;
  skippable = false;
  $(".info-container").slideUp();
  $(".card").removeClass("flipped");
  $okButton.removeClass("grayed");

  changeUnit();
  clearBoxes();
  $inputBox.focus();
  transition();
}

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2;
    z = 3;
    centered = d;
  } else {
    x = width / 3;
    y = height / 2;
    k = 1;
    z = 3;
    centered = false;
  }

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / z + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}