const axesHelper = new THREE.AxesHelper(1000)

const WORLD_SIZE = 2400;
const WORLD_HALF = WORLD_SIZE / 2;

let MAX_PARTICLE_NUMBER = 1800 + params.Intensity * 100;
let MAX_INPARTICLE_NUMBER = 600 - params.Intensity * 30;
let MAX_INSTAR_NUMBER = 60;

let SPACE_HEIGHT_HALF = WORLD_SIZE / 3 - 50
let SPACE_RADIUS = WORLD_HALF - params.Intensity * 20
let WALL_THICKNESS = 240 + params.Intensity * 10;

let particles = [];
let inParticles = [];
let pointCloud;
let inPointCloud;

let SHELL_SIZE = 10 - params.shellSize;

let STAR_MAX_SCALE = 300 + params.Intensity * 50;

let stars = [];
let starScale = 0.01;
let starPointClouds = [];

let inStars = [];
let inStarCloud;
let inStarsShow = params.starParticlesShow;

let model;

let groundMirror, ceilingMirror;
let RESOLUTION_SCALE = 0.95 - params.Intensity * 0.05;


function setupThree() {
  // scene.add(axesHelper);
  scene.background = new THREE.Color('#000710');
  // scene.background = new THREE.Color('#011128');
  // scene.background = new THREE.Color('#030972');
  // scene.background = new THREE.Color('#0b19fc');

  // Error: THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.
  /*
  // for (let i = 0; i < MAX_PARTICLE_NUMBER * 9 / 10; i++) {
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
  // }
  for (let i = 0; i < MAX_INPARTICLE_NUMBER * 9 / 10; i++) {
    let p = new InParticle(frame);
    p.pos.x = random(-WORLD_HALF, WORLD_HALF);
    p.pos.y = random(-WORLD_SIZE * 3 / 4, WORLD_SIZE * 3 / 4);
    p.pos.z = random(-WORLD_HALF, WORLD_HALF);
    inParticles.push(p);
  }
  */


  ///// MODEL /////
  loadGLTF("assets/star.glb");


  ///// MIRROR /////
  groundMirror = getCircleMirror();
  scene.add(groundMirror);
  groundMirror.position.y = -SPACE_HEIGHT_HALF;
  groundMirror.rotateX(-Math.PI / 2);
  groundMirror.scale.set(3, 3)

  ceilingMirror = getCircleMirror();
  scene.add(ceilingMirror);
  ceilingMirror.position.y = SPACE_HEIGHT_HALF;
  ceilingMirror.rotateX(Math.PI / 2);
  ceilingMirror.scale.set(3, 3)



  ///// PARTICLES /////

  // for (let i = 0; i < 1; i++) {
  let star = new Star();
  star.pos.x = 0;
  star.pos.y = 0;
  star.pos.z = 0;
  stars.push(star);
  // star.geometry.scale.needsUpdate = true;
  // }

  pointCloud = getPoints();
  scene.add(pointCloud);
  inPointCloud = getInPoints();
  scene.add(inPointCloud);
  let starPointCloud = getStarPoints(starScale, STAR_MAX_SCALE); // 此处在setup里加入parameter，update里无法更新
  starPointClouds.push(starPointCloud);
  scene.add(starPointCloud);
  inStarCloud = getInStars();
  if (inStarsShow == true) {
    scene.add(inStarCloud);
  }
}


