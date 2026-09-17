let controls;
let cube;

function setupThree() {
    cube = getBox();
    cube.scale.set(100, 100, 100);
    cube.position.set(0, 0, 0)
    scene.add(cube);
}

function updateThree() {
    // 类似p5.js的draw()
    // cube.position.x += 1
    // cube.rotation.x += 0.1
    // cube.scale.x += 0.1
}

function getBox() {
    // create the thing
    const geometry = new THREE.BoxGeometry(1, 1, 1); // decide the shape
    /**
    const material = new THREE.MeshBasicMaterial({ // check the three.js library
        color: 0xffff00,
        wireframe: false,
        metalness: false,
        transparency: true,
        opacit: 0.5
    }); // decide the skin
    */
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material);
    return(mesh);
    // append to the scene in setupThree()
}