const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => console.log("Dashboard on http://localhost:3000"));
