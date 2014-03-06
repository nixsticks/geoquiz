var height = window.innerHeight,
    width = window.innerWidth;

var orbit = [],
    planets = [];

var perspective = "infinite";

var renderer = new THREE.WebGLRenderer();

renderer.setSize(width, height);

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);

camera.position.z = 1000;

var scene = new THREE.Scene();

var controls = new THREE.OrbitControls( camera, renderer.domElement );

var orbitSpeed = [1, 0.0016, 0.0012, 0.001, 0.0008, 0.00043, 0.00032, 0.00023, 0.00018];

var rotationSpeed = [0.0006, 0.0000673, 0.0000405, 0.00104, 0.000538, 0.028325, 0.022892, 0.009193, 0.006039, 0.00007656];

var orbitRing = [1, 40, 80, 120, 160, 220, 270, 320, 370];
var planetRadius = [20, 10, 13, 15, 14, 25, 19, 17, 17];

var prefix = "/images/";
var textures = ["sunmap.jpg", "mercurymap.jpg", "venusmap.jpg", "earthmap.jpg", "marsmap.jpg", "jupitermap.jpg", "saturnmap.jpg", "uranusmap.jpg", "neptunemap.jpg"];

var ringMesh;

for (var i = 0; i < 9; i++) {
  var orbit = new THREE.TorusGeometry(orbitRing[i], .1, 50, 50)
  var orbitMaterial = new THREE.MeshNormalMaterial({wireframe: true});
  orbit[i] = new THREE.Mesh(orbit, orbitMaterial);
  scene.add(orbit[i]);

  var planet = new THREE.SphereGeometry(planetRadius[i], 20, 20);
  var planetMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(prefix + textures[i])});

  planets[i] = new THREE.Mesh(planet, planetMaterial);

  scene.add(planets[i]);

  // if (i === 0) {
  //   var light = new THREE.PointLight( 0xff0000, 1, 100 );
  //   light.position.set( orbitRing[i], 0, 0 );
  //   scene.add( light );

  //   var customMaterial = new THREE.ShaderMaterial(
  //     {
  //       uniforms: {},
  //       vertexShader: document.getElementById('vertexShader').textContent,
  //       fragmentShader: document.getElementById('fragmentShader').textContent,
  //       side: THREE.BackSide,
  //       blending: THREE.AdditiveBlending,
  //       transparent: true
  //     }
  //   );

  //   var ballGeometry = new THREE.SphereGeometry(planetRadius[i] + 4, 20, 20);
  //   var ball = new THREE.Mesh(ballGeometry, customMaterial);
  //   scene.add(ball);
  // }

  if (i === 6) {
    var ringGeometry = new THREE.TorusGeometry(planetRadius[i] + 6, 1, 20, 20);
    var ringMaterial = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(prefix + 'saturnringcolor.jpg')});
    ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.position.set(orbitRing[i], 0, 0);
    scene.add(ringMesh);
  }

  planets[i].position.set(orbitRing[i], 0, 0);
}

var skysphere  = new THREE.SphereGeometry(1000, 32, 32);
var skyMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture('/images/starfield.png'),
  side: THREE.BackSide
});
var skyMesh  = new THREE.Mesh(skysphere, skyMaterial);
scene.add(skyMesh);

draw();

function draw() {
  for (var i = 1; i < 9; i++) {
    planets[i].rotation.y = Date.now() * 0.0006;
    planets[i].position.x = Math.sin(Date.now() * orbitSpeed[i]) * orbitRing[i];
    planets[i].position.y = Math.cos(Date.now() * orbitSpeed[i]) * orbitRing[i];
  }

  ringMesh.rotation.x = 1.5;
  ringMesh.position.x = Math.sin(Date.now() * orbitSpeed[6]) * orbitRing[6];
  ringMesh.position.y = Math.cos(Date.now() * orbitSpeed[6]) * orbitRing[6];

  if (perspective === "earth") {
    camera.position.set(planets[3].position.x + 50, planets[3].position.y+100, planets[3].position.z+100);
    camera.lookAt(planets[3].position);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(draw);
  controls.update();
}

$(document).ready(function() {
  $("#orthographic").on("click", function() {
    perspective = "orthographic";
    camera.position.x = -0.3;
    camera.position.y = -733;
    camera.position.z = -250;
  });

  $("#infinite").on("click", function() {
    perspective = "infinite"
    camera.position.x, camera.position.y = 1;
    camera.position.z = 1000;
  })

  $("#earth").on("click", function() {
    perspective = "earth";
  });
});
