const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const fs = require("fs");
const { log } = require("console");
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
  let checkUser = await model.users.findOne({
    where: {
      user_name,
    },
  });
  if (checkUser) {
    if ((checkUser._password = _password)) {
      successCode(res, checkUser, "Login successfully");
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
    const checkUsername = await model.users.findOne({
      where: {
        user_name,
      },
    });

    if (checkUsername) {
      failCode(res, "", "User name already used");
    } else {
      await fs.readFile(
        process.cwd() + "/" + req.file.path,
        async (err, data) => {
          image_url = `data:${req.file.mimetype};base64,${Buffer.from(
            data
          ).toString("base64")}`;
          fs.unlinkSync(process.cwd() + "/" + req.file.path);
          await model.users.create({ user_name, email, _password, image_url });
          successCode(
            res,
            { user_name, email, _password, image_url },
            "Sig up successfully"
          );
        }
      );
      // await model.users.create(dataUser);
      // successCode(res, "", "Sig up successfully");
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
    if (checkUser) {
      await fs.readFile(
        process.cwd() + "/" + req.file.path,
        async (err, data) => {
          image_url = `data:${req.file.mimetype};base64,${Buffer.from(
            data
          ).toString("base64")}`;
          fs.unlinkSync(process.cwd() + "/" + req.file.path);
          await model.users.update(
            { user_name, email, _password, image_url },
            { where: { id_user: id } }
          );
          successCode(
            res,
            { user_name, email, _password, image_url },
            "Update successfully"
          );
        }
      );
      // await model.users.update(update_User, { where: { id_user: id } });
      // successCode(res, update_User, "Update successfully");
    } else {
      failCode(res, "", "Update failed");
    }
  } catch (error) {
    errorCode(res, "Error 500");
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
  let data = { authentication: true };
  let { email } = req.body;
  let check_email = model.users.findOne({ where: { email: email } });
  if (check_email.email === email) {
    successCode(res, { check_email, data }, "Successful authentication");
  } else {
    failCode(res, "", "Email is not correct");
  }
};
const change_pass = async (req, res) => {
  let { email, _password, confirm_password } = req.body;
  let data = { _password };
  if (_password === confirm_password) {
    await model.users.update(data, { where: { email: email } });
    successCode(res, "", "Change password successfully");
  } else {
    errorCode(res, "", "Error 400");
  }
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
};
