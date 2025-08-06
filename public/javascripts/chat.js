var socket = io.connect("/");

socket.on("message", function (data) {
  //data = JSON.parse(data);
  $("#messages").append(
    '<div class="' + data.type + '">' + data.message + "</div>"
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
});
