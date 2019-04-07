const express = require("express");
const app = express();
app.use(express.static("dist"));
app.get("/obj", (req, res) =>
  res.sendFile("C:\\Users\\gridm\\Desktop\\gsoc\\task1\\Pix.obj")
);
app.listen(8090, () => console.log("Listening on port 8090!"));

module.exports = app;
