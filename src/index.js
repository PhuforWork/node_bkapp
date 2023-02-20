const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const moment = require("moment");
const https = require('https');

const sequelize = require("./models/index");
const init_models = require("./models/init-models");
const model = init_models(sequelize);

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
const { alarm_immediately } = require("./eventSocket/alarmSocket")(io);
const { chat_app } = require("./eventSocket/chatSocket")(io);
const fs = require('fs');

app.use(express.json());
app.use(cors());
app.use(express.static("."));

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

https.createServer(options, function (req, res) {
  res.end('secure!');
}).listen(443);

// Redirect from http port 80 to https
const http = require('http');
http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8081);

// httpServer.listen(8081);

app.get("/test", async (req, res) => {
  let Data = await model.messages.findAll({ include: ["id_user_receive_mess_receive", "id_user_send_mess_send"] });
  res.status(200).send(Data);
});

let onlineUser = [];
const addNewUser = async (user_name, id_user, socketId, isNotify) => {
  if (user_name !== null) {
    !onlineUser.some((user) => user.user_name === user_name) &&
      onlineUser.push({ user_name, id_user, socketId, isNotify });
    await console.log("online user", onlineUser);
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

// const getUser = (id_user_receive) => {
//   return onlineUser.find((ele) => {
//     ele.user_name === "liam97";
//   });
// };

io.on("connection", (socket) => {
  // add user
  io.emit("client-connect", socket.id);
  socket.on("newUser", async (data) => {
    if (data.user_name) {
      await addNewUser(data.user_name, data.id_user, socket.id, data.isNotify);
      alarm_immediately();
    }
  });
  //send notification
  socket.on(
    "sendNotification",
    async ({ senderName, receiverName, type, status, id_user, data }) => {
      // const receiver = getUser(receiverName);
      await io.emit("getNotification", { type, id_user, data });
      await alarm_immediately(type, id_user, data);
      await io.emit("getNotification", { type, id_user, data });
    }
  );
  //

  socket.on("sendMessage", async ({ id_user_receive, msg }) => {
    console.log("2", onlineUser);
    let onlineUserNew = [...onlineUser];
    onlineUserNew.map(async (ele) => {
      if (ele.id_user === id_user_receive) {
        await io.to(ele.socketId).emit("getMessage", msg);
        // await chat_app();
      }
    });
  });
  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});
alarm_immediately();
app.use("/api", rootRoute);

exports = { addNewUser, removeUser };
