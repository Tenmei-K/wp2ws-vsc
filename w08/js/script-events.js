let mouseClicked = false;

window.addEventListener("resize", function () {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousemove", function() {
  mouse.x = map(event.clientX / window.innerWidth, 0, 1, -1, 1);
  // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = map(event.clientY / window.innerHeight, 0, 1, 1, -1);
})

window.addEventListener("click", function() {
  mouse.x = map(event.clientX / window.innerWidth, 0, 1, -1, 1);
  mouse.y = map(event.clientY / window.innerHeight, 0, 1, 1, -1);
  mouseClicked = true;
})