function updateThree() {

  ///// MODEL /////
  if (model) {
    model.rotation.y += 0.01;
  }

  ///// MIRROR /////
  RESOLUTION_SCALE = 0.95 - params.Intensity * 0.07;
  updateReflectionSize();

  ///// PARTICLES /////
  // generate particles
  if (particles.length < MAX_PARTICLE_NUMBER) {
    let p = new Particle(frame, 0);
    let xRan = random(0, 1);
    // let yRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-SPACE_RADIUS - WALL_THICKNESS, -SPACE_RADIUS + WALL_THICKNESS);
    } else {
      p.pos.x = random(SPACE_RADIUS - WALL_THICKNESS, SPACE_RADIUS + WALL_THICKNESS);
    }

    p.pos.y = random(-SPACE_HEIGHT_HALF, SPACE_HEIGHT_HALF);

    if (zRan < 0.5) {
      p.pos.z = random(-SPACE_RADIUS - WALL_THICKNESS, -SPACE_RADIUS + WALL_THICKNESS);
    } else {
      p.pos.z = random(SPACE_RADIUS - WALL_THICKNESS, SPACE_RADIUS + WALL_THICKNESS);
    }

    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis
    particles.push(p);
  }
  if (inParticles.length < MAX_INPARTICLE_NUMBER) {
    let p = new InParticle(frame, 0);
    let xRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-WORLD_HALF, -WORLD_HALF + 100) / 1.2;
    } else {
      p.pos.x = random(WORLD_HALF - 100, WORLD_HALF) / 1.2;
    }

    p.pos.y = random(-WORLD_SIZE / 2.8, WORLD_SIZE / 2.8);

    if (zRan < 0.5) {
      p.pos.z = random(-WORLD_HALF, -WORLD_HALF + 100) / 1.2;
    } else {
      p.pos.z = random(WORLD_HALF - 100, WORLD_HALF) / 1.2;
    }

    let xzDis = (p.pos.x ** 2 + p.pos.z ** 2) ** 0.5
    p.xzDis = xzDis
    inParticles.push(p);
  }
  if (stars.length < 1) {
    let star = new Star();
    star.pos.x = 0;
    star.pos.y = 0;
    star.pos.z = 0;
    stars.push(star);
  }
  if (inStarsShow == true && inStars.length < MAX_INSTAR_NUMBER && frame % (20 - params.Intensity) == 0) {
    let p = new InStar();

    /*
    let xRan = random(0, 1);
    // let yRan = random(0, 1);
    let zRan = random(0, 1);

    if (xRan < 0.5) {
      p.pos.x = random(-SPACE_RADIUS - WALL_THICKNESS, -SPACE_RADIUS + WALL_THICKNESS);
    } else {
      p.pos.x = random(SPACE_RADIUS - WALL_THICKNESS, SPACE_RADIUS + WALL_THICKNESS);
    }

    p.pos.y = random(-WORLD_SIZE / 3, WORLD_SIZE / 3);

    if (zRan < 0.5) {
      p.pos.z = random(-SPACE_RADIUS - WALL_THICKNESS, -SPACE_RADIUS + WALL_THICKNESS);
    } else {
      p.pos.z = random(SPACE_RADIUS - WALL_THICKNESS, SPACE_RADIUS + WALL_THICKNESS);
    }
      */

    p.pos.x = random(-(SPACE_RADIUS - WALL_THICKNESS), (SPACE_RADIUS - WALL_THICKNESS));
    p.pos.y = p.pos.y = random(-SPACE_HEIGHT_HALF, SPACE_HEIGHT_HALF);
    p.pos.z = random(-(SPACE_RADIUS - WALL_THICKNESS), (SPACE_RADIUS - WALL_THICKNESS));

    inStars.push(p);
  }


  // update particles

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    let xzDis = p.xzDis;
    push();
    p.setPosition(0, p.pos.y, 0);
    p.setVelocity(sin((frame + p.frame) / (50 - params.Intensity * 2.5)) * xzDis, 0, cos((frame + p.frame) / (50 - params.Intensity * 2.5)) * xzDis);
    pop();

    p.updatePosition();
    p.updateLifespan();

  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // if (abs(p.pos.x) < SPACE_RADIUS - WALL_THICKNESS && abs(p.pos.z) < SPACE_RADIUS - WALL_THICKNESS) {
    //   p.opacity = 0;
    //   p.isDone = true;
    // }

    if (p.isDone) {
      scene.remove(p);
      if (p.geometry) {
        p.geometry.dispose();
      }
      if (p.material) {
        p.material.dispose();
      }
      particles.splice(i, 1);
    }
  }

  for (let i = 0; i < inParticles.length; i++) {
    let p = inParticles[i];

    let xzDisOrigin = p.xzDis * sin((abs(p.pos.y) - WORLD_SIZE / 1.2) / (WORLD_SIZE / 1.2)) ** SHELL_SIZE * 1.2;
    let xzDis = map(abs(sin(frame / (100 - params.Intensity * 7.2))), 0, 1, xzDisOrigin * (1.25 + params.Intensity / 30) / 2.5, xzDisOrigin * (1.25 + params.Intensity / 30))

    push();
    p.setPosition(0, p.pos.y, 0);
    p.setVelocity(sin((frame + p.frame) / (30 + params.Intensity * 2)) * xzDis, 0, cos((frame + p.frame) / (30 + params.Intensity * 2)) * xzDis);
    pop();

    p.updatePosition();
    p.updateLifespan();

  }

  for (let i = inParticles.length - 1; i >= 0; i--) {
    let p = inParticles[i];

    if (p.isDone) {
      scene.remove(p);
      if (p.geometry) {
        p.geometry.dispose();
      }
      if (p.material) {
        p.material.dispose();
      }
      inParticles.splice(i, 1);
    }
  }


  starScale = abs(sin(frame / (100 - params.Intensity * 7.2)));
  STAR_MAX_SCALE = 300 + params.Intensity * 50;

  if (stars.length > 0) {

    let starPointCloud = getStarPoints(starScale, STAR_MAX_SCALE);
    starPointClouds.push(starPointCloud)
    scene.add(starPointCloud);

    let star = new Star();
    stars.push(star);
    star.pos.x = 0;
    star.pos.y = 0;
    star.pos.z = 0;

    if (stars.length > 1) {
      stars.splice(0, 1);
    }

    if (starPointClouds.length > 2) {
      scene.remove(starPointClouds[0]);
      if (starPointClouds[0].geometry) {
        starPointClouds[0].geometry.dispose();
      }
      if (starPointClouds[0].material) {
        starPointClouds[0].material.dispose();
      }
      starPointClouds.splice(0, 1);
    }
  }


  if (inStarsShow == false) {
    // scene.remove(inStarCloud)
    inStars = [];
    inStarCloud.visible = false;
  } else {
    inStarCloud.visible = true;
  }
  for (let i = 0; i < inStars.length; i++) {
    let p = inStars[i];
    // p.flow()

    p.updatePosition();
    p.updateLifespan();
  }

  for (let i = inStars.length - 1; i >= 0; i--) {
    let p = inStars[i];

    if (p.isDone) {
      scene.remove(p);
      if (p.geometry) {
        p.geometry.dispose();
      }
      if (p.material) {
        p.material.dispose();
      }
      inStars.splice(i, 1);
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
  pointCloud.geometry.setDrawRange(0, MAX_PARTICLE_NUMBER);
  pointCloud.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.color.needsUpdate = true;

  let inPositionArray = inPointCloud.geometry.attributes.position.array;
  let inColorArray = inPointCloud.geometry.attributes.color.array;
  for (let i = 0; i < inParticles.length; i++) {
    let p = inParticles[i];
    let ptIndex = i * 3;


    inPositionArray[ptIndex + 0] = p.pos.x;
    inPositionArray[ptIndex + 1] = p.pos.y;
    inPositionArray[ptIndex + 2] = p.pos.z;


    // inColorArray[ptIndex + 0] = 1.5 * p.lifespan; // R
    // inColorArray[ptIndex + 1] = 0.6 * p.lifespan; // G
    // inColorArray[ptIndex + 2] = 0.2 * p.lifespan; // B
    inColorArray[ptIndex + 0] = 0.2;
    inColorArray[ptIndex + 1] = 0.2;
    inColorArray[ptIndex + 2] = 0.2;

  }
  //inPointCloud.geometry.drawRange.count = params.particleNumber;
  inPointCloud.geometry.setDrawRange(0, MAX_INPARTICLE_NUMBER);
  inPointCloud.geometry.attributes.position.needsUpdate = true;
  inPointCloud.geometry.attributes.color.needsUpdate = true;


  for (let j = 0; j < starPointClouds.length; j++) {
    for (let i = 0; i < stars.length; i++) {
      let p = stars[i];
      let ptIndex = i * 3;


      let starPositionArray = starPointClouds[j].geometry.attributes.position.array;
      let starColorArray = starPointClouds[j].geometry.attributes.color.array;
      starPositionArray[ptIndex + 0] = p.pos.x;
      starPositionArray[ptIndex + 1] = p.pos.y;
      starPositionArray[ptIndex + 2] = p.pos.z;


      starColorArray[ptIndex + 0] = 1.5 * p.lifespan; // R
      starColorArray[ptIndex + 1] = 0.6 * p.lifespan; // G
      starColorArray[ptIndex + 2] = 0.2 * p.lifespan; // B
    }
    //starPointClouds[j].geometry.drawRange.count = params.particleNumber;
    starPointClouds[j].geometry.setDrawRange(0, 5);
    starPointClouds[j].geometry.attributes.position.needsUpdate = true;
    starPointClouds[j].geometry.attributes.color.needsUpdate = true;
    starPointClouds[j].material.size.needsUpdate = true;
  }

  let inStarPositionArray = inStarCloud.geometry.attributes.position.array;
  let inStarColorArray = inStarCloud.geometry.attributes.color.array;
  for (let i = 0; i < inStars.length; i++) {
    let p = inStars[i];
    let ptIndex = i * 3;


    inStarPositionArray[ptIndex + 0] = p.pos.x;
    inStarPositionArray[ptIndex + 1] = p.pos.y;
    inStarPositionArray[ptIndex + 2] = p.pos.z;


    inStarColorArray[ptIndex + 0] = 1.5 * p.lifespan; // R
    inStarColorArray[ptIndex + 1] = 0.6 * p.lifespan; // G
    inStarColorArray[ptIndex + 2] = 0.2 * p.lifespan; // B

  }
  inStarCloud.geometry.setDrawRange(0, MAX_INSTAR_NUMBER);
  inStarCloud.geometry.attributes.position.needsUpdate = true;
  inStarCloud.geometry.attributes.color.needsUpdate = true;

}


function loadGLTF(filepath) {
  // Import GLTFLoader from the Three.js addons before using it.
  // See index.html for the import setup!
  const loader = new GLTFLoader();

  loader.load(
    filepath,
    function (gltfData) {
      // add the whole scene
      model = gltfData.scene;
      model.scale.setScalar(900);

      let light = new THREE.PointLight("#ffffff", 1, 800, 0.1);
      light.position.set(0, 0, 0);
      scene.add(light);
      model.traverse((child) => {
        if (child.isMesh) {
          light.add(child);
        }
      })
      // model.traverse((child) => {
      //   if (child.isMesh) {
      //     child.material.emissive = new THREE.Color("#5afcff");
      //     child.material.emissiveIntensity = 1.5;
      //   }
      // });

      // Keep the original materials and textures!
      scene.add(model);
    },
    function (xhr) {
      // show loading progress
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      } else {
        console.log(`${(xhr.loaded / 1024).toFixed(0)} KB downloaded (total unknown)`);
      }
    },
    function (err) {
      // report loading errors
      console.error("couldn't load the model file", err);
    }
  );
}

