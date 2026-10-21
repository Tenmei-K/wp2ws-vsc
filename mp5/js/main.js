const axesHelper = new THREE.AxesHelper(1000)

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
// const MAX_PARTICLE_NUMBER = 1000;
let MAX_PARTICLE_NUMBER = params.maxNumber;
let SPIN_SPEED = params.spinSpeed;


let particles = [];
let pointCloud;


let plane;


function setupThree() {
  // scene.add(axesHelper);
  scene.background = new THREE.Color('#0b19fc');

  plane = getPlane();
  plane.rotation.x = PI / 2;
  // scene.add(plane);


  /* 
  // Error: THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    let p = new Particle(frame);
    p.pos.x = random(-WORLD_HALF, WORLD_HALF);
    p.pos.y = random(0, WORLD_SIZE * 3 / 4);
    p.pos.z = random(-WORLD_HALF, WORLD_HALF);
    particles.push(p);
  }
  */




  pointCloud = getPoints();
  scene.add(pointCloud);
}


function updateThree() {
  /*
  ///// PLANE /////
  let positionAttributes = plane.geometry.attributes.position
  for (let i = 0; i < positionAttributes.count; i++) {
    let ptIndex = i * 3;


    let x = positionAttributes.array[ptIndex + 0];
    let y = positionAttributes.array[ptIndex + 1];
    // let z = positionAttributes.array[ptIndex + 2];


    // positionAttributes.array[ptIndex + 2] = random(-100, 100);


    let xOffset = x * 0.001 + frame * 0.003;
    let yOffset = y * 0.001 + frame * 0.003;
    positionAttributes.array[ptIndex + 2] = map(noise(xOffset, yOffset), 0, 1, -300, 300) + 300;
  }
  positionAttributes.needsUpdate = true;
  */

  ///// PARTICLES /////
  // generate particles
  if (particles.length < MAX_PARTICLE_NUMBER) {
    let p = new Particle(frame, 0);
    p.pos.x = random(-WORLD_HALF, WORLD_HALF);
    p.pos.y = random(0, WORLD_SIZE);
    p.pos.z = random(-WORLD_HALF, WORLD_HALF);
    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis
    particles.push(p);
  }


  // update particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    let xzDis = p.xzDis
    push();
    p.setPosition(0, p.pos.y, 0);
    // p.setVelocity(sin((frame + p.frame) / 50) * xzDis, 0, cos((frame + p.frame) / 50) * xzDis);
    // p.setVelocity(sin((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01), - p.pos.y * p.lifespan / MAX_PARTICLE_NUMBER, cos((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01));
    p.setVelocity(sin((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01), 0, cos((frame + p.frame) / (1000 / SPIN_SPEED)) * xzDis * (p.lifespan * 1.01));
    pop();

    p.attractedTo(0, 0, 0);

    p.updatePosition();
    // p.updateLifespan();

    // remove particles if it's done
    if ((p.pos.x ** 2 + p.pos.y ** 2 + p.pos.z ** 2) ** 0.5 < 200) {
      p.isDone = true;
    }

    if (p.isDone) {
      particles.splice(i, 1);
      i--;
    }
  }
  // learn about arrry method: filter();




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


function getPoints() {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  const texture = new THREE.TextureLoader().load("assets/particle_texture.PNG");


  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    vertexColors: true,
    size: 45,
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}
