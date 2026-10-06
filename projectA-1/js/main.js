const axesHelper = new THREE.AxesHelper(1000)

let params = {
  fps: 0,
  numOfParticles: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

// let ring;
let rings = [];
let ringPositions = [];
let ringThetaLengths = [];

function setupThree() {
  scene.add(axesHelper)
  scene.background = new THREE.Color('#d2b2b2');

  // GUI
  pane.addBinding(params, "numOfParticles", {
    step: 1,
  });

  // add your code here

  // ring = new Ring();
  // ring.pos.x = random(-WORLD_HALF, WORLD_HALF);
  // ring.pos.y = random(-WORLD_HALF, WORLD_HALF);
  // ring.pos.z = random(-WORLD_HALF, WORLD_HALF);

  ringPositions.push(new THREE.Vector3(random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF)));
  ringThetaLengths.push(0);
  rings.push([]);
  // rings.push(new Ring());
  for (let i = 0; i < ringThetaLengths.length; i++) {
    // rings.push(new Ring());
  }

  ringThetaLengths.push(0);
  ringPositions.push(new THREE.Vector3(random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF)));
  rings.push([]);
}

function updateThree() {

  /*
  if (frame % 120 == 0) {
    if (ringThetaLengths.length < 5) {
      ringThetaLengths.push(0);
      ringPositions.push(new THREE.Vector3(random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF), random(-WORLD_HALF, WORLD_HALF)));
      rings.push([]);
    }
  }
    */

  for (let j = ringThetaLengths.length - 1; j >= 0; j--) {
    if (ringThetaLengths[j] >= PI * 2) {
      console.log("spliced")
      // rings[j].geometry.dispose();
      // rings[j].material.dispose();
      for (let i = 0; i < rings[j].length; i++) {
        scene.remove(rings[j][i]);
      }
      rings.splice(j, 1)
      ringThetaLengths.splice(j, 1)
    }
  }

  for (let i = 0; i < ringThetaLengths.length; i++) {

    if (ringThetaLengths.length > 0 && ringThetaLengths[i] < PI * 2) {
      let ring = new Ring(ringThetaLengths[i])
      rings[i].push(ring);
      ring.pos.x = ringPositions[i].x
      ring.pos.y = ringPositions[i].y
      ring.pos.z = ringPositions[i].z

      ringThetaLengths[i] += 0.01;

      scene.remove(ring);
      if (ring.geometry) {
        ring.geometry.dispose();
      }
      if (ring.material) {
        ring.material.dispose();
      }

      rings[i].splice(0, 1)
    }

    // rings[i].updateRotation();
    // rings[i].grow();
    // ring.updatePosition();
    // ring.updateLifespan();
    // ring.updateScale();
    // ring.updateColor();
    // ring.reappear();
    // or, cube.update(); // if you want to update all properties
  }



  /*
  // generate
  let cube = new Cube();
  // random position
  // cube.pos.x = random(-WORLD_HALF, WORLD_HALF);
  // cube.pos.y = random(-WORLD_HALF, WORLD_HALF);
  // cube.pos.z = random(-WORLD_HALF, WORLD_HALF);
  cubes.push(cube);

  // update
  for (let cube of cubes) {
    cube.updatePosition();
    cube.updateRotation();
    cube.updateLifespan();
    cube.updateScale();
    cube.updateColor();
    cube.reappear();
    // or, cube.update(); // if you want to update all properties
  }

  // remove cubes that are done
  for (let i = cubes.length - 1; i >= 0; i--) {
    let cube = cubes[i];
    if (cube.isDone) {
      scene.remove(cube.mesh);
      cubes.splice(i, 1);
    }
  }
  */

  // update the value(s) in the GUI
  params.numOfParticles = rings.length;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getCylinder() {
  const geometry = new THREE.CylinderGeometry(1, 1, 1, 8, 1); // radiusTop, radiusBottom, height, radialSegments, heightSegments
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getRing(thetaLength) {
  const geometry = new THREE.RingGeometry(1, 3, 8, 1, 0, thetaLength); // innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

///// CLASS /////

class Cube {
  constructor() {
    // mesh
    this.mesh = getBox();
    scene.add(this.mesh);

    // position
    this.pos = this.mesh.position; // reference to the mesh position
    this.vel = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
    this.acc = new THREE.Vector3();

    // rotation
    this.rot = this.mesh.rotation; // reference to the mesh rotation
    this.rotVel = new THREE.Vector3(
      random(-0.05, 0.05),
      random(-0.05, 0.05),
      random(-0.05, 0.05)
    );
    this.rotAcc = new THREE.Vector3();

    // scale
    this.scale = this.mesh.scale; // reference to the mesh scale
    let size = random(5, 20);
    this.baseScale = new THREE.Vector3(size, size, size);
    this.scale.copy(this.baseScale);

    // mass
    this.mass = 1;

    // color
    this.color = this.mesh.material.color; // reference to the mesh color
    this.mesh.material.transparent = true; // enable transparency for the material

    // lifespan
    this.lifespan = 1; // 100%
    this.lifeReduction = random(0.001, 0.01);
    this.isDone = false;
  }

  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }

  setVelocity(x, y, z) {
    this.vel.set(x, y, z);
    return this;
  }

  setRotationAngle(x, y, z) {
    this.rot.set(x, y, z);
    return this;
  }

  setRotationVelocity(x, y, z) {
    this.rotVel.set(x, y, z);
    return this;
  }

  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    w = Math.max(w, minScale);
    h = Math.max(h, minScale);
    d = Math.max(d, minScale);
    this.baseScale.set(w, h, d);
    this.scale.set(w, h, d);
    return this;
  }

  setMass(mass) {
    if (mass !== undefined) {
      this.mass = mass;
    }
    else {
      this.mass =
        1 +
        this.baseScale.x *
        this.baseScale.y *
        this.baseScale.z *
        0.000001;
    }
    return this;
  }

  applyForce(f) {
    if (this.mass <= 0) return;
    const force = f.clone(); // clone the input force to avoid modifying the original vector
    force.divideScalar(this.mass); // acceleration = force / mass
    this.acc.add(force);
  }

  update() {
    this.updatePosition();
    this.updateRotation();
    this.updateLifespan();
    this.updateScale();
    this.updateColor();
  }

  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
    // or, this.acc.multiplyScalar(0);
    // this.acc.mult(0); // p5's way
  }

  updateRotation() {
    // vector addition for rotation velocity
    this.rotVel.add(this.rotAcc);

    // rotation is by Euler angles, not a vector, so update each component individually
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;

    // reset rotation acceleration
    this.rotAcc.set(0, 0, 0);
  }

  updateScale() {
    this.scale.set(
      this.baseScale.x * this.lifespan,
      this.baseScale.y * this.lifespan,
      this.baseScale.z * this.lifespan
    );
  }

  updateColor() {
    // experiment with color too!
    // this.mesh.material.color.setRGB(this.lifespan, this.lifespan, this.lifespan); // update color based on lifespan
    this.mesh.material.opacity = this.lifespan; // update opacity based on lifespan
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }

  reappear() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = WORLD_HALF;
    }

    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = WORLD_HALF;
    }

    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = WORLD_HALF;
    }
  }

  bounce() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = WORLD_HALF;
      this.vel.x *= -1;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
      this.vel.x *= -1;
    }

    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = WORLD_HALF;
      this.vel.y *= -1;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
      this.vel.y *= -1;
    }

    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = WORLD_HALF;
      this.vel.z *= -1;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
      this.vel.z *= -1;
    }
  }
}

