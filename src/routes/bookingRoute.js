const express = require("express");
const {
  booking_user,
  add_booking,
  booking_userid,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);

bookingRoute.get("/get-booking/:id", booking_userid);

bookingRoute.post("/add-booking/:id", upload.none(), add_booking);
module.exports = bookingRoute;
