const express = require("express");
const {
  booking_user,
  add_booking,
  booking_userid,
  add_type,
  add_persionality,
  update_booking,
  update_persion,
  update_slect,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);
bookingRoute.get("/get-booking/:id", booking_userid);

bookingRoute.post("/add-booking/:id", upload.none(), add_booking);
bookingRoute.post("/add-type/:id", upload.any(), add_type);
bookingRoute.post("/add-persionality/:id", upload.none(), add_persionality);

bookingRoute.put("/update-booking/:id", upload.none(), update_booking);
bookingRoute.put("/update-select/:id", upload.none(), update_slect);
bookingRoute.put("/update-persional/:id", upload.none(), update_persion);

module.exports = bookingRoute;
