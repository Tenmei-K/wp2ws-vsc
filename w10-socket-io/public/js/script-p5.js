function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  // canvas.hide();

  background(100);

  setupSocket();

  initThree(); // ***
}

function draw() {
  // noLoop();
}

let socket;
function setupSocket() {
  socket = io();

  socket.on("connect", function () {
    console.log("Connected. ID: ", socket.id);
  });

  socket.on("message_name", receiveViaSocket);
}

function mousePressed() {
  let sendingData = {
    x: mouseX,
    y: mouseY,
  };

  // noStroke();
  // fill(100, 100, 100);

  sendViaSocket(sendingData);
}

function sendViaSocket(data) {
  // send sendingData to server, link by using "message_name"
  socket.emit("message_name", data);
}

function receiveViaSocket(data) {
  console.log(data);
  // circle(data.x, data.y, 30);
}