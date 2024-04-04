// imports for webserver
const express = require("express");
const { createServer } = require("node:http");

// create a webserver
const app = express();
// subfolder to serve web pages
app.use(express.static("public"));
const server = createServer(app);

// start the webserver on port 3000
server.listen(3000, () => {
  console.log("webserver started: http://localhost:3000");
});


// setup socket server
const { Server } = require("socket.io");
// start socket server on webserver
const io = new Server(server);
console.log(`socket server at ${io.path()}`);

// listen for new connections
io.on("connection", (socket) => {
  // log the id of each new client
  console.log(`👋 connect ${socket.id}`);

  // key for spacebar
  socket.on("key", (data) => {
    console.log(` ${socket.id} key`, data);
    // broadcast to other clients
    io.emit("key", data); 
  });

  // getting focused label from wheel 1
  socket.on("Wheel1", (focusedLabel1) => {
    console.log(` ${socket.id} Wheel1`, focusedLabel1);
    // broadcast to other clients
    io.emit("Wheel1", focusedLabel1); 
  });

  // local version of posEmotions array to determine colours of labels
  let posEmotions = ["Smile", "Glow", "Thrive", "Please", "Inspire", "Love", "Attract"];

  // getting focused label from wheel 2 + its colour code
  socket.on("Wheel2", (focusedLabel2) => {
    console.log(` ${socket.id} Wheel2`, focusedLabel2);
    // broadcast to other clients
    let colour = posEmotions.includes(focusedLabel2['focusedLabel2']) ? "#04cdf5" : "#ff0033";

    io.emit("Wheel2", { label: focusedLabel2, color: colour });
  });

});