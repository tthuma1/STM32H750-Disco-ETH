const net = require("net");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

let latestTemp = null;
let buttonPressed = null;

// 🌐 Express + HTTP + Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // serve HTML file

io.on("connection", (socket) => {
  console.log("Browser connected");

  // Send current temp on connect
  if (latestTemp !== null) {
    socket.emit("tempUpdate", latestTemp);
  }

  if (buttonPressed !== null) {
    socket.emit("buttonPressed", buttonPressed);
  }
});

// 🌡️ Raw TCP server for STM32
const tcpServer = net.createServer((socket) => {
  socket.on("data", (data) => {
    const req = data.toString();
    const jsonStart = req.indexOf("{");
    const jsonEnd = req.indexOf("}") + 1;
    const jsonString = req.substring(jsonStart, jsonEnd);

    try {
      const json = JSON.parse(jsonString);
      latestTemp = json.temp;
      buttonPressed = json.button_pressed;
      console.log("Parsed Temp:", latestTemp, "\tButton Pressed:", buttonPressed);

      // Emit live update to browser
      io.emit("tempUpdate", latestTemp);
      io.emit("buttonPressed", buttonPressed);
    } catch (err) {
      console.error("JSON parse error:", err.message);
    }

    socket.write("HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK");
  });
});

tcpServer.listen(12345, () => {
  console.log("TCP server listening on port 12345 (STM32)");
});

server.listen(3001, () => {
  console.log("Web server + socket.io running at http://localhost:3001");
});
