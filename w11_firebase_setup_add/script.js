let database, dbRef;

function setup() {
  createCanvas(800, 600);
  background(0);

  setupDB();
  dbRef = getDBReference("classroom/drawingPoints");
}

function draw() {
  //
}

function mousePressed() {
  let data = {
    x: mouseX,
    y: mouseY
  };
  FirebaseDatabase.push(dbRef, data).catch(error => {
    console.error("Could not save the point:", error.message);
  });
}

function setupDB() {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAAvMnKKJ35V_cet2vfhbYXwoJPz9SCygg",
    authDomain: "wp2ws-demo-b1b55.firebaseapp.com",
    databaseURL: "https://wp2ws-demo-b1b55-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wp2ws-demo-b1b55",
    storageBucket: "wp2ws-demo-b1b55.firebasestorage.app",
    messagingSenderId: "137584229870",
    appId: "1:137584229870:web:fb907e41344bfb715da2ff"
  };
  const app = FirebaseApp.initializeApp(firebaseConfig);
  database = FirebaseDatabase.getDatabase(app);
}

function getDBReference(refName) {
  const reference = FirebaseDatabase.ref(database, refName);

  // event listeners
  FirebaseDatabase.onChildAdded(reference, data => {
    console.log("! DB ADDED");
    console.log(data.key);
    console.log(data.val());

    let value = data.val();
    fill(255);
    rect(value.x, value.y, 10, 10);
  });
  FirebaseDatabase.onChildRemoved(reference, data => {
    console.log("! DB REMOVED");
    console.log(data.key);
    console.log(data.val());
  });
  FirebaseDatabase.onChildChanged(reference, data => {
    console.log("! DB CHANGED");
    console.log(data.key);
    console.log(data.val());
  });
  FirebaseDatabase.onChildMoved(reference, data => {
    console.log("! DB MOVED");
    console.log(data.key);
    console.log(data.val());
  });

  return reference;
}
