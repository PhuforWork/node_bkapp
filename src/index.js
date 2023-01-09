const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const {
  notification,
  alarm_immediately,
} = require("./controllers/userController");
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
      console.log(data);
      let today = new Date();
      if (receiver.socketId !== undefined) {
        io.to(receiver.socketId).emit("getNotification", {
          senderName,
          type,
          status,
          data,
          today,
        });
        notification({
          senderName,
          status,
          id_user,
          start: data.res_bk.start,
          end: data.res_bk.end,
          department: data.res_der.label,
          personality: data.res_per,
          today,
          type,
        });
        alarm_immediately({
          date: data.res_bk.start,
          utcOffset: data.res_bk.utcOffset,
        });
      } else {
        io.to(senderr.socketId).emit("getNotification", {
          senderName,
          type,
          status,
          data,
          today,
        });
        notification({
          senderName,
          status,
          id_user,
          start: data.res_bk.start,
          end: data.res_bk.end,
          department: data.res_der.label,
          personality: data.res_per,
          today,
          type,
        });
        alarm_immediately({
          date: data.res_bk.start,
          utcOffset: data.res_bk.utcOffset,
        });
        let datetimeLocal = moment(data.res_bk.start).utcOffset(
          `${data.res_bk.utcOffset}`
        );
        let DD = datetimeLocal.date();
        let MM = datetimeLocal.month() + 1;
        let hh = datetimeLocal.hours();
        let mm = datetimeLocal.minutes();
        let YYYY = datetimeLocal.year();
        let ss = datetimeLocal.seconds();
      }
    }
  );

  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});

const test = () => {
  cron.schedule("* 19 15 9 1 *", () => {
    console.log("testoooooo", 12341);
  });
};
test();
app.use("/api", rootRoute);
