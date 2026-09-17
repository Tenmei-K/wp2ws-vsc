const params = {
  fps: 0,
}

let cube;

function setupThree() {

  cube = getBox();
  scene.add(cube);
  cube.position.set(1, 0, 0); //(x, y, z);
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;

  pane.addBinding(cube, 'position')
  pane.addBinding(cube, 'rotation')
  pane.addBinding(cube.scale, 'x')
}

function updateThree() {
  //cube.rotation.x = time * 0.01
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial({
    //
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}