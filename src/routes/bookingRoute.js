const express = require("express");
const {
  booking_user,
  add_booking,
  booking_userid,
  add_depart,
  add_slect,
  update_booking,
  update_depart,
  update_slect,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);
bookingRoute.get("/get-booking/:id", booking_userid);

bookingRoute.post("/add-booking/:id", upload.none(), add_booking);
bookingRoute.post("/add-depart/:id", upload.any(), add_depart);
bookingRoute.post("/add-select/:id", upload.any(), add_slect);

bookingRoute.put("/update-booking/:id", upload.none(), update_booking);
bookingRoute.put("/update-select/:id", upload.none(), update_slect);
bookingRoute.put("/update-department/:id", upload.none(), update_depart);

module.exports = bookingRoute;
