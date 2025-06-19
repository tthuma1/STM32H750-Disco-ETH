// Complete file: server.js
const net = require("net");
const express = require("express");

let latestTemp = null;

// Raw TCP server for STM32
const tcpServer = net.createServer((socket) => {
  socket.on("data", (data) => {
    const req = data.toString();
    const jsonStart = req.indexOf("{");
    const jsonEnd = req.indexOf("}") + 1;
    const jsonString = req.substring(jsonStart, jsonEnd);

    try {
      const json = JSON.parse(jsonString);
      latestTemp = json.temp;
      console.log("Parsed Temp:", latestTemp);
    } catch (err) {
      console.error("JSON parse error:", err.message);
    }

    socket.write("HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK");
  });
});

tcpServer.listen(12345, () => {
  console.log("TCP Server (STM32) running on port 12345");
});

// Express server for browser
const app = express();
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>STM32 Temp</title></head>
      <body style="font-family:sans-serif;text-align:center;margin-top:100px;">
        <h1>STM32 Temperature</h1>
        <div style="font-size:3em;color:#2a9d8f;">
          ${latestTemp !== null ? latestTemp + " °C" : "--"}
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Web interface running at http://localhost:3000");
});
