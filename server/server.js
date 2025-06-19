const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentTemp = null;

app.use(bodyParser.json());
app.use(express.static("public")); // serve index.html

app.post("/temperature", (req, res) => {
  console.log(req.body)
  const { temp } = req.body;
  if (temp !== undefined) {
    console.log("Received temp:", temp);
    currentTemp = temp;
    io.emit("updateTemp", temp); // send to all connected clients
    res.sendStatus(200);
  } else {
    res.status(400).send("Invalid payload");
  }
});

io.on("connection", (socket) => {
  console.log("Web client connected");
  if (currentTemp !== null) {
    socket.emit("updateTemp", currentTemp);
  }
});

const PORT = 12345;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
