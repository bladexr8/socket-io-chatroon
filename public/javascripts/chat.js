var socket = io.connect("/");

socket.on("message", function (data) {
  //data = JSON.parse(data);
  if (data.username) {
    $("#messages").append(
      '<div class="' +
        data.type +
        '"><span class="name">' +
        data.username +
        ":</span> " +
        data.message +
        "</div>"
    );
  } else {
    $("#messages").append(
      '<div class="' + data.type + '">' + data.message + "</div>"
    );
  }
});

socket.on("name_set", function (data) {
  $("#nameform").hide();
  $("#messages").append(
    '<div class="systemMessage">' + "Hello " + data.name + "</div"
  );
});

socket.on("user_entered", function (user) {
  $("#messages").append(
    '<div class="systemMessage">' +
      user.name +
      " has joined the room." +
      "</div>"
  );
});

$(function () {
  console.log("Initializing Send Button Handler...");
  $("#send").click(function () {
    var data = {
      message: $("#message").val(),
      type: "userMessage",
    };
    socket.emit("message", data);
    $("#message").val("");
  });
  console.log("Initializing Set Name Handler...");
  $("#setname").click(function () {
    console.log("Emitting set_name Event...");
    socket.emit("set_name", { name: $("#nickname").val() });
  });
});
