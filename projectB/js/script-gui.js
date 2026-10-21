let params = {
  fps: 0,
  particleNumber: 0,
  maxNumber: 1000,
  spinSpeed: 5,
};


let pane;


function setupGUI() {
  pane = new Pane();
  
  pane.addBinding(params, "fps", {
    label: "FPS",
    readonly: true,
  });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 240,
  });
  pane.addBlade({ view: "separator" });

  
  pane.addBinding(params, "particleNumber", {
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });
  
  // pane.addBinding(params, "maxNumber", {
  //   min: 100,
  //   max: 2000,
  //   step: 100,
  // }).on("change", () => {
  //   MAX_PARTICLE_NUMBER = params.maxNumber;
  // });
  pane.addBinding(params, "spinSpeed", {
    min: 5,
    max: 50,
    step: 1,
  }).on("change", () => {
    SPIN_SPEED = params.spinSpeed;
  });
}


function updateGUI() {
  params.particleNumber = particles.length;
  
  pane.refresh();
}
