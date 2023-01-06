const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { notification } = require("./controllers/userController");
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use(express.static("."));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
  socket.on("newUser", (user_name) => {
    addNewUser(user_name, socket.id);
  });

  //send notification
  socket.on(
    "sendNotification",
    ({ senderName, receiverName, type, status, id_user, data }) => {
      const receiver = getUser(receiverName);
      console.log(data);
      let today = new Date();
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
        start: data.start,
        end: data.end,
        department: data.department_tbs,
        personality: data.persionality_tbs,
        today,
      });
    }
  );
  // socket.on("sendNotification", (data) => {
  //   socket.emit("getNotification", data);
  // });

  // disconnect
  socket.on("disconnect", (reason) => {
    removeUser(socket.id);
  });
});

app.use("/api", rootRoute);
