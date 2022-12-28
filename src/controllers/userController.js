const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const bcrypt = require("bcrypt");
const fs = require("fs");
//Read all user
const getuser = async (req, res) => {
  let data = await model.users.findAll({
    include: ["departments"],
    attributes: { exclude: ["_password", "email", "image_url"] },
  });
  res.send(data);
};
// Read user by id
const getUserId = async (req, res) => {
  let { id } = req.params;
  let data = await model.users.findOne({
    include: ["select_types", "persionalities", "departments"],
    attributes: { exclude: ["_password"] },
    where: {
      id_user: id,
    },
  });
  let data_booking = await model.booking_info.findAll({
    include: ["persionality_tbs", "department_tbs", "select_type_tbs"],
    where: { id_user: id },
    raw: false,
  });

  let data_guest = await model.guest_booking.findAll({
    include: ["service_guests"],
    where: { id_user: id },
  });

  let {
    id_user,
    user_name,
    email,
    select_types,
    persionalities,
    departments,
    image_url,
    maxtime,
    mintime,
    isShow,
  } = data;
  res.send({
    id_user,
    user_name,
    email,
    select_types,
    persionalities,
    departments,
    image_url,
    maxtime,
    mintime,
    isShow,
    data_booking,
    data_guest,
  });
};
// Login user
const loginUser = async (req, res) => {
  try {
    let { user_name, _password } = req.body;
    const checkUser = await model.users.findOne({
      where: {
        user_name,
      },
    });
    let data = { user_name: checkUser.user_name, id_user: checkUser.id_user };
    if (checkUser) {
      const checkpass = await bcrypt.compareSync(
        _password,
        checkUser._password
      );
      if (checkpass) {
        successCode(res, data, "Login successfully");
      } else {
        failCode(res, "Password not correct", "Password not correct");
      }
    } else {
      failCode(res, "Login fail", "Login fail");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// register
const sigUp = async (req, res) => {
  try {
    let { user_name, email, _password } = req.body;
    let data = {
      user_name,
      email,
      _password: bcrypt.hashSync(_password, 10),
      maxtime: 19,
      mintime: 9,
      isShow: false,
    };
    let status = { status: "User name already used" };
    const checkUsername = await model.users.findOne({
      where: {
        user_name,
      },
    });
    const checkEmail = await model.users.findOne({
      where: {
        email,
      },
    });
    if (checkUsername) {
      failCode(res, status, "Username already exists");
    } else if (checkEmail) {
      failCode(res, "Email already exists", "Email already exists");
    } else {
      await model.users.create(data);
      successCode(res, "Sig up successfully", "Sig up successfully");
    }
  } catch (error) {
    errorCode(res, "Error 500", "Error 500");
  }
};

const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { user_name, email, current_password, _password } = req.body;
    // check data user
    const checkUser = await model.users.findByPk(id);
    const checkpass = await bcrypt.compareSync(
      current_password,
      checkUser._password
    );
    if (checkpass) {
      await model.users.update(
        { user_name, email, _password },
        { where: { id_user: id } }
      );
      successCode(res, "Update successfully", "Update successfully");
    } else {
      failCode(
        res,
        "Current password does not match",
        "Current password does not match"
      );
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const update_isShow = async (req, res) => {
  try {
    let { id } = req.params;
    let { isShow } = req.body;
    if (isShow) {
      await model.users.update(isShow, { where: { id_user: id } });
      successCode(res, "", "Success skip");
    } else {
      failCode(res, "", "Fail skip");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// up img
const update_img = async (req, res) => {
  let { id } = req.params;
  console.log("id", id);
  await fs.readFile(process.cwd() + "/" + req.file.path, async (err, data) => {
    let { image_url } = req.body;
    image_url = `data:${req.file.mimetype};base64,${Buffer.from(data).toString(
      "base64"
    )}`;
    await model.users.update({ image_url }, { where: { id_user: id } });
    fs.unlinkSync(process.cwd() + "/" + req.file.path);
    successCode(res, image_url, "Update successfully");
  });
};

// forgot password
const forgot_password = async (req, res) => {
  try {
    let { email } = req.body;
    let status = { status: true };
    console.log({ email });
    const check_email = await model.users.findOne({
      where: {
        email,
      },
    });
    if (check_email) {
      successCode(res, { check_email, status }, "Check email successful");
    } else {
      failCode(res, "", "Email is not correct");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const change_pass = async (req, res) => {
  try {
    let { email, _password } = req.body;
    const check_email = await model.users.findOne({
      where: {
        email,
      },
    });
    if (check_email) {
      await model.users.update(
        { _password: bcrypt.hashSync(_password, 10) },
        { where: { email: email } }
      );
      successCode(res, "", "Change password successfully");
    } else {
      failCode(res, "", "Change password failed");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const put_max = async (req, res) => {
  let { id } = req.params; // id user
  let { maxtime } = req.query;
  let data = { maxtime };
  await model.users.update(data, { where: { id_user: id } });
  successCode(res, "", "Success");
};
const put_min = async (req, res) => {
  let { id } = req.params; // id user
  let { mintime } = req.query;
  let data = { mintime };
  await model.users.update(data, { where: { id_user: id } });
  successCode(res, "", "Success");
};

module.exports = {
  getuser,
  loginUser,
  sigUp,
  updateUser,
  getUserId,
  update_img,
  forgot_password,
  change_pass,
  put_max,
  put_min,
  update_isShow,
};
