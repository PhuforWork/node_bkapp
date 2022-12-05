const express = require("express");
const {
  getuser,
  loginUser,
  sigUp,
  updateUser,
  getUserId,
} = require("../controllers/userController");
const userRoute = express.Router();

// get all user
userRoute.get("/get-user", getuser);
// get user by id
userRoute.get("/get-user/:id", getUserId);
// post
// login
userRoute.post("/login-user", loginUser);
// register
userRoute.post("/sig-up-user", sigUp);
// put
// update user
userRoute.put("/update-user", updateUser);
// delete

module.exports = userRoute;
