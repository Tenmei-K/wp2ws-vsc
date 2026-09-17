let params = {
  fps: 0,
  numOfBoxes: 0
};

const WORLD_SIZE = 2000; // in script-three.js, camera.position.z = 1000
const WORLD_HALF = WORLD_SIZE / 2;

let cubes = [];


function setupThree() {

  /*
  for (let i = 0; i < 1200; i++) {
    let box = new Box;

    // random position
    box.pos.x = random(-WORLD_HALF, WORLD_HALF);
    box.pos.y = random(-WORLD_HALF, WORLD_HALF);
    box.pos.z = random(-WORLD_HALF, WORLD_HALF);

    cubes.push(box);
    // random size
    // Math.random() in js returns a number between 0 & 1
    // let cubeSize = random(5, 15); // function from p5.js
  }
  */

  pane.addBinding(params, "numOfBoxes", { step: 1 });

}

function updateThree() {

  for (let i = 0; i < cubes.length; i++) {
    let cube = cubes[i];
    cube.move();
    cube.rotate();
    cube.reappear();
    cube.updateLifeSpan();
  }

  for (let i = cubes.length; i >= 0; i--) {
    let cube = cubes[i];
    if (cube.isDone) {
      // remove mesh first, then splice from array
      scene.remove(cube.mesh);
      cubes.splice(i, 1);
    }
  }

  params.numOfBoxes = cubes.length;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: '#8ed5b4',
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Box {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);

    // position
    this.pos = this.mesh.position; // cache the reference
    // this.vel = new THREE.Vector3(1, 0, 0);
    this.vel = new THREE.Vector3(0, 0, 0);
    this.acc = new THREE.Vector3(0, 0, 0);


    // rotation
    this.rot = this.mesh.rotation;
    this.rotSpeed = new THREE.Vector3(
      random(-0.05, 0.05),
      random(-0.05, 0.05),
      random(-0.05, 0.05)
    );

    // size
    this.mass = 1;
    this.size = random(5, 15);
    this.scale = this.mesh.scale;
    this.scale.set(this.size, this.size, this.size);

    // color, ..., material
    // this.color;
    // this.opacity;

    // lifespan
    this.lifespan = 1;

  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // this.acc.mult(0); // issue
  }
  rotate() {
    this.rot.x += this.rotSpeed.x;
  }
  reappear() {
    if (this.pos.x < -WORLD_HALF) {
      this.pos.x = WORLD_HALF
    }
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = -WORLD_HALF
    }
    if (this.pos.y < -WORLD_HALF) {
      this.pos.y = WORLD_HALF
    }
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = -WORLD_HALF
    }
    if (this.pos.z < -WORLD_HALF) {
      this.pos.z = WORLD_HALF
    }
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = -WORLD_HALF
    }
  }

  updateLifeSpan() {
    this.lifespan
  }

  update() {
    this.scale.set(
      this.size * this.lifespan,
      this.size * this.lifespan,
      this.size * this.lifespan
    )
  }
}