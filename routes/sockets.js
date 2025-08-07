var socketIo = require("socket.io");

exports.initialize = function (server) {
  io = socketIo(server);

  const chatInfra = io.of("/chat_infra").on("connection", function (socket) {
    socket.on("set_name", function (data) {
      console.log("Received set_name Event...");

      // Store nickname directly on socket
      socket.data.nickname = data.name;

      // emit confirmation
      socket.emit("name_set", data);

      // Send welcome message using emit instead of send
      socket.emit("message", {
        type: "serverMessage",
        message: "Welcome to the Chat Room!",
      });

      // broadcase user entry into chat
      socket.broadcast.emit("user_entered", data);
    });
  });

  const chatCom = io.of("/chat_com").on("connection", function (socket) {
    socket.on("message", function (message) {
      console.log("Receiving Message on chatCom Channel...");
      //message = JSON.parse(message);
      if (message.type === "userMessage") {
        // Get nickname directly from socket data
        const nickname = socket.data.nickname;
        message.username = nickname;

        const clientMessage = {
          type: message.type,
          username: nickname,
          message: message.message,
        };

        console.log(
          "Sending Message to Client...",
          JSON.stringify(clientMessage)
        );

        // Send to all connected clients except sender
        socket.broadcast.emit("message", clientMessage);

        // Send to connecting client (sender) with modified type
        message.type = "myMessage";
        socket.emit("message", clientMessage);
      }
    });
  });
};
