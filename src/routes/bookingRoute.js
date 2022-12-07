const express = require("express");
const {
  booking_user,
  select_types,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking/:id", booking_user);

bookingRoute.post("/add-type", select_types);
module.exports = bookingRoute;
