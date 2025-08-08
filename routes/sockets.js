var socketIo = require("socket.io");

exports.initialize = function (server) {
  io = socketIo(server);

  // Shared storage for user data
  const userSessions = new Map();

  const chatInfra = io.of("/chat_infra").on("connection", function (socket) {
    console.log(`Connected to chatInfra channel on socket ${socket.id}`);
    socket.on("set_name", function (data) {
      console.log("Received set_name Event...");

      // Store nickname directly on socket
      userSessions.set(socket.id, {
        nickname: data.name,
        joinTime: new Date(),
      });

      // Also store on this socket for this namespace
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

      // clean up on disconnect
      socket.on("disconnect", () => {
        userSessions.delete(socket.id);
      });
    });
  });

  const chatCom = io.of("/chat_com").on("connection", function (socket) {
    console.log(`Connected to chatCom channel on socket ${socket.id}`);
    socket.on("message", function (message) {
      console.log("Receiving Message on chatCom Channel...");
      //message = JSON.parse(message);
      if (message.type === "userMessage") {
        // Get nickname from shared storage
        const userData = userSessions.get(socket.id);
        const nickname = userData ? userData.nickname : "Anonymous";

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
        socket.emit("message", {
          ...clientMessage,
          type: "myMessage",
        });
      }
    });
    // clean up on disconnect
    socket.on("disconnect", () => {
      userSessions.delete(socket.id);
    });
  });
};
