let params = {
  fps: 0,
  near: 1,
  far: 2600,
  intensity: 1,
  distance: 1000,
  angle: Math.PI / 6,
  penumbra: 0,
  decay: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_POSITION = -200;
const COLOR_BG = 0x000000;

let plane;
let cubes = [];

let light;
let spotLightHelper;

function setupThree() {
  // FLOOR
  plane = getPlane(WORLD_HALF * 2 + 200, WORLD_HALF * 2 + 200);
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // CUBES
  const distance = 100;
  for (let z = -WORLD_HALF; z <= WORLD_HALF; z += distance) {
    for (let x = -WORLD_HALF; x <= WORLD_HALF; x += distance) {
      let tCube = new Cube()
        .setPosition(x, FLOOR_POSITION, z)
        .setScale(50, random(2, 18) ** 2, 50)
        .setTranslation(0, 0.5, 0);
      cubes.push(tCube);
    }
  }

  // LIGHTS
  const ambiLight = new THREE.AmbientLight(0x333333);
  scene.add(ambiLight);

  const hemiLight = new THREE.HemisphereLight(0x000099, 0x330000, 1); //skyColor, groundColor, intensity
  scene.add(hemiLight);


  // point light
  // light = getPointLight();
  light = getSpotLight();
  light.intensity = params.intensity;
  light.distance = params.distance;
  light.angle = params.angle;
  light.penumbra = params.penumbra;
  light.decay = params.decay;
  scene.add(light);

  let lightMesh = getSphere();
  lightMesh.scale.set(20, 20, 20)
  light.add(lightMesh); // !!!

  spotLightHelper = new THREE.SpotLightHelper(light);
  scene.add(spotLightHelper);

  // FOG
  scene.fog = new THREE.FogExp2(0x000000, params.fogDensity);

  // GUI
  let folderFog = pane.addFolder({ title: "Fog", expanded: true });
  folderFog.addBinding(params, "near", { min: 1, max: 5000, step: 1 });
  folderFog.addBinding(params, "far", { min: 1, max: 5000, step: 1 });

  let folderLight = pane.addFolder({ title: "Light", expanded: true });
  folderLight.addBinding(params, "intensity", { min: 0, max: 1, step: 0.01 });
  folderLight.addBinding(params, "distance", { min: 1, max: 2000, step: 1 });
  folderLight.addBinding(params, "angle", { min: 0, max: PI, step: 0.001 });
  folderLight.addBinding(params, "penumbra", { min: 0, max: 1, step: 0.01 });
  folderLight.addBinding(params, "decay", { min: 0, max: 1, step: 0.0001 });

}

function updateThree() {
  scene.fog.density = params.fogDensity;

  // update the objects
  for (let c of cubes) {
    //c.update();
  }

  light.position.y = map(sin(frame * 0.01), -1, 1, 200, 500);
  light.position.x = cos(frame * 0.01) * 300;
  light.position.z = sin(frame * 0.01) * 300;
  light.rotation.x += 0.03;
  light.rotation.y -= 0.03;
  light.rotation.z -= 0.03;

  spotLightHelper.update();
}


function getSpotLight() {
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = true; // 2 !!
  return spotLight;
}


function getPointLight() {
  const light = new THREE.PointLight("#ffffff", 1, 1000, 0); // color, intensity, distance, decay
  return light
}

function getPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    //color: 0xFFFFFF,
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);

    this.pos = this.mesh.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();

    this.rot = this.mesh.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();

    this.scale = this.mesh.scale;
    this.baseScale = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
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
      this.mass = 1 + this.baseScale.x * this.baseScale.y * this.baseScale.z * 0.000001;
    }
    return this;
  }
  applyForce(f) {
    if (this.mass <= 0) return;
    const force = f.clone();
    force.divideScalar(this.mass);
    this.acc.add(force);
  }
  update() {
    this.updatePosition();
    this.updateRotation();
  }
  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
  }
  updateRotation() {
    this.rotVel.add(this.rotAcc);
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;
    this.rotAcc.set(0, 0, 0);
  }
}