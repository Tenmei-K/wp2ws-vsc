// console.log("hi!");

// const http = require("http");
// import http from "node:http" // import is from ES6, suggested

// 2. Terminal: node install express
import express from "express";
const app = express();

/* 1. create http server using node */
import http from "http";
const server = http.createServer(app);
const hostname = "127.0.0.1"; // localhost
const port = 3000;


server.listen(port, hostname, function () {
    console.log("Server is running: " + hostname + " Port: " + port);
});

/* 3. after installing express */
// app is using express in "public"
app.use(express.static("public"));
// app.get("/", function (request, response) {
//     response.send("hi!");
// });

/* 4. add different ways to respond */
app.get("/world", function (request, response) {
    response.send("this is the world!");
    // response.sendFile("world.html", {
    //     root: import.meta.dirname,
    // });
});

// CommonJS
// const socket = require("socket.io");
// const io = socket(server);

import { Server } from "socket.io"; // we will be able to access socket.io.js in index.html
const io = new Server(server);

// () => {}

// triggers once new connection is detected, on() is similar to onClick, onKeyPressed...
io.on("connection", function (socket) {
    console.log("User connected. ID: ", socket.id);

    // as the server, receive data from script-p5, link by using "message_name"
    socket.on("message_name", function (data) {
        console.log(data);
        socket.broadcast.emit("message_name", data);

    })
});