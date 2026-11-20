let params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane;

let socket;
let users = {};

function setupThree() {
  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", sendViaSocket);


  // environment
  setupEnvironment();


  // otherUser = getBox();
  // otherUser.material.color.setRGB(random(1), random(1), random(1));
  // otherUser.scale.set(200, 200, 200);
  // scene.add(otherUser);


  // socket
  setupSocket();
}

function updateThree() {
  //
}

function setupSocket() {
  socket = io();


  socket.on("connect", function () {
    console.log("Connected. ID: ", socket.id);
  });


  socket.on("message_name", receiveViaSocket);
}


function sendViaSocket() {
  let data = {
    id: socket.id,
    x: Number(camera.position.x.toFixed(2)),
    y: Number(camera.position.y.toFixed(2)),
    z: Number(camera.position.z.toFixed(2))
  };


  socket.emit("message_name", data);
}


function receiveViaSocket(data) {

  if (!users[data.id]) {
    const user = getBox();
    user.material.color.setRGB(random(1), random(1), random(1));
    user.scale.set(200, 200, 200);
    scene.add(user);

    users[data.id] = user;
  }

  // users = {
  //   ABC: {
  //     id: "ABC",
  //     x: 100,
  //     y: 100,
  //     z: 100,
  //   }
  // }

  users[data.id].position.set(data.x, data.y, data.z);

  // console.log(data);

  // otherUser.position.x = data.x;
  // otherUser.position.y = data.y;
  // otherUser.position.z = data.z;
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
  return mesh;
}

function setupEnvironment() {
  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  let positionAttributes = plane.geometry.attributes.position;
  for (let i = 0; i < positionAttributes.array.length; i += 3) {
    let x = positionAttributes.array[i + 0];
    let y = positionAttributes.array[i + 1];
    let z = positionAttributes.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    positionAttributes.array[i + 2] = noiseValue; // update the z value.
  }

  // floating boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);

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
}