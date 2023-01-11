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
  update_persional,
  delete_bk,
  get_depart,
  get_persional_id,
  notification,
  update_dpt_new,

} = require("../controllers/bookingController");
const { guest_booking } = require("../controllers/guestController");
const upload = require("../Middlewares/upload");
const bookingRoute = express.Router();

bookingRoute.get("/get-booking", booking_user);
bookingRoute.get("/get-booking/:id", booking_userid);
bookingRoute.get("/get-service/:id", get_department_slect);
bookingRoute.get("/get-department", get_depart);
bookingRoute.get("/get-personality/:id", get_persional_id);

bookingRoute.post("/add-booking/:id", upload.any(), add_booking);
bookingRoute.post("/add-depart/:id", upload.any(), add_depart);
bookingRoute.post("/add-select/:id", add_slect);
bookingRoute.post("/notification-socket/:id", upload.none(), notification);

bookingRoute.put("/update-booking/:id", upload.none(), update_booking);
bookingRoute.put("/update-select/:id", upload.none(), update_slect);
bookingRoute.put("/update-department/:id", upload.none(), update_depart);
bookingRoute.put("/update-department-new/:id", upload.none(), update_dpt_new);
bookingRoute.put("/update-persional/:id", upload.none(), update_persional);


bookingRoute.post("/add-guest/:id", upload.none(), guest_booking);

bookingRoute.delete("/delete-booking/:id", delete_bk);module.exports = bookingRoute;
