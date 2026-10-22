let params = {
  fps: 0,
  particleNumber: 0,
  insideParticleNumber: 0,
  maxNumber: 1000,
  Intensity: 0,

  resolutionScale: 0.5,
  reflectionSize: "",
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
  pane.addBinding(params, "insideParticleNumber", {
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });

  pane.addBlade({ view: "separator" });

  pane.addBinding(params, "Intensity", {
    min: 0,
    max: 10,
    step: 1,
  }).on("change", () => {
    SPIN_SPEED = params.Intensity;
  });

  pane.addBlade({ view: "separator" });

  // pane.addBinding(params, "resolutionScale", { min: 0.25, max: 1, step: 0.25 })
  //   .on("change", updateReflectionSize);
  pane.addBinding(params, "reflectionSize", { readonly: true });
}




function updateGUI() {
  params.particleNumber = particles.length;
  params.insideParticleNumber = inParticles.length;

  pane.refresh();
}
