let controls;
let cube;
let cube1;

function setupThree() {
     
    //console.log(OrbitControls)
    //class OrbitControls extends Controls {
	/**
	 * Constructs a new controls instance.
	 *
	 * @param {Object3D} object - The object that is managed by the controls.
	 * @param {?HTMLElement} domElement - Th…
    */

    controls = new OrbitControls(camera, renderer.domElement); // 可以拖动放大3d环境了

    cube = getBox();
    cube.scale.set(100, 100, 100);
    cube.position.x = -100;
    scene.add(cube);
   
    cube1 = getBox();
    cube1.scale.set(50, 50, 50);
    cube1.position.x = 100;
    scene.add(cube1);
}

function updateThree() {
    // 类似p5.js的translate()
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
        trancparency: true,
        opacit: 0.5
    }); // decide the skin
    */
    const material = new THREE.MeshNormalMaterial()
    const mesh = new THREE.Mesh(geometry, material);
    return(mesh);
    // append to the scene in setupThree()
}