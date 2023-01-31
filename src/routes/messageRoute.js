const express = require("express");
const { get_contact_messs } = require("../controllers/messageController");
const upload = require("../Middlewares/upload");
const messRoute = express.Router();

messRoute.get("/get-contacts",get_contact_messs);

module.exports = messRoute