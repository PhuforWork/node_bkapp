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
  put_max_min,
} = require("../controllers/userController");
const upload = require("../Middlewares/upload");
const userRoute = express.Router();

// get all user
userRoute.get("/get-user", getuser);
// get user by id
userRoute.get("/get-user/:id", getUserId);
userRoute.get("/orther-user/:id", getUserId);
// post
// login
userRoute.post("/login", upload.none(), loginUser);
// register
userRoute.post("/sigup-user", upload.none(), sigUp);
// forgot_password
userRoute.post("/forgot-pass", upload.none(), forgot_password);
// change_pass
userRoute.post("/change-pass", upload.none(), change_pass);
// put
// update user
userRoute.put("/update-user/:id", upload.none(), updateUser);
userRoute.put("/maxmin-time/:id", upload.none(), put_max_min);

userRoute.put("/upimg/:id", upload.single("image_url"), update_img);
// delete

module.exports = userRoute;
