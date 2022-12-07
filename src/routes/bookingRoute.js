const express = require("express");
const {
  booking_user,
  add_booking,
  booking_userid,
  add_type,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);

bookingRoute.get("/get-booking/:id", booking_userid);

bookingRoute.post("/add-booking/:id", upload.none(), add_booking);
bookingRoute.post("/add-type/:id", upload.none(), add_type);

module.exports = bookingRoute;
