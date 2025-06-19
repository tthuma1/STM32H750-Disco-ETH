const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const req = data.toString();
    console.log("Raw request:\n", req);

    const jsonStart = req.indexOf("{");
    const jsonEnd = req.indexOf("}") + 1;
    const jsonString = req.substring(jsonStart, jsonEnd);

    try {
      const json = JSON.parse(jsonString);
      console.log("Parsed JSON:", json);
      // You can emit this via WebSocket or update a UI
    } catch (err) {
      console.error("JSON parse error:", err.message);
    }

    // Send a basic HTTP response
    socket.write(
      "HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK"
    );
  });
});

server.listen(12345, () => {
  console.log("Raw TCP server listening on port 12345");
});
