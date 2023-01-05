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
  put_max,
  put_min,
  update_isShow,
  update_img_test,
  test_send_email,
  get_search_user,
  note_post,
  note_put,
  note_detele,
  note_get_id,
  update_row,
  notification_update,
  notification_delete,
  notification_get
} = require("../controllers/userController");
const upload = require("../Middlewares/upload");
const userRoute = express.Router();

// get all user
userRoute.get("/get-user", getuser);
// get user by id
userRoute.get("/get-user/:id", getUserId);
userRoute.get("/orther-user/:id", getUserId);
userRoute.get("/search-department", get_search_user);
userRoute.get("/get-note/:id", note_get_id);
userRoute.get("/get-notify/:id", notification_get);
// post
// login
userRoute.post("/login", upload.none(), loginUser);
// register
userRoute.post("/sigup-user", upload.none(), sigUp);
// forgot_password
userRoute.post("/forgot-pass", upload.none(), forgot_password);
// change_pass
userRoute.post("/change-pass", upload.none(), change_pass);
userRoute.post("/test-send-email", upload.none(), test_send_email);
userRoute.post("/create-note", upload.none(), note_post);
// put
// update user
userRoute.put("/update-user/:id", upload.none(), updateUser);
userRoute.put("/max-time/:id", put_max);
userRoute.put("/min-time/:id", put_min);
userRoute.put("/skip-show/:id", update_isShow);

userRoute.put("/upimg/:id", upload.single("image_url"), update_img);
userRoute.put("/upimg-test/:id", upload.single("image_url"), update_img_test);
userRoute.put("/update-note/:id", upload.none(), note_put);
userRoute.put("/update-row/:id", upload.none(), update_row);
userRoute.put("/notification-update/:id", upload.none(), notification_update);
// delete
userRoute.delete("/delete-note/:id", upload.none(), note_detele);
userRoute.delete("/delete-notify/:id", upload.none(), notification_delete);

module.exports = userRoute;
