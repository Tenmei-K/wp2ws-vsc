let params = {
  fps: 0,
  particleNumber: 0,
  insideParticleNumber: 0,
  maxNumber: 1000,
  Intensity: 0,

  shellSize: 1,

  starParticlesShow: true,

  resolutionScale: 0.5,
  reflectionSize: "",
};


let pane;


function setupGUI() {
  pane = new Pane();

  let folderObservation = pane.addFolder({ title: "Observation", expanded: true });

  folderObservation.addBinding(params, "fps", {
    label: "FPS",
    readonly: true,
  });
  folderObservation.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 240,
  });

  folderObservation.addBlade({ view: "separator" });


  folderObservation.addBinding(params, "particleNumber", {
    label: "Particle Number",
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });
  folderObservation.addBinding(params, "insideParticleNumber", {
    label: "Inside Particle Number",
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });


  folderObservation.addBlade({ view: "separator" });

  folderObservation.addBinding(params, "reflectionSize", { label: "Reflection Size", readonly: true });

  pane.addBlade({ view: "separator" });


  let folderOperation = pane.addFolder({ title: "Operation", expanded: true });

  folderOperation.addBinding(params, "Intensity", {
    min: 0,
    max: 10,
    step: 1,
  }).on("change", () => {
    MAX_PARTICLE_NUMBER = 2000 + params.Intensity * 100;
    MAX_INPARTICLE_NUMBER = 600 - params.Intensity * 30;
    SPACE_RADIUS = WORLD_HALF - params.Intensity * 50
    WALL_THICKNESS = 200 + params.Intensity * 20;
    STAR_MAX_SCALE = 300 + params.Intensity * 50;
  });

  folderOperation.addBinding(params, "shellSize", {
    label: "Shell Size",
    min: 1,
    max: 8,
    step: 1,
  }).on("change", () => {
    SHELL_SIZE = 10 - params.shellSize
  });

  folderOperation.addBinding(
    params, 'starParticlesShow', {label: "Star Particles Show"}
  ).on("change", () => {
    inStarsShow = params.starParticlesShow;
  });


  // pane.addBinding(params, "resolutionScale", { min: 0.25, max: 1, step: 0.25 })
  //   .on("change", updateReflectionSize);
}




function updateGUI() {
  params.particleNumber = particles.length;
  params.insideParticleNumber = inParticles.length;

  pane.refresh();
}
