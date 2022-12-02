const express = require("express");
const { getuser } = require("../controllers/userController");
const userRoute = express.Router();

// get
userRoute.get("/get-user", getuser);
// post
// put
// delete

module.exports = userRoute;
