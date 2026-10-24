let params = {
  fps: 0,
  particleNumber: 0,
  insideParticleNumber: 0,
  maxNumber: 1000,

  Intensity: 0,

  bgColor: "#000710",
  shellSize: 1,

  starParticlesShow: true,
  starModelShow: true,

  resolutionScale: 0.5,
  reflectionSize: "",
};


let pane;
let tab;


function setupGUI() {
  pane = new Pane();

  tab = pane.addTab({
    pages: [
      { title: 'Operation' },
      { title: 'Monitor' },
    ],
  });

  // let tab.pages[1] = pane.addFolder({ title: "Observation", expanded: true });

  tab.pages[1].addBinding(params, "fps", {
    label: "FPS",
    readonly: true,
  });
  tab.pages[1].addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 240,
  });

  tab.pages[1].addBlade({ view: "separator" });


  tab.pages[1].addBinding(params, "particleNumber", {
    label: "Particle Number",
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });
  tab.pages[1].addBinding(params, "insideParticleNumber", {
    label: "Inside Particle Number",
    // min: 0,
    // max: MAX_PARTICLE_NUMBER,
    step: 1,
  });


  tab.pages[1].addBlade({ view: "separator" });

  tab.pages[1].addBinding(params, "reflectionSize", { label: "Reflection Size", readonly: true });

  pane.addBlade({ view: "separator" });


  // let tab.pages[0] = pane.addFolder({ title: "Operation", expanded: true });


  tab.pages[0].addBinding(params, "bgColor", {
    label: "Background Color",
    picker: 'inline',
    expanded: false,
  }).on("change", () => {
    scene.background = new THREE.Color(params.bgColor);
  });

  tab.pages[0].addBinding(params, "shellSize", {
    label: "Shell Size",
    min: 1,
    max: 8,
    step: 1,
  }).on("change", () => {
    SHELL_SIZE = 10 - params.shellSize
  });

  tab.pages[0].addBinding(
    params, 'starParticlesShow', { label: "Show Star Particles" }
  ).on("change", () => {
    inStarsShow = params.starParticlesShow;
  });
  tab.pages[0].addBinding(
    params, 'starModelShow', {
    label: "Center",
    options: {
      model: true,
      particle: false,
    }
  }
  ).on("change", () => {
    modelShow = params.starModelShow;
  });

  tab.pages[0].addBlade({ view: "separator" });

  tab.pages[0].addBinding(params, "Intensity", {
    label: "INTENSITY",
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
  tab.pages[0].addButton({
    title: "RESTORE",
  }).on("click", () => {
    params.Intensity = 0;
    params.bgColor = "#000710";
    params.shellSize = 1;
    params.starParticlesShow = true;
    params.starModelShow = true;
  })


}




function updateGUI() {
  params.particleNumber = particles.length;
  params.insideParticleNumber = inParticles.length;

  pane.refresh();
}
