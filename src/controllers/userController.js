const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../utils/respone");
const model = init_models(sequelize);

//Read all user
const getuser = async (req, res) => {
  let data = await model.users.findAll();
  res.send(data);
};
// Read user by id
const getUserId = async (req, res) => {
  let { id } = req.params;
  let data = await model.users.findByPk(id);
  res.send(data);
};
// Login user
const loginUser = async (req, res) => {
  let { user_name, _password } = req.body;
  const checkUser = await model.users.findOne({
    where: {
      user_name,
    },
  });
  if (checkUser) {
    if ((checkUser._password = _password)) {
      successCode(res, "", "Login successfully");
    } else {
      failCode(res, "", "User not correct");
    }
  } else {
    errorCode(res, "", "Login fail");
  }
};
// register
const sigUp = async (req, res) => {
  try {
    let { user_name, email, _password, image_url } = req.body;
    let data = { user_name, email, _password, image_url };
    const checkUsername = await model.users.findOne({
      where: {
        user_name,
      },
    });
    if (checkUsername) {
      failCode(res, "", "User name already used");
    } else {
      await model.users.create(data);
      successCode(res, "", "Sig up successfully");
    }
  } catch (error) {
    errorCode(res, "Sig up failed");
  }
};

const updateUser = async (req, res) => {
  try {
    let { id } = req.params;
    let { user_name, email, _password, image_url } = req.body;
    // check data user
    let checkUser = model.users.findByPk(id);
    let update_User = {
      user_name,
      email,
      _password,
      image_url,
    };
    if (checkUser) {
      await model.users.update(update_User, { where: { id_user: id } });
      successCode(res, update_User, "Update successfully");
    } else {
      failCode(res, "", "Update failed");
    }
  } catch (error) {
    errorCode(res, "Error 500");
  }
};
module.exports = { getuser, loginUser, sigUp, updateUser, getUserId };
