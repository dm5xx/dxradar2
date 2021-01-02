let socket = new WebSocket("wss://spots.dxheat.com/socket.io/?transport=websocket");

socket.onopen = function(e) {
  alert("[open] Connection established");
};

socket.onmessage = function(event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error] ${error.message}`);
};



function connect_socket() {
    socket = new WebSocket(ws_url);
    socket.on("close", connect_socket); // <- rise from your grave!
    heartbeat();
  }
  
  function heartbeat() {
    if (!socket) return;
    if (socket.readyState !== 1) return;
    socket.send("heartbeat");
    setTimeout(heartbeat, 500);
  }


//   fetch('file://D|/test.html', {mode: 'no-cors'})
//     .then(r => r.text())
//     .then(console.log);