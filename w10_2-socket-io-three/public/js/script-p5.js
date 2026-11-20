function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  background(100);

  initThree(); // ***
}

function draw() {
  noLoop();
}