function updateReflectionSize() {
  // we use ceil() here to ensure the render target size is an integer and greater than zero!
  const width = ceil(window.innerWidth * RESOLUTION_SCALE);
  const height = ceil(window.innerHeight * RESOLUTION_SCALE);
  groundMirror.getRenderTarget().setSize(width, height);
  ceilingMirror.getRenderTarget().setSize(width, height);
  params.reflectionSize = `${width} x ${height}`;
}

function getInStars() {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  const texture = new THREE.TextureLoader().load("assets/particle_texture.PNG");


  const material = new THREE.PointsMaterial({
    color: "#5ec9ca",
    vertexColors: true,
    size: random(50, 80),
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}

function getStarPoints(starScale, maxScale) {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  const texture = new THREE.TextureLoader().load("assets/particle_texture.PNG");


  const material = new THREE.PointsMaterial({
    color: "#5afcff",
    vertexColors: true,
    size: starScale * maxScale,
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}

function getInPoints() {
  const vertices = new Float32Array(MAX_PARTICLE_NUMBER * 3);
  const colors = new Float32Array(MAX_PARTICLE_NUMBER * 3);


  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


  // const texture = new THREE.TextureLoader().load("assets/particle_texture_2.PNG");


  const material = new THREE.PointsMaterial({
    color: "#80b9f2",
    vertexColors: true,
    opacity: 0.4,
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


  const texture = new THREE.TextureLoader().load("assets/particle_texture_2.PNG");


  const material = new THREE.PointsMaterial({
    // color: "#bf3636",
    // color: "#ff0000",
    color: "#5e131f",
    vertexColors: true,
    size: random(30, 60),
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });


  const points = new THREE.Points(geometry, material);


  return points;
}

// code from https://github.com/MOQN/IMA-Web-Page-To-Web-Space/blob/main/06_adding_realism/19_Reflector_resolution/js/main.js
function getCircleMirror() {
  let geometry = new THREE.CircleGeometry(400, 640);

  // Import Reflector from the Three.js addons before using it.
  // See index.html for the import setup!
  let reflector = new Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: 1,
    textureHeight: 1,
    color: 0x777777
  });

  return reflector;
}