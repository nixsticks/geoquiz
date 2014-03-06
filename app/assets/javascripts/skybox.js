var width = window.innerWidth,
    height = window.innerHeight,
    startTime = Date.now(),
    container,
    camera,
    cameraCube,
    scene,
    sceneCube,
    renderer,
    skyboxMesh,
    controls;

THREE.ImageUtils.crossOrigin = "";

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
  camera.position.z = 1000;

  cameraCube = new THREE.PerspectiveCamera(70, width / height, 1, 100000);

  scene = new THREE.Scene();
  scene.add(camera);
  sceneCube = new THREE.Scene();

  var urls = [prefix + "px.jpg", prefix + "nx.jpg", prefix + "py.jpg", prefix + "ny.jpg", prefix + "pz.jpg", prefix + "nz.jpg"];

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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls( camera );
  // controls.addEventListener( 'change', render );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  var timer = - new Date().getTime() * 0.0002;
  camera.position.x = 1000 * Math.cos(timer);
  camera.position.z = 1000 * Math.sin(timer);

  camera.lookAt(scene.position);
  cameraCube.rotation.copy(camera.rotation);

  renderer.render(scene, camera);
  renderer.render(sceneCube, cameraCube);
}