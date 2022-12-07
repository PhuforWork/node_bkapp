const express = require("express");
const {
  getuser,
  loginUser,
  sigUp,
  updateUser,
  getUserId,
  update_img,
  change_pass,
  forgot_password,
} = require("../controllers/userController");
const upload = require("../Middlewares/upload");
const userRoute = express.Router();

// get all user
userRoute.get("/get-user", getuser);
// get user by id
userRoute.get("/get-user/:id", getUserId);
// post
// login
userRoute.post("/login",upload.fields(["user_name","_password"]), loginUser);
// register
userRoute.post("/sigup-user", upload.fields(["image_url","user_name","email","_password"]), sigUp);
// forgot_password
userRoute.post("/forgot-pass", upload.single("email"),forgot_password);
// change_pass
userRoute.post("/change-pass", upload.fields(["email","_password","confirm_password"]),change_pass);
// put
// update user
userRoute.put("/update-user/:id", upload.fields(["image_url","user_name","email","_password"]), updateUser);

userRoute.post("/upimg/:id", upload.single("image_url"), update_img);
// delete

module.exports = userRoute;
