const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const compress_images = require("compress-images");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { verify } = require("crypto");
//Read all user
const getuser = async (req, res) => {
  try {
    let data = await model.users.findAll({
      include: ["departments"],
      attributes: { exclude: ["_password", "email", "image_url"] },
    });
    // res.send(data);
    successCode(res, data, "Get Success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
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
  successCode(
    res,
    {
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
    },
    "Success"
  );
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
    const checkpass = await bcrypt.compareSync(_password, checkUser._password);
    if (checkpass) {
      successCode(res, data, "Login successfully");
    } else {
      failCode(res, { code: 001 }, "Password not correct");
    }
  } catch (error) {
    failCode(res, { code: 002 }, "User not correct");
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
      failCode(res, { code: 003 }, "Username already exists");
    } else if (checkEmail) {
      failCode(res, { code: 004 }, "Email already exists");
    } else {
      await model.users.create(data);
      successCode(res, "Sig up successfully", "Sig up successfully");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
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
      failCode(res, { code: 005 }, "Current password does not match");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const update_isShow = async (req, res) => {
  try {
    let { id } = req.params;
    let { isShow } = req.body;
    console.log("show", isShow);
    if (isShow) {
      await model.users.update({ isShow }, { where: { id_user: id } });
      successCode(res, "", "Success skip");
    } else {
      failCode(res, { code: 006 }, "Fail skip");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// up img
const update_img = async (req, res) => {
  try {
    let { id } = req.params;
    fs.readFile(process.cwd() + "/" + req.file.path, async (err, data) => {
      let image_url = `data:${req.file.mimetype};base64,${Buffer.from(
        data
      ).toString("base64")}`;
      await model.users.update(
        { image_url: image_url },
        { where: { id_user: id } }
      );
      fs.unlinkSync(process.cwd() + "/" + req.file.path);
      successCode(res, "", "Update successfully");
    });
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const update_img_test = async (req, res) => {
  const result = await compress_images(
    `${process.cwd()}/public/img_compress/${req.file.filename}`,
    `./public/img/`,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "25"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
    },
    function (error, completed, statistic) {
      if (completed) {
        fs.unlinkSync(statistic.input);
        res.send(statistic.path_out_new);
      }
    }
  );
  console.log(result);
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
      failCode(res, { code: 007 }, "Email is not correct");
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
      failCode(res, { code: 010 }, "Email is not correct");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const put_max = async (req, res) => {
  try {
    let { id } = req.params; // id user
    let { maxtime } = req.query;
    let data = { maxtime };
    await model.users.update(data, { where: { id_user: id } });
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const put_min = async (req, res) => {
  try {
    let { id } = req.params; // id user
    let { mintime } = req.query;
    let data = { mintime };
    await model.users.update(data, { where: { id_user: id } });
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const test_send_email = async (req, res) => {
  let { email } = req.body;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.email",
    port: 465, //587
    secure: true, // true for 465, false for other ports
    auth: {
      user: "miniuadm@gmail.com", // generated ethereal user
      pass: "qezhngzzqpgdzpia", // generated ethereal password
    },
  });
  const msg = {
    from: "miniuadm@gmail.com", // sender address
    to: `${email}`, // list of receivers
    subject: "Verify password ✔", // Subject line
    text: "Link here?", // plain text body
    html: `
    <div>
    Hello
    <a href="${
      process.env.APP_URL
    }/verify?email=${email}&token=${bcrypt.hashSync(email, 10)}}">Link</a>
    </div>
    `, // html body
  };
  // send mail with defined transport object
  // const info = await transporter.sendMail(msg);
  await transporter.sendMail(msg, (err) => {
    if (err) {
      console.log("it has error", err);
    } else {
      console.log("email send");
    }
  });
  successCode(res, "", "Success");
};

const verify_mail = async (req, res) => {
  let verifies = bcrypt.compare(
    req.query.email,
    req.query.token,
    (err, result) => {
      if (!err) {
        res.redirect(`${process.env.APP_URL}/get-verify`);
      } else {
        failCode(res, "", "fails");
      }
    }
  );
};
const get_verifies = async (req, res) => {
  console.log("success");
  successCode(res, "", "success");
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
  update_img_test,
  test_send_email,
  verify_mail,
  get_verifies,
};
