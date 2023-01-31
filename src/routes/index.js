const express = require("express");
const rootRoute = express.Router();
const userRoute = require("./userRoute");
const bookingRoute = require("./bookingRoute");
const messRoute = require("./messageRoute");

rootRoute.use("/user", userRoute);

rootRoute.use("/booking", bookingRoute);

rootRoute.use("/message", messRoute);

module.exports = rootRoute;
