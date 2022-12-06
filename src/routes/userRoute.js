const express = require("express");
const {
  getuser,
  loginUser,
  sigUp,
  updateUser,
  getUserId,
} = require("../controllers/userController");
const upload = require("../Middlewares/upload");
const userRoute = express.Router();

// get all user
userRoute.get("/get-user", getuser);
// get user by id
userRoute.get("/get-user/:id", getUserId);
// post
// login
userRoute.post("/login", loginUser);
// register
userRoute.post("/sigup-user",upload.single("upload"), sigUp);
// put
// update user
userRoute.put("/update-user/:id",upload.single("upload"), updateUser);
// delete

module.exports = userRoute;
