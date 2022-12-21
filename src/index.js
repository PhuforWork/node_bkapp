const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
// const mysql = require("mysql2");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", () => {
  console.log("client connected");
});

app.use(express.json());
app.use(cors());
app.use(express.static("."));

app.listen(8081);

app.get("/test", (req, res) => {
  res.send("Hello");
});

app.use("/api", rootRoute);
