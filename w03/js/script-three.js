console.log("three.js Version: " + THREE.REVISION);

let scene, camera, renderer, container;
let controls;

let time = 0;
let frame = 0;

let pane;
const fps = { // use const because we are not going to change it
  value: 0,
  last: 0
}; // calculate internal value

function initThree() {
  scene = new THREE.Scene();

  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  pane = new Pane();
  pane.addBinding(params, 'fps', {
    label: 'FPS Graph',
    readonly: true,
    view: 'graph',
    min: 0,
    max: 240
  }) // show the value


  setupThree(); // *** 

  renderer.setAnimationLoop(animate);
}

function animate() {
  frame++;
  time = performance.now();

  fps.value = 1000 / (time - fps.last);
  fps.last = time;
  params.fps = fps.value;

  updateThree(); // ***

  pane.refresh();

  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});