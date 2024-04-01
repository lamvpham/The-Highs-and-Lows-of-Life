// imports for webserver
const express = require("express");
// const { createServer } = require("node:http");

// create a webserver
const app = express();
// subfolder to serve web pages
const http = require('http');
// app.use(express.static("public"));
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

// const io = new Server(server);

// listen for new connections
io.on("connection", (socket) => {
  // log the id of each new client
  console.log(`👋 connect ${socket.id}`);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
  // add listener for "mouse" data
  // socket.on("mouse", (data) => {
  //   console.log(` ${socket.id} mouse`, data);
  //   // broadcast to other clients
  //   socket.broadcast.emit("mouse", data); 
  // });
});

// start the webserver on port 3000
server.listen(5500, () => {
  console.log("webserver started: http://localhost:5500");
});


// setup socket server
// const { Server } = require("socket.io");
// start socket server on webserver
// const io = new Server(server);
console.log(`socket server at ${io.path()}`);

io.on("key", (data) => {
  console.log(` ${socket.id} key`, data);
  // broadcast to other clients
  io.emit("key", data); 
});

io.on("Wheel1", (focusedLabel1) => {
  console.log(` ${socket.id} Wheel1`, focusedLabel1);
  // broadcast to other clients
  io.emit("Wheel1", focusedLabel1); 
});

io.on("Wheel2", (focusedLabel2) => {
  console.log(` ${socket.id} Wheel2`, focusedLabel2);
  // broadcast to other clients
  io.emit("Wheel2", focusedLabel2); 
});

