const axesHelper = new THREE.AxesHelper(1000)

let params = {
  fps: 0,
  numOfParticles: 0,
  fogDensity: 0.001,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let light;

function setupThree() {
  scene.add(axesHelper);
  scene.background = new THREE.Color('#000000');

  // GUI
  pane.addBinding(params, "fogDensity", {
    min: 0.0001,
    max: 0.001,
    step: 0.0001,
  })

  // light
  // const ambiLight = new THREE.AmbientLight("#ffffff");
  // scene.add(ambiLight);
  const hemiLight = new THREE.HemisphereLight("#1caefd", "#6428ef", 1);
  // const helper = new THREE.HemisphereLightHelper(light, 5);
  scene.add(hemiLight);

  // point light
  light = new THREE.PointLight("#ffffff", 1, 800, 0.1);
  light.position.set(0, 200, 0);
  scene.add(light);
  let sphere = getSphere();
  sphere.scale.set(10, 10, 10);
  light.add(sphere);


  // fog
  // scene.fog = new THREE.Fog('#000000', 0.002, WORLD_SIZE );
  scene.fog = new THREE.FogExp2('#000000', params.fogDensity);

  // floor
  let floor = getPlane();
  floor.scale.x = WORLD_SIZE;
  floor.scale.y = WORLD_SIZE;
  floor.rotation.x = - PI / 2;
  floor.position.y = - 200;
  scene.add(floor);

  // boxes
  let gap = 150;
  for (let x = -WORLD_HALF; x <= WORLD_HALF; x += gap) {
    for (let z = -WORLD_HALF; z <= WORLD_HALF; z += gap) {
      let cube = getBox();
      cube.position.set(x, -200, z);

      cube.geometry.translate(0, 0.50, 0);
      cube.scale.set(60, random(60, 300), 60);
      scene.add(cube)
    }
  }
}

function updateThree() {
  scene.fog.density = params.fogDensity;

  light.position.x = cos(frame * 0.02) * 300;
  light.position.z = sin(frame * 0.02) * 300;

}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  // });
  // const material = new THREE.MeshNormalMaterial();
  const material = new THREE.MeshPhongMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: "#1a3d4d",
    side: THREE.DoubleSide,
    // wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 16);
  const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
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