class Ring {
  constructor(thetaLength, positionVector) {
    // mesh
    this.mesh = getRing(thetaLength);
    // console.log(thetaLength)
    scene.add(this.mesh);

    // this.mesh.geometry.parameters.thetaLength = 1;

    // position
    this.pos = this.mesh.position; // reference to the mesh position
    this.vel = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
    this.acc = new THREE.Vector3();

    // rotation
    this.rot = this.mesh.rotation; // reference to the mesh rotation
    this.rot.set(PI / 2, 0, PI / 2); // x & z = PI / 2 保证处于平面，调整y以形成左右高低摆动效果
    this.rotVel = new THREE.Vector3(0, 0, 0);
    this.rotAcc = new THREE.Vector3();

    // scale
    this.scale = this.mesh.scale; // reference to the mesh scale
    let size = random(15, 20);
    this.baseScale = new THREE.Vector3(size, size, size);
    this.scale.copy(this.baseScale);

    // geometry.parameters
    this.innerRadius = this.mesh.geometry.parameters.innerRadius;
    this.outerRadius = this.mesh.geometry.parameters.outerRadius;
    this.thetaSegments = this.mesh.geometry.parameters.thetaSegments;
    this.phiSegments = this.mesh.geometry.parameters.phiSegments;
    this.thetaLength = this.mesh.geometry.parameters.thetaLength;
    // console.log(this.mesh.geometry.parameters.thetaLength);

    // mass
    this.mass = 1;

    // color
    this.color = this.mesh.material.color; // reference to the mesh color
    this.mesh.material.transparent = true; // enable transparency for the material

    // lifespan
    this.lifespan = 1; // 100%
    this.lifeReduction = random(0.001, 0.01);
    this.isDone = false;
  }

