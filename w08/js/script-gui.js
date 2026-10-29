const params = {
  fps: 0,
  numOfParticles: 0,
};

let pane;
let lastFrameTime;

function setupGUI() {
  pane = new Pane();
  pane.addBinding(params, "fps", { label: "FPS", readonly: true });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 120,
  });
  pane.addBlade({ view: "separator" });
  pane.addBinding(params, "numOfParticles", { step: 1, readonly: true });
}

function updateGUI() {
  const elapsed = time - lastFrameTime;
  params.fps = elapsed > 0 ? Number((1000 / elapsed).toFixed(2)) : 0;
  lastFrameTime = time;
  params.numOfParticles = cubes.length;
  pane.refresh();
}
