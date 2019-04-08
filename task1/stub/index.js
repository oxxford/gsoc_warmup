const express = require("express");
const app = express();
const path = require('path');

app.use(express.static("dist"));
app.get("/obj", (req, res) =>
  res.sendFile(path.join(__dirname, "../Pix.obj"))
);
app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
