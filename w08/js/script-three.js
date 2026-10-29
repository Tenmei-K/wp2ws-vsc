console.log("three.js Version: " + THREE.REVISION);

let container;
let scene, camera, renderer;
let controls;

let time, frame = 0;

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

  setupGUI();

  setupThree(); // *** 
  renderer.setAnimationLoop(animate);
}

function animate() {
  // update the frame count of three.js
  frame++;

  // update the time in milliseconds of three.js
  time = performance.now();

  // update the three.js scene
  updateThree(); // ***

  // update the values in the Tweakpane GUI
  updateGUI();

  // render the three.js scene
  renderer.render(scene, camera);
}
