const express = require("express");
const {
  get_contact_messs,
  get_all_contact,
  send_mess,
  delete_mes,
  send_media,
  delete_media,
  delete_file,
  delete_links,
  set_status_mes,
} = require("../controllers/messageController");
const upload = require("../Middlewares/upload");
const upload1 = require("../Middlewares/uploadMes");
// const upload2 = require("../Middlewares/uploadFile");
const messRoute = express.Router();

messRoute.get("/get-contacts-all/:id_send", get_all_contact);
messRoute.get("/get-contacts/:id_send/:id_receive", get_contact_messs);

messRoute.post("/send-mess/:id", upload.none(), send_mess);
messRoute.post("/send-media/:id", upload1.any(), send_media);
// messRoute.post("/send-files/:id", upload2.array("files"), send_files);
// messRoute.post("/send-links/:id", upload.none(), send_links);

messRoute.put("/send-status/:id", upload.none(), set_status_mes);

messRoute.delete("/delete-mess/:id", delete_mes);
messRoute.delete("/delete-media/:id", delete_media);
messRoute.delete("/delete-file/:id", delete_file);
messRoute.delete("/delete-links/:id", delete_links);

module.exports = messRoute;
