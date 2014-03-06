var height = window.innerHeight,
    width = window.innerWidth;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

if (skybox.skysphere) {
  var camera = new THREE.PerspectiveCamera(45, width/height, 1, 20000);
  camera.position.z = 5000;

  var skysphere  = new THREE.SphereGeometry(10000, 32, 32);
  var skyMaterial = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('/images/skybox/milkyway/milkywaylarge.jpg'),
    side: THREE.BackSide
  });
  var skyMesh  = new THREE.Mesh(skysphere, skyMaterial);
  scene.add(skyMesh);
} else {
  var camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
  camera.position.z = 1000;

  var cameraCube = new THREE.PerspectiveCamera(70, width / height, 1, 100000);

  scene.add(camera);
  sceneCube = new THREE.Scene();

  var urls = [skybox.prefix + "px.jpg", skybox.prefix + "nx.jpg", skybox.prefix + "py.jpg", skybox.prefix + "ny.jpg", skybox.prefix + "pz.jpg", skybox.prefix + "nz.jpg"];

  var textureCube = THREE.ImageUtils.loadTextureCube(urls);

  var shader = THREE.ShaderLib["cube"];
  // var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  shader.uniforms['tCube'].value = textureCube;

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    depthTest: false,
    side: THREE.BackSide
  });

  skyboxMesh = new THREE.Mesh(new THREE.CubeGeometry( 10000, 10000, 10000, 1, 1, 1, null, true), material );
  sceneCube.add(skyboxMesh);
}

var controls = new THREE.OrbitControls( camera, renderer.domElement );

draw(skybox);

function draw(skybox) {
  var timer = - new Date().getTime() * 0.0001;
  camera.position.x = 1000 * Math.cos(timer);
  camera.position.z = 1000 * Math.sin(timer);

  camera.lookAt(scene.position);
  renderer.render(scene, camera);

  if (cameraCube) {
    cameraCube.rotation.copy(camera.rotation);
    renderer.render(sceneCube, cameraCube);
  }
  
  requestAnimationFrame(draw);
  controls.update();
}
;
