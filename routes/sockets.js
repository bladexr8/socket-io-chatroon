var socketIo = require("socket.io");

exports.initialize = function (server) {
  io = socketIo(server);
  io.sockets.on("connection", function (socket) {
    socket.send({
      type: "serverMessage",
      message: "Welcome to the Chat Room!",
    });
    socket.on("message", function (message) {
      //message = JSON.parse(message);
      if (message.type === "userMessage") {
        // send to all connected clients
        socket.broadcast.emit("message", message);
        // send to connecting client
        message.type = "myMessage";
        socket.emit("message", message);
      }
    });
  });
};
