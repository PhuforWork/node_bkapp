const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const moment = require("moment");

const sequelize = require("./models/index");
const init_models = require("./models/init-models");
const model = init_models(sequelize);

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
const { alarm_immediately } = require("./eventSocket/alarmSocket")(io);
const { chat_app } = require("./eventSocket/chatSocket")(io);

app.use(express.json());
app.use(cors());
app.use(express.static("."));

httpServer.listen(8081);

app.get("/test", async (req, res) => {
  let test = req.query;
  let Data = await model.notifications.findAll();

  res.send(Data);
});

let onlineUser = [];
const addNewUser = async (user_name, socketId, isNotify) => {
  if (user_name !== null) {
    !onlineUser.some((user) => user.user_name === user_name) &&
      onlineUser.push({ user_name, socketId, isNotify });
    await console.log("online user", onlineUser);
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (user_name) => {
  return onlineUser.find((user) => user.user_name === user_name);
};

io.on("connection", (socket) => {
  // alarm_immediately();
  // add user
  chat_app(socket);
  io.emit("client-connect", socket.id);
  socket.on("newUser", async (data) => {
    if (data.user_name) {
      await addNewUser(data.user_name, data.id_user, socket.id, data.isNotify);
      // alarm_immediately();
    }
  });
  //send notification
  socket.on(
    "sendNotification",
    async ({ senderName, receiverName, type, status, id_user, data }) => {
      const receiver = getUser(receiverName);
      await io.emit("getNotification");
      await alarm_immediately();
      await io.emit("getNotification");
    }
  );
  //
  socket.on(
    "sendMessage",
    async ({ id_user_receive, msg }) => {
      const receiver = getUser(id_user_receive);
      await io.to(receiver.socketId).emit("getMessage",msg);
      await chat_app();
    }
  );
  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});
alarm_immediately();
app.use("/api", rootRoute);

exports = { addNewUser, removeUser, getUser };
