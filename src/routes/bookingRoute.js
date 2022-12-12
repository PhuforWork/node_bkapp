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
  get_department_slect,
  delete_bk,
} = require("../controllers/bookingController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);
bookingRoute.get("/get-booking/:id", booking_userid);
bookingRoute.get("/get-service/:id", get_department_slect);

bookingRoute.post("/add-booking/:id", upload.any(), add_booking);
bookingRoute.post("/add-depart/:id", upload.any(), add_depart);
bookingRoute.post("/add-select/:id", add_slect);

bookingRoute.put("/update-booking/:id", upload.none(), update_booking);
bookingRoute.put("/update-select/:id", upload.none(), update_slect);
bookingRoute.put("/update-department/:id", upload.none(), update_depart);

bookingRoute.delete("delete-booking/:id", delete_bk);
module.exports = bookingRoute;
