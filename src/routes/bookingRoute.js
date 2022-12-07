const express = require("express");
const { booking_user } = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking/:id",booking_user);

module.exports = bookingRoute;