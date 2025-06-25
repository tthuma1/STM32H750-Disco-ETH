const client = mqtt.connect("ws://localhost:9001", {
  username: "user1",
  password: "pass1"
}); // Mosquitto must enable WebSockets
console.log(client)

client.on("connect", () => {
  console.log("connected");
  client.subscribe("stm32/temp");
});

const ctx = document.getElementById("tempChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Temperature",
      data: [],
      borderColor: "red",
      fill: false
    }]
  }
});

client.on("message", (topic, message) => {
  console.log("received", message)
  const temp = parseFloat(message.toString());
  const time = new Date().toLocaleTimeString();
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(temp);
  chart.update();
});
