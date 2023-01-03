const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use(express.static("."));
httpServer.listen(8081);

app.get("/test", (req, res) => {
  let test = req.query;
  console.log(test);
  res.send("Hello");
});

io.on("connection", (socket) => {
  io.emit("user-connect", socket.id);

  // disconnect
  socket.on("disconnect", (reason) => {
    io.emit("user-disconnect", socket.id);
  });
});

app.use("/api", rootRoute);
