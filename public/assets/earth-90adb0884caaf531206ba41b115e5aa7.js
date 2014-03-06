var width = window.innerWidth,
    height = window.innerHeight,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000),
    renderer = new THREE.WebGLRenderer();

camera.position.z = 1.5;
renderer.setSize(width, height);

scene.add(new THREE.AmbientLight(0x888888));

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

var sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/images/earthmap.jpg'),
    bumpMap: THREE.ImageUtils.loadTexture('/images/earthbump.jpg'),
    bumpScale: 0.005,
    specularMap: THREE.ImageUtils.loadTexture('/images/water.png'),
    specular: new THREE.Color('grey')
  })
);

var clouds = new THREE.Mesh(
  new THREE.SphereGeometry(0.505, 32, 32),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('/images/clouds.png'),
    side: THREE.DoubleSide,
    opacity: 0.8,
    depthWrite: false,
    transparent: true
  })
);

var galaxy = new THREE.Mesh(
  new THREE.SphereGeometry(90, 64, 64),
  new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('/images/starfield.png'),
    side: THREE.BackSide
  })
);

scene.add(sphere);
scene.add(clouds);
scene.add(galaxy);

document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls( camera, renderer.domElement );
render();

function render() {
  sphere.rotation.y += 0.0005;
  clouds.rotation.y += 0.0005;
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  controls.update();
}
;
