const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const fs = require("fs");
//Read all user
const getuser = async (req, res) => {
  let data = await model.users.findAll({ include: ["departments"] });
  res.send(data);
};
// Read user by id
const getUserId = async (req, res) => {
  let { id } = req.params;
  let data = await model.users.findOne({
    include: ["select_types", "persionalities", "departments"],
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
    _password,
    select_types,
    persionalities,
    departments,
  } = data;
  res.send({
    id_user,
    user_name,
    email,
    _password,
    select_types,
    persionalities,
    departments,
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
    let resdata = {
      id_user: checkUser.id_user,
      user_name: checkUser.user_name,
      // email: checkUser.email,
    };
    if (checkUser) {
      if (checkUser._password === _password) {
        successCode(res, resdata, "Login successfully");
      } else {
        failCode(res, "Login fail", "Password not correct");
      }
    } else {
      failCode(res, "Login fail", "User not correct");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// register
const sigUp = async (req, res) => {
  try {
    let { user_name, email, _password } = req.body;
    let data = { user_name, email, _password };
    let status = { status: "User name already used" };
    const checkUsername = await model.users.findOne({
      where: {
        user_name,
      },
    });
    if (checkUsername) {
      failCode(res, status, "User name already used");
    } else {
      await model.users.create(data);
      successCode(res, data, "Sig up successfully");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { user_name, email, _password } = req.body;
    // check data user
    console.log({ user_name, email, _password });
    let checkUser = model.users.findByPk(id);
    if (checkUser) {
      await model.users.update(
        { user_name, email, _password },
        { where: { id_user: id } }
      );
      successCode(res, { user_name, email, _password }, "Update successfully");
    } else {
      failCode(res, "", "Update failed");
    }
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
// testing not use for FE
const update_img = async (req, res) => {
  let { id } = req.params;
  // let checkUser = model.users.findByPk(id);
  console.log(process.cwd() + "/" + req.file.path);
  await fs.readFile(process.cwd() + "/" + req.file.path, async (err, data) => {
    let { image_url } = req.body;
    image_url = `data:${req.file.mimetype};base64,${Buffer.from(data).toString(
      "base64"
    )}`;
    fs.unlinkSync(process.cwd() + "/" + req.file.path);
    res.send(image_url);
    await model.users.update({ image_url }, { where: { id_user: id } });
    // successCode(res, image_url, "Update successfully");
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
    data_review = { email, _password };
    const check_email = await model.users.findOne({
      where: {
        email,
      },
    });
    if (check_email) {
      await model.users.update({ _password }, { where: { email: email } });
      const check_new_email = await model.users.findOne({
        where: {
          email,
        },
      });
      successCode(res, check_new_email, "Change password successfully");
    } else {
      failCode(res, "", "Change password failed");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const put_max = async (req, res) => {
  let { id } = req.params; // id user
  let { maxtime } = req.body;
  let data = { maxtime};
  await model.users.update(data, { where: { id_user: id } });
};
const put_min = async (req, res) => {
  let { id } = req.params; // id user
  let { mintime } = req.body;
  let data = { mintime};
  await model.users.update(data, { where: { id_user: id } });
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
};