  grow() {
    if (this.mesh.geometry.parameters.thetaLength <= PI * 2) {
      this.mesh.geometry.parameters.thetaLength += 0.01;
    } else {
      this.mesh.geometry.parameters.thetaLength = PI * 2;
    }
    // console.log(this.mesh.geometry.parameters.thetaLength);
    // if (this.thetaLength >= PI / 2) {
    //   this.thetaLength = PI / 2;
    // }
  }

  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }

  setVelocity(x, y, z) {
    this.vel.set(x, y, z);
    return this;
  }

  setRotationAngle(x, y, z) {
    this.rot.set(x, y, z);
    return this;
  }

  setRotationVelocity(x, y, z) {
    this.rotVel.set(x, y, z);
    return this;
  }

  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    w = Math.max(w, minScale);
    h = Math.max(h, minScale);
    d = Math.max(d, minScale);
    this.baseScale.set(w, h, d);
    this.scale.set(w, h, d);
    return this;
  }

  setMass(mass) {
    if (mass !== undefined) {
      this.mass = mass;
    }
    else {
      this.mass =
        1 +
        this.baseScale.x *
        this.baseScale.y *
        this.baseScale.z *
        0.000001;
    }
    return this;
  }

  applyForce(f) {
    if (this.mass <= 0) return;
    const force = f.clone(); // clone the input force to avoid modifying the original vector
    force.divideScalar(this.mass); // acceleration = force / mass
    this.acc.add(force);
  }

  update() {
    this.updatePosition();
    this.updateRotation();
    this.updateLifespan();
    this.updateScale();
    this.updateColor();
  }

  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
    // or, this.acc.multiplyScalar(0);
    // this.acc.mult(0); // p5's way
  }

  updateRotation() {
    // vector addition for rotation velocity
    this.rotVel.add(this.rotAcc);

    // rotation is by Euler angles, not a vector, so update each component individually
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;

    // reset rotation acceleration
    this.rotAcc.set(0, 0, 0);
  }

  updateScale() {
    this.scale.set(
      this.baseScale.x * this.lifespan,
      this.baseScale.y * this.lifespan,
      this.baseScale.z * this.lifespan
    );
  }

  updateColor() {
    // experiment with color too!
    // this.mesh.material.color.setRGB(this.lifespan, this.lifespan, this.lifespan); // update color based on lifespan
    this.mesh.material.opacity = this.lifespan; // update opacity based on lifespan
  }

  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }

  reappear() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = WORLD_HALF;
    }

    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = WORLD_HALF;
    }

    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = WORLD_HALF;
    }
  }

  bounce() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = WORLD_HALF;
      this.vel.x *= -1;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
      this.vel.x *= -1;
    }

    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = WORLD_HALF;
      this.vel.y *= -1;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
      this.vel.y *= -1;
    }

    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = WORLD_HALF;
      this.vel.z *= -1;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
      this.vel.z *= -1;
    }
  }
}