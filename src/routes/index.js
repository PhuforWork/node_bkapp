const express = require("express");
const rootRoute = express.Router();
const userRoute = require("./userRoute");
const bookingRoute = require("./bookingRoute");

rootRoute.use("/user", userRoute);

rootRoute.use("/booking", bookingRoute);

module.exports = rootRoute;
