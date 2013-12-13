function addMessage (msg, target) {
  var p = document.createElement("p");
  p.textContent = msg;
  target.insertBefore(p, target.firstChild);
};

function addImage (from, src, target) {
  var img = new Image();
  img.onload = function () {
    var p = document.createElement("p");
    p.textContent = from;
    target.insertBefore(img, target.firstChild);
    target.insertBefore(p, target.firstChild);
  };
  img.src = src;
};

function onSubmit (socket, type) {
  var myName = document.getElementById("myName").textContent;
  var input = document.getElementById("message_field");
  var target = document.getElementById("message_box");

  if (type === "text") {
    addMessage(myName + ": " + input.value, target);
  } else if (type === "image") {
    addImage(myName + ": ", input.value, target);
  }

  socket.send(JSON.stringify({
    type: type,
    from: myName,
    content: input.value
  }));

  input.value = null;
};

function onMessage (rawMessage) {
  console.log(rawMessage.data);

  try {
    var message = JSON.parse(rawMessage.data);
  } catch (error) {
    console.error(error);
    return;
  }

  var messageBox = document.getElementById("message_box");
  if (message.type === "text" && message.content.length < 40) {
    addMessage(message.from + ": " + message.content, messageBox);
  } else if (message.type === "image") {
    addImage(message.from + ":", message.content, messageBox);
  }
};

function onClose () {
  console.log("socket closed");
};

document.addEventListener("DOMContentLoaded", function () {
  var socket = new WebSocket("ws://172.22.131.203:3000");
  socket.onmessage = onMessage;
  socket.onclose = onClose;

  document.getElementById("message_submit")
          .addEventListener("click", function () {
            onSubmit(socket, "text");
          });

  document.getElementById("image_submit")
          .addEventListener("click", function () {
            onSubmit(socket, "image");
          });

  window.addEventListener("beforeunload", function () {
    socket.close();
  });
});

