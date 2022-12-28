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

app.get("/test", (req, res) => {
  let test = req.query;
  console.log(test);
  res.send("Hello");
});

app.use("/api", rootRoute);

httpServer.listen(8081);
