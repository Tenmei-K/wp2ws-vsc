let params = {
  fps: 0,
  value: 0
};


const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_HEIGHT = -150;
const C_GRAVITY = 0.3;


let plane;
let cube;


let user;


function setupThree() {
  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;


  // boxes
  generateBoxes();


  // #2
  // pink box
  cube = getBox();
  scene.add(cube);
  cube.scale.set(100, 20, 20);
  cube.material.color.set(0xff00ff);
  cube.material.wireframe = true;


  pane.addBinding(params, "value", { label: "Value", min: 0, max: 1000, step: 1 });


  user = new Character();
}


function updateThree() {


  // #1
  camera.position.x = cos(frame * 0.010) * 300;
  camera.position.y = sin(frame * 0.005) * 100;
  camera.rotation.y = cos(frame * 0.010) * PI / 24;
  camera.rotation.z = cos(frame * 0.007) * PI / 24;
  camera.lookAt(0, 0, 0); // target


  // #2
  //let lookAtVector = new THREE.Vector3();
  //camera.getWorldDirection(lookAtVector); // lookAtVector has been updated!


  let lookAtVector = new THREE.Vector3(0, 0, -1);
  lookAtVector.applyQuaternion(camera.quaternion);


  // the magnitude/length is 1
  lookAtVector.multiplyScalar(300); // now the magnitude is 300


  let targetPos = new THREE.Vector3().addVectors(camera.position, lookAtVector);
  // lets have some object!
  cube.position.copy(targetPos);
  cube.setRotationFromQuaternion(camera.quaternion);


  // #3
  user.update();
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
  let positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.array.length; i += 3) {
    let x = positionAttribute.array[i + 0];
    let y = positionAttribute.array[i + 1];
    let z = positionAttribute.array[i + 2];


    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;


    positionAttribute.array[i + 2] = noiseValue; // update the z value.
  }


  return mesh;
}


function generateBoxes() {
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


class Character {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);
    this.mesh.scale.set(100, 200, 20);


    this.position = this.mesh.position;
    this.position.y = FLOOR_HEIGHT;

    // use quaternion to place a y-axis to user, so that it rotates around it
    this.direction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0); 
    //
    this.rotateVel = 0.02; // radians per frame
    //
    this.runVel = 6; // world units per frame
    this.walkVel = 2.5; // world units per frame
    //
    this.jumpVel = 0.0;
    this.jumpAcc = 10; // initial jump speed
    this.isJumped = false;
    //
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      rotateLeft: false,
      rotateRight: false,
      space: false,
      shift: false,
    }
    // Keep a reference to this character for the event functions.
    const character = this;


    document.addEventListener('keydown', function (event) {
      character.onKeyDown(event);
    });


    document.addEventListener('keyup', function (event) {
      character.onKeyUp(event);
    });


    function resetInput() {
      for (const key of Object.keys(character.keys)) {
        character.keys[key] = false;
      }
    }


    window.addEventListener('blur', resetInput);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) resetInput();
    });
  }
  update() {
    this.rotate();
    this.move();
    this.jump();
    //
    this.mesh.setRotationFromQuaternion(this.direction);
  }
  jump() {
    if (this.keys.space) {
      if (!this.isJumped) {
        this.isJumped = true;
        this.jumpVel += this.jumpAcc;
      }
    }
    // fall
    this.position.y += this.jumpVel;
    if (this.position.y > FLOOR_HEIGHT) {
      this.jumpVel -= C_GRAVITY;
    } else {
      this.position.y = FLOOR_HEIGHT;
      this.isJumped = false;
      this.jumpVel = 0.0;
    }
  }
  move() {
    let speed = this.walkVel;
    if (this.keys.shift) {
      speed = this.runVel;
    }
    const direction = new THREE.Vector3(
      Number(this.keys.right) - Number(this.keys.left),
      0,
      Number(this.keys.backward) - Number(this.keys.forward)
    );
    // normalize the combined input so diagonals are no faster than forward.
    if (direction.lengthSq() > 0) {
      direction.normalize().applyQuaternion(this.direction);
      this.position.addScaledVector(direction, speed);
    }
  }
  rotate() {
    // rotate left or right
    if (this.keys.rotateLeft) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.rotateVel); // positive
      this.direction.multiply(quaternion);
    }
    if (this.keys.rotateRight) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, -this.rotateVel); // negative
      this.direction.multiply(quaternion);
    }
  }
  onKeyDown(event) {
    // if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault();
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = true;
        break;
      case 'KeyE':
        this.keys.rotateRight = true;
        break;
      case 'Space':
        this.keys.space = true;
        break;
      case 'ShiftLeft':
        this.keys.shift = true;
        break;
    }
    /*
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
    */
  };


  onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = false;
        break;
      case 'KeyE':
        this.keys.rotateRight = false;
        break;
      case 'Space':
        this.keys.space = false;
        break;
      case 'ShiftLeft':
        this.keys.shift = false;
        break;
    }
    /*
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
    */
  }
};
