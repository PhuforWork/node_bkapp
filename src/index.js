const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const moment = require("moment");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
const { alarm_immediately } = require("./eventSocket/alarmSocket")(io);
const { chat_app } = require("./eventSocket/chatSocket")(io);

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
const addNewUser = async (user_name, socketId) => {
  if (user_name !== null) {
    !onlineUser.some((user) => user.user_name === user_name) &&
      onlineUser.push({ user_name, socketId });
    await console.log("test", onlineUser);
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (user_name) => {
  return onlineUser.find((user) => user.user_name === user_name);
};

io.on("connection", (socket) => {
  // add user
  chat_app(socket);
  io.emit("client-connect", socket.id);
  socket.on("newUser", async (user_name) => {
    await addNewUser(user_name, socket.id);
  });

  //send notification
  socket.on(
    "sendNotification",
    ({ senderName, receiverName, type, status, id_user, data }) => {
      const receiver = getUser(receiverName);
      const senderr = getUser(senderName);
      let today = new Date();
      if (receiver.socketId !== undefined) {
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          type,
          status,
          data,
          today,
        });
        alarm_immediately({
          senderName,
          status,
          id_user,
          start: data.res_bk.start,
          end: data.res_bk.end,
          department: data.res_der.label,
          personality: data.res_per,
          type: 2,
        });
      }
    }
  );
  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});

app.use("/api", rootRoute);

exports = { addNewUser, removeUser, getUser };
