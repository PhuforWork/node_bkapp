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

let onlineUser = [];
const addNewUser = (user_name, socketId) => {
  !onlineUser.some((user) => user.user_name === user_name) &&
    onlineUser.push({ user_name, socketId });
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (user_name) => {
  return onlineUser.find((user) => user.user_name === user_name);
};

io.on("connection", (socket) => {
  // add user
  io.emit("client-connect",socket.id);
  socket.on("newUser", (user_name) => {
    addNewUser(user_name, socket.id);
  });

  //send notification
  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});

app.use("/api", rootRoute);
