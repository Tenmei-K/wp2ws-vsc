const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;


let cubes = [];

let raycaster;
let mouse = new THREE.Vector2(-2, -2); // 一开始所有cube的vector都在(0, 0, 0)，将mouse的位置先设置在画布外可以防止所有cube都被检测为intersect

function setupThree() {
  // get the raycaster
  raycaster = new THREE.Raycaster(); // origin: mouse; direction: camera

  // generate particles
  for (let i = 0; i < 100; i++) {
    // generate
    let cube = new Cube();
    scene.add(cube.mesh);
    // random position
    cube.pos.x = random(-WORLD_HALF, WORLD_HALF);
    cube.pos.y = random(-WORLD_HALF, WORLD_HALF);
    cube.pos.z = random(-WORLD_HALF, WORLD_HALF);
    cubes.push(cube);
  }
}


function updateThree() {
  raycaster.setFromCamera(mouse, camera);

  // get al meshes from the cubes, push them in to an array
  let meshes = [];
  for (let i = 0; i < cubes.length; i++) {
    let cube = cubes[i];
    meshes.push(cube.mesh)
  }
  // and check the intersects
  let intersects = raycaster.intersectObjects(meshes);
  if (mouseClicked) {
    for (let intersect of intersects) {
      // intersect
      let selectedMesh = intersect.object;
      for (let cube of cubes) {
        // cube
        if (cube.mesh == selectedMesh) {
          cube.mesh.material.color.set("#39c5bb")
          // cube.isDone = true;
          break; // allows you to only check the very first intersection
        }
      }
    }
    mouseClicked = false;
  }


  for (let cube of cubes) {
    // cube
  }


  // update
  for (let cube of cubes) {
    // cube.updatePosition();
    // cube.updateRotation();
    // cube.updateLifespan();
    // cube.updateScale();
    cube.updateColor();
    cube.reappear(WORLD_HALF);
    // or, cube.update(); // if you want to update all properties
  }


  // remove cubes that are done
  for (let i = cubes.length - 1; i >= 0; i--) {
    let cube = cubes[i];
    if (cube.isDone) {
      cube.dispose();
      cubes.splice(i, 1);
    }
  }
}