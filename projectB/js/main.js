const axesHelper = new THREE.AxesHelper(1000)

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
// const MAX_PARTICLE_NUMBER = 1000;
// let MAX_PARTICLE_NUMBER = params.maxNumber;
let MAX_PARTICLE_NUMBER = 3000;
let MAX_OUTPARTICLE_NUMBER = 1000;
let SPIN_SPEED = params.spinSpeed;


let particles = [];
let outParticles = [];
let pointCloud;
let outPointCloud;


let plane;


function setupThree() {
  // scene.add(axesHelper);
  scene.background = new THREE.Color('#0a13cc');
  // scene.background = new THREE.Color('#0b19fc');

  plane = getPlane();
  plane.rotation.x = PI / 2;
  // scene.add(plane);



  // Error: THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.
  // for (let i = 0; i < MAX_PARTICLE_NUMBER * 9 / 10; i++) {
  /*
  if (particles.length < MAX_PARTICLE_NUMBER) {
    let p = new Particle(frame, 0);
    let xRan = random(0, 1);
    // let yRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-WORLD_HALF, -WORLD_HALF + 150);
    } else {
      p.pos.x = random(WORLD_HALF - 150, WORLD_HALF);
    }

    p.pos.y = random(-WORLD_SIZE * 3 / 4, WORLD_SIZE * 3 / 4);

    if (zRan < 0.5) {
      p.pos.z = random(-WORLD_HALF, -WORLD_HALF + 150);
    } else {
      p.pos.z = random(WORLD_HALF - 150, WORLD_HALF);
    }

    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis;
    particles.push(p);
  }
  */
  // }
  /*
  for (let i = 0; i < MAX_OUTPARTICLE_NUMBER * 9 / 10; i++) {
    let p = new OutParticle(frame);
    p.pos.x = random(-WORLD_HALF, WORLD_HALF);
    p.pos.y = random(-WORLD_SIZE * 3 / 4, WORLD_SIZE * 3 / 4);
    p.pos.z = random(-WORLD_HALF, WORLD_HALF);
    outParticles.push(p);
  }
  */



  pointCloud = getPoints();
  scene.add(pointCloud);
  outPointCloud = getOutPoints();
  scene.add(outPointCloud);
}


function updateThree() {

  ///// PARTICLES /////
  // generate particles
  if (particles.length < MAX_PARTICLE_NUMBER) {
    let p = new Particle(frame, 0);
    let xRan = random(0, 1);
    // let yRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-WORLD_HALF - 500, -WORLD_HALF + 500);
    } else {
      p.pos.x = random(WORLD_HALF - 500, WORLD_HALF + 500);
    }

    p.pos.y = random(-WORLD_SIZE * 3 / 4, WORLD_SIZE * 3 / 4);

    if (zRan < 0.5) {
      p.pos.z = random(-WORLD_HALF - 500, -WORLD_HALF + 500);
    } else {
      p.pos.z = random(WORLD_HALF - 500, WORLD_HALF + 500);
    }

    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis
    particles.push(p);
  }
  if (outParticles.length < MAX_OUTPARTICLE_NUMBER) {
    let p = new OutParticle(frame, 0);
    let xRan = random(0, 1);
    // let yRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-WORLD_HALF, -WORLD_HALF + 100) / 1.2;
    } else {
      p.pos.x = random(WORLD_HALF - 100, WORLD_HALF) / 1.2;
    }

    p.pos.y = random(-WORLD_SIZE / 1.6, WORLD_SIZE / 1.6) / 1.2;

    if (zRan < 0.5) {
      p.pos.z = random(-WORLD_HALF, -WORLD_HALF + 100) / 1.2;
    } else {
      p.pos.z = random(WORLD_HALF - 100, WORLD_HALF) / 1.2;
    }

    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis
    outParticles.push(p);
  }


  // update particles
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // let xzDis = p.xzDis * sin((abs(p.pos.y) - WORLD_SIZE / 1.2) / (WORLD_SIZE / 1.2)) * 1.2;
    // let xzDis = p.xzDis * sin(abs(p.pos.y) - WORLD_SIZE / 1.2) * 1.2;
    let xzDis = p.xzDis;
    push();
    p.setPosition(0, p.pos.y, 0);
    p.setVelocity(sin((frame + p.frame) / 30) * xzDis, 0, cos((frame + p.frame) / 30) * xzDis);
    // p.setVelocity(sin((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01), - p.pos.y * p.lifespan / MAX_PARTICLE_NUMBER, cos((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01));
    pop();

    // p.attractedTo(0, 0, 0);

    p.updatePosition();
    // p.updateLifespan();

    // remove particles if it's done
    // if ((p.pos.x ** 2 + p.pos.y ** 2 + p.pos.z ** 2) ** 0.5 < 1000) {
    //   p.isDone = true;
    // }

    if (p.isDone) {
      scene.remove(p);
      particles.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < outParticles.length; i++) {
    let p = outParticles[i];

    let xzDis = p.xzDis * sin((abs(p.pos.y) - WORLD_SIZE / 1.2) / (WORLD_SIZE / 1.2)) ** 6 * 1.2;
    // let xzDis = p.xzDis * sin(abs(p.pos.y) - WORLD_SIZE / 1.2) * 1.2;
    push();
    p.setPosition(0, p.pos.y, 0);
    p.setVelocity(sin((frame + p.frame) / 50) * xzDis, - p.pos.y * p.lifespan / MAX_OUTPARTICLE_NUMBER, cos((frame + p.frame) / 50) * xzDis);
    // p.setVelocity(sin((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01), - p.pos.y * p.lifespan / MAX_PARTICLE_NUMBER, cos((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01));
    pop();
    // p.attractedTo(0, 0, 0);

    p.updatePosition();
    p.updateLifespan();

    // remove particles if it's done
    if ((p.pos.x ** 2 + p.pos.y ** 2 + p.pos.z ** 2) ** 0.5 < 1000) {
      p.isDone = true;
    }

    if (p.isDone) {
      scene.remove(p);
      particles.splice(i, 1);
      i--;
    }
  }




  // update point cloud
  let positionArray = pointCloud.geometry.attributes.position.array;
  let colorArray = pointCloud.geometry.attributes.color.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;


    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;


    colorArray[ptIndex + 0] = 1.5 * p.lifespan; // R
    colorArray[ptIndex + 1] = 0.6 * p.lifespan; // G
    colorArray[ptIndex + 2] = 0.2 * p.lifespan; // B
  }
  //pointCloud.geometry.drawRange.count = params.particleNumber;
  pointCloud.geometry.setDrawRange(0, params.particleNumber);
  pointCloud.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.color.needsUpdate = true;

  let outPositionArray = outPointCloud.geometry.attributes.position.array;
  let outColorArray = outPointCloud.geometry.attributes.color.array;
  for (let i = 0; i < outParticles.length; i++) {
    let p = outParticles[i];
    let ptIndex = i * 3;


    outPositionArray[ptIndex + 0] = p.pos.x;
    outPositionArray[ptIndex + 1] = p.pos.y;
    outPositionArray[ptIndex + 2] = p.pos.z;


    outColorArray[ptIndex + 0] = 1.5 * p.lifespan; // R
    outColorArray[ptIndex + 1] = 0.6 * p.lifespan; // G
    outColorArray[ptIndex + 2] = 0.2 * p.lifespan; // B
  }
  //outPointCloud.geometry.drawRange.count = params.particleNumber;
  outPointCloud.geometry.setDrawRange(0, params.particleNumber);
  outPointCloud.geometry.attributes.position.needsUpdate = true;
  outPointCloud.geometry.attributes.color.needsUpdate = true;
}


function getPlane() {
  const texture = new THREE.TextureLoader().load("assets/sea_light.jpg");


  const geometry = new THREE.PlaneGeometry(WORLD_SIZE * 4, WORLD_SIZE * 4, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: "#a6b0eb",
    side: THREE.DoubleSide,
    // wireframe: true,
    map: texture
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}


function getOutPoints() {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  // const texture = new THREE.TextureLoader().load("assets/particle_texture_2.PNG");


  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    vertexColors: true,
    size: 12,
    // map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}

function getPoints() {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  // const texture = new THREE.TextureLoader().load("assets/particle_texture_2.PNG");


  const material = new THREE.PointsMaterial({
    // color: "#bf3636",
    color: "#ff0000",
    vertexColors: true,
    size: 25,
    // map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}
