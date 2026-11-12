let params = {
  color: "#FFF"
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane;

let dragControls;
let flyControls;

function setupThree() {
  // controls

  // controls = new OrbitControls(camera, renderer.domElement);

  /* #1
  // console.log(controls.getDistance());
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  controls.minPolarAngle = PI / 3;
  controls.maxPolarAngle = PI / 2;
  
  controls.maxDistance = 1000;
  
  controls.enableRotate = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  
  controls.rotateSpeed = 1;
  controls.zoomSpeed = 1.1;
  controls.panSpeed = 1.1;
  
  // controls.listenToKeyEvents(window);
  controls.keys = {
    LEFT: 'KeyA', //left arrow
    UP: 'KeyW', // up arrow
    RIGHT: 'KeyD', // right arrow
    BOTTOM: 'KeyS' // down arrow
  }
  */

  // #2
  // controls = new TrackballControls(camera, renderer.domElement);

  // #3
  // controls = new ArcballControls(camera, renderer.domElement, scene);
  // controls.setGizmosVisible(true);
  // controls.cursorZoom =true;

  // #4
  // controls = new MapControls(camera, renderer.domElement);

  // #7
  flyControls = new FlyControls(camera, renderer.domElement);
  flyControls.movementSpeed = 100;
  flyControls.rollSpeed = 0.5;
  flyControls.dragToLook = true;
  flyControls.autoForward = true;




  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  // boxes
  let boxes = []
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);
    boxes.push(box);

    box.position.x = random(-WORLD_HALF, WORLD_HALF);
    box.position.y = random(-WORLD_HALF / 2, WORLD_HALF);
    box.position.z = random(-WORLD_HALF, WORLD_HALF);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 20);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);
  }

  // AFTER OBJECTS because control interaction with objects
  // can be used simultaneously with other controls
  /* #5
  dragControls = new DragControls(boxes, camera, renderer.domElement);
  // add event listener to highlight dragged objects
  dragControls.addEventListener('dragstart', function (event) {
    controls.enabled = false;
    event.object.material.color.set("#39c5bb");
  });
  dragControls.addEventListener('dragend', function (event) {
    controls.enabled = true;
    event.object.material.color.set("#ffffff");
  });
  */

  /* #6
  transformControls = new TransformControls(camera, renderer.domElement);

  transformControls.attach(plane);
  scene.add(transformControls.getHelper());

  // transformControls.setMode("transform");
  // transformControls.setMode("rotate");
  transformControls.setMode("scale");

  transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });
  */

}


let timer = new THREE.Timer(); // can be decided update or not in updateThree()
timer.connect(document); // if page is not activated, timer DOES NOT update
// let lastTime = performance.now(); // gets system time no matter what

function updateThree() {

  // let currTime = performance.now();
  // let delta = currTime - lastTime;
  // lastTime = currTime;

  timer.update();
  let delta = timer.getDelta();

  // controls.update();
  flyControls.update(delta);  

}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array; // REORGANIZE
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }
  return mesh;
}