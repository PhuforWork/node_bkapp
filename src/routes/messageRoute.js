const express = require("express");
const {
  get_contact_messs,
  send_mess,
  delete_mes,
  send_media,
  send_files,
  send_links,
} = require("../controllers/messageController");
const upload = require("../Middlewares/upload");
const upload1 = require("../Middlewares/uploadMes");
const upload2 = require("../Middlewares/uploadFile");
const messRoute = express.Router();

messRoute.get("/get-contacts", get_contact_messs);

messRoute.post("/send-mess", upload.none(), send_mess);
messRoute.post("/send-files", upload2.single("file"), send_files);
messRoute.post("/send-images", upload1.array("images"), send_media);
messRoute.post("/send-links", upload.none(), send_links);

messRoute.delete("/send-mess", delete_mes);
module.exports = messRoute;
