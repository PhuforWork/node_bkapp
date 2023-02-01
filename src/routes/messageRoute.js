const express = require("express");
const {
  get_contact_messs,
  send_mess,
  delete_mes,
  send_media,
  send_files,
  send_links,
  delete_media,
  delete_file
} = require("../controllers/messageController");
const upload = require("../Middlewares/upload");
const upload1 = require("../Middlewares/uploadMes");
const upload2 = require("../Middlewares/uploadFile");
const messRoute = express.Router();

messRoute.get("/get-contacts", get_contact_messs);

messRoute.post("/send-mess", upload.none(), send_mess);
messRoute.post("/send-images/:id", upload1.array("images"), send_media);
messRoute.post("/send-files/:id", upload2.array("files"), send_files);
messRoute.post("/send-links", upload.none(), send_links);

messRoute.delete("/delete-mess/:id", delete_mes);
messRoute.delete("/delete-media/:id", delete_media);
messRoute.delete("/delete-file/:id", delete_file);

module.exports = messRoute;
