const express = require("express");
const cors = require("cors");
const rootRoute = require("../src/routes/index");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const moment = require("moment");
const tls = require('tls');
const https = require('https');

const sequelize = require("./models/index");
const init_models = require("./models/init-models");
const model = init_models(sequelize);

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, { cors: { origin: "*" } });
const { alarm_immediately } = require("./eventSocket/alarmSocket")(io);
const { chat_app } = require("./eventSocket/chatSocket")(io);

const secureContext = tls.createSecureContext()

const optionSSL = {
  key: fs.readSync(`-----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEAli/WCaZv8x0boUosxYlTJMxUiJQY1pmP3O5dPgGDadjF7v2G
  bFNb8E+HwNiP1obHq1Ufs0McLN4EN4V0kXFrMk+WH3f8RVcQmafmRozAK4ZnA22e
  mOp7CsjmTjBSV4QeTfGyaxtmZsCP/3IEBg296CQJxs2ydv5c/Cm84XNpqJv5HkS+
  vCjSU8Pho+GEvIIkp6YulEhSaj4/lODyRbMO46q5kznJ3qF3NAd+rXR+HPHtZf0A
  z7m0yUVixb4tmeGHVyQ7SlFx7F28P6Ylx3RRIgLcmVmpdoVJisVL4/TTio4Sj8lC
  rp+Bpv8zRo6UlA5pHrY7Ztxkqrbjrt7CBPNIGQIDAQABAoIBABFsXUVjVKt8nf75
  LvZ/tvCW79ukarlCuWjlElYmMMuvxU6zhMu+Y/UeFN6vgQhfPHzI9FOEnpkp7I1Q
  YzSYVtpQV1cxQUf+EMPysYlPvN+PyRWhuvt8gGfA5M7/Vh4nCqj6ODuqwxd6kXoO
  DR9yqqxqueOha2nYmor6gJobHI/d0Xw/nqfXHpyF2JMRvv+O1njfeF8UT29HlIkM
  MkBWrUXipFNRaF7epULraE+lH8O2jRGdaLP9KdBoJch4E6QCVZpjLCeNBmqvegbK
  5Tv4/TR6Pc7HCNWCym6FbaVUq+lFl0VBBqxWWvMPSBohoRi142kCB9+vqk/vf/VI
  eKJnMu0CgYEA+9bCnHMmtw44/GBi3gkxll1iMvQ+HZ6YafnIN4B1Wz/SbZrvm52q
  jRcMOQULemSUCiQPyz2JQJtVHnPA2tGcWmtQAmjS8Cc9IaAcSZw8S1ogp5qs/eWA
  Js+AH88HwfkENSN2SJLVqKPw/DSTk0F2r49d0/e/Ipfd2nZGgmHIwaMCgYEAmKsa
  duJ846ArVY8b28FtpX/FRWEv3d75cg2wEf5qqlyRAiGDD7R0iUpQUSvqBxe+70W/
  vikbWUp1h6zOAxSRwZZydQ9hr4newN1Ci0u0KUm0IrX7+nBn07qimnaPn6lk8X8J
  ASIvWxo2nWHbYWhyE6IVzpPdYmlA8rPZeNCYAxMCgYEAhButrTpuxbpNRH8ffhBe
  ld1Y5Rfg+dK3a2hfklXtujdpoJuVNBHqZOcBP2wZEFRwoD04l8opFN4nMblRIriw
  h3Ih35Gzjc1XsSr3i9nMe07FMIbgVrQsnK9fK9CD5kpF3cZDh2CXeka95N+Dxsyh
  gQj5FHezKWd3NuGyrTS0hncCgYAqdRtNCLvWygqDJuOGgAqwRhJksxyOxZ31vBzF
  RE4BxvCE+TDrwzHNpJ8lk+LnyhDNlkY26lOyx2RcMRCyBpxqjB6Us4xlNyB93orN
  FmaqPNcd+CJ1iaE2Xuctsd9Ldd6e0sd8SzeETIv3xOkv884V67PI2ZJt9fucA6xt
  TwWXhQKBgAvzSWfA18YvFYtcKhRberkRTKN0d9dArFCFGvw/Xu3xCEtDFMHd/yCa
  EsgSUEO1WVUAaMgtT0qkHSp0bpmFtYMqMef3niPmhx7ahq3sFArjksvYTwnGcNTM
  N9/lpIPFTA1tpIuo7HyQscdAdMXyHEXg97HPOlkcz86fHFy7AlYr
  -----END RSA PRIVATE KEY-----`),
  cert: fs.readSync(`-----BEGIN CERTIFICATE-----
  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
  zQnta5Ce+ScZqqaYevUL7mSsio2uoV+uwFiiTEM=
  -----END CERTIFICATE-----`)
};

app.use(express.json());
app.use(cors(options));
app.use(express.static("."));
https.createServer(optionSSL, app).listen(443, '110.35.173.82');

// httpServer.listen(8081);

app.get("/test", async (req, res) => {
  let Data = await model.content_message.findAll();
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
