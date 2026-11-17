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
});