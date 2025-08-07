const chatInfra = io.connect("/chat_infra");
const chatCom = io.connect("/chat_com");

chatInfra.on("name_set", function (data) {
  $("#nameform").hide();
  $("#messages").append(
    '<div class="systemMessage">' + "Hello " + data.name + "</div"
  );
});

chatInfra.on("user_entered", function (user) {
  $("#messages").append(
    '<div class="systemMessage">' +
      user.name +
      " has joined the room." +
      "</div>"
  );
});

chatInfra.on("message", function (message) {
  $("#messages").append(
    '<div class="' + message.type + '">' + message.message + "</div>"
  );
});

chatCom.on("message", function (data) {
  console.log("Receiving User Message...");
  console.log(data);
  //data = JSON.parse(data);
  $("#messages").append(
    '<div class="' +
      data.type +
      '"><span class="name">' +
      data.username +
      ":</span> " +
      data.message +
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
    console.log("Sending Message over chatCom Channel...");
    chatCom.emit("message", data);
    $("#message").val("");
  });
  console.log("Initializing Set Name Handler...");
  $("#setname").click(function () {
    console.log("Emitting set_name Event...");
    chatInfra.emit("set_name", { name: $("#nickname").val() });
  });
});
