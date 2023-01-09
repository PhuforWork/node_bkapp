const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const compress_images = require("compress-images");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const { Sequelize } = require("sequelize");

const Op = Sequelize.Op;
require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { encodeTokenEmail, compareToken } = require("../Middlewares/auth");
const cron = require("node-cron");
const schedule = require("node-schedule");
const moment = require("moment");

//Read all user
const getuser = async (req, res) => {
  try {
    let data = await model.users.findAll({
      include: ["departments"],
      attributes: { exclude: ["_password", "email"] },
    });
    // res.send(data);
    successCode(res, data, "Get Success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const get_search_user = async (req, res) => {
  let { search } = req.query;
  try {
    let data = await model.department.findAll({
      where: { label: { [Op.like]: "%" + search + "%" } },
    });
    successCode(res, data, "Get Success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// Read user by id
const getUserId = async (req, res) => {
  let { id } = req.params;
  let data = await model.users.findOne({
    include: ["select_types", "persionalities", "departments", "notifications"],
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
    indexRow,
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
      indexRow,
      data_booking,
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
      indexRow: 5,
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
        { user_name, email, _password: bcrypt.hashSync(_password, 10) },
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
    // fs.readFile(process.cwd() + "/" + req.file.path, async (err, data) => {
    //   let image_url = `data:${req.file.mimetype};base64,${Buffer.from(
    //     data
    //   ).toString("base64")}`;
    //   fs.unlinkSync(process.cwd() + "/" + req.file.path);
    //   await model.users.update(
    //     { image_url: image_url },
    //     { where: { id_user: id } }
    //   );
    //   successCode(res, "", "Update successfully");
    // });
    let image_url = "http://110.35.173.82:8081" + "/" + req.file.path;
    await model.users.update(
      { image_url: image_url },
      { where: { id_user: id } }
    );
    successCode(res, "", "Update successfully");
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
      // create reusable transporter object using the default SMTP transport
      // hash token
      let token = encodeTokenEmail(email);
      //
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
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Sans:wght@100;200;400;500;600;700&display=swap"
                rel="stylesheet"
              />
            </head>
          
            <body
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Noto Sans', sans-serif;
                background-color: #F2DADA;
                padding: 40px 0px;
              "
            >
              <div
                class="wrapper"
                style="
                  width: 600px;
                  height: 730px;
                  overflow: hidden;
                  box-shadow: 1px 1px 1px #ccc, -1px -1px 1px #ccc;
                  margin: auto;
                "
              >
                <div class="header" style="width: 100%; height: 232px">
                  <img
                    src="http://110.35.173.82:8081/public/img/header.png"
                    alt=""
                    style="width: 100%; height: 232px"
                  />
                </div>
                <div
                  class="content"
                  style="padding: 15px 20px; background-color: #ffffff"
                >
                  <p
                    class="title_line1 typography"
                    style="
                      color: #323232;
                      font-weight: 400;
                      font-size: 18px;
                      line-height: 30px;
                    "
                  >
                    Hello ${check_email.user_name}, this is a verification email. Please copy and paste this code into the input box on the password change page.
                    <h4>${token}</h4> 
                  </p>
                  <p
                    class="title_line2 typography"
                    style="
                      color: #323232;
                      font-weight: 400;
                      font-size: 18px;
                      line-height: 30px;
                    "
                  >
                    To complete the registration process, please click "Verify your password" below to go
                    to the Change password page.
                  </p>
                  <div class="content_btn" style="display: flex">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        padding: 12px 28px;
                        max-height: 40px;
                        background: #1976d2;
                        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
                          inset 0px 4px 4px rgba(0, 0, 0, 0.25);
                        border-radius: 8px;
                        cursor: pointer;
                        margin: auto;
                      "
                    >
                      <a
                        href="http://castis.world/authen/reset"
                        style="
                          text-align: center;
                          color: #ffffff;
                          text-transform: uppercase;
                          font-weight: 700;
                          font-size: 14px;
                          line-height: 21px;
                          text-decoration: none;
                          cursor: pointer;
                        "
                        >Verify your password</a
                      >
                    </div>
                  </div>
                  <p
                    class="title_line2 typography"
                    style="
                      color: #323232;
                      font-weight: 400;
                      font-size: 14px;
                      line-height: 21px;
                    "
                  >
                    Upon logging in, you are able to use our Booking Management Service to
                    make your booking, delete or change information.<br /><br />Thanks!
                  </p>
                </div>
                <div
                  class="footer"
                  style="width: 100%; background: #6ea5db; padding: 12px 40px"
                >
                  <p
                    class="title_line3"
                    style="
                      color: #323232;
                      font-weight: 400;
                      font-size: 12px;
                      line-height: 14px;
                      color: #ffffff;
                      margin: 0;
                    "
                  >
                    Ho Chi Minh Global Department
                  </p>
                  <p
                    class="title_line3"
                    style="
                      color: #323232;
                      font-weight: 400;
                      font-size: 12px;
                      line-height: 14px;
                      color: #ffffff;
                      margin: 0;
                    "
                  >
                    Contact: +82 (0)10 7379 7901
                  </p>
                </div>
              </div>
            </body>
          </html>
          
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
      successCode(res, { status }, "Check email successful");
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
    let token = req.body.code_verify;
    console.log(token);
    console.log(compareToken(token));
    if (email) {
      if (compareToken(token)) {
        await model.users.update(
          { _password: bcrypt.hashSync(_password, 10) },
          { where: { email: email } }
        );
        successCode(res, "", "Change password successfully");
      } else {
        failCode(res, { code: 010 }, "Token not correct or expires");
      }
    } else {
      failCode(res, "", "Missing email");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

//ghi chú của user
const note_get_id = async (req, res) => {
  try {
    let { id } = req.params;
    let note_res = await model.note_item.findAll({ where: { id_user: id } });
    successCode(res, note_res, "Success get note");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const note_post = async (req, res) => {
  try {
    let { indexRow, date, title, user_name, department, id_user } = req.body;
    let data = { indexRow, date, title, user_name, department, id_user };
    await model.note_item.create(data);
    successCode(res, "", "Success create note");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const note_put = async (req, res) => {
  try {
    let { id } = req.params; //id note
    let { indexRow, date, title, user_name, department } = req.body;
    let data = { indexRow, date, title, user_name, department };
    await model.note_item.update(data, { where: { id_note: id } });
    successCode(res, "", "Success update note");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const note_detele = async (req, res) => {
  try {
    let { id } = req.params; //id user
    await model.note_item.destroy({ where: { id_note: id } });
    successCode(res, "", "Success update note");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

//
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
const update_row = async (req, res) => {
  try {
    let { id } = req.params;
    let { indexRow } = req.body;
    let data = { indexRow };
    await model.users.update(data, { where: { id_user: id } });
    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const test_send_email = async (req, res) => {
  let { email } = req.body;
  // create reusable transporter object using the default SMTP transport
  // hash token
  let token = encodeTokenEmail(email);
  //
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
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700;900&family=Noto+Sans:wght@100;200;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
      
        <body
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Noto Sans', sans-serif;
            background-color: #e7e5e5;
            padding: 40px 0px;
          "
        >
          <div
            class="wrapper"
            style="
              width: 600px;
              height: 730px;
              overflow: hidden;
              box-shadow: 1px 1px 1px #ccc, -1px -1px 1px #ccc;
              margin: auto;
            "
          >
            <div class="header" style="width: 100%; height: 232px">
              <img
                src="http://110.35.173.82:8081/public/img/header.png"
                alt=""
                style="width: 100%; height: 232px"
              />
            </div>
            <div
              class="content"
              style="padding: 20px 40px 30px; background-color: #ffffff"
            >
              <p
                class="title_line1 typography"
                style="
                  color: #323232;
                  font-weight: 400;
                  font-size: 18px;
                  line-height: 30px;
                "
              >
                Hello [User ID], this is a verification email. Please copy and paste this code into the input box on the password change page.
                <h3>${token}</h3> 
              </p>
              <p
                class="title_line2 typography"
                style="
                  color: #323232;
                  font-weight: 400;
                  font-size: 18px;
                  line-height: 30px;
                "
              >
                To complete the registration process, please click "Verify your password" below to go
                to the Change password page.
              </p>
              <div class="content_btn" style="display: flex">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    padding: 12px 28px;
                    max-height: 40px;
                    background: #1976d2;
                    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25),
                      inset 0px 4px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 8px;
                    cursor: pointer;
                    margin: auto;
                  "
                >
                  <a
                    href="http://10.150.0.132:3000/authen/forgot/confirm"
                    style="
                      text-align: center;
                      color: #ffffff;
                      text-transform: uppercase;
                      font-weight: 700;
                      font-size: 14px;
                      line-height: 21px;
                      text-decoration: none;
                      cursor: pointer;
                    "
                    >Verify your password</a
                  >
                </div>
              </div>
              <p
                class="title_line2 typography"
                style="
                  color: #323232;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 21px;
                "
              >
                Upon logging in, you are able to use our Booking Management Service to
                make your booking, delete or change information.<br /><br />Thanks!
              </p>
            </div>
            <div
              class="footer"
              style="width: 100%; background: #6ea5db; padding: 12px 40px"
            >
              <p
                class="title_line3"
                style="
                  color: #323232;
                  font-weight: 400;
                  font-size: 12px;
                  line-height: 14px;
                  color: #ffffff;
                  margin: 0;
                "
              >
                Ho Chi Minh Global Department
              </p>
              <p
                class="title_line3"
                style="
                  color: #323232;
                  font-weight: 400;
                  font-size: 12px;
                  line-height: 14px;
                  color: #ffffff;
                  margin: 0;
                "
              >
                Contact: +82 (0)10 7379 7901
              </p>
            </div>
          </div>
        </body>
      </html>
      
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

// thong bao khi dat lich
const notification = async (data) => {
  let { senderName, status, id_user, start, end, department, today, type } =
    data;
  let data1 = {
    senderName,
    status,
    id_user,
    start,
    end,
    department,
    today,
    type,
  };
  let data2 = data.personality;
  console.log("abc", data2);
  try {
    let idNotify = await model.notifications.create(data1);
    Promise.all(
      data2.map(async (ele) => {
        await model.persionality_notify.create({
          label: ele.label,
          id_notify: idNotify.id_notify,
          value: ele.value,
        });
      })
    );
  } catch (error) {
    console.log(error);
  }
};
const notification_get = async (req, res) => {
  try {
    let { id } = req.params;
    const notifi_get = await model.notifications.findAll({
      include: ["persionality_notifies"],
      where: { id_user: id },
    });
    successCode(res, notifi_get, "Success get notify");
  } catch (error) {
    console.log(error);
  }
};
const notification_update = async (req, res) => {
  try {
    let { id } = req.params;
    let data = { status: true };
    await model.notifications.update(data, { where: { id_user: id } });
    successCode(res, "", "Success update notification");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const notification_delete = async (req, res) => {
  try {
    let { id } = req.params; // id notifi
    await model.notifications.destroy({ where: { id_user: id } });
    successCode(res, "", "Success delete");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

//báo thuc khi lich toi hen
const alarm_immediately = async (data) => {
  let datetimeLocal = moment(data.date).utcOffset(`${data.utcOffset}`);
  const rule = schedule.RecurrenceRule();
  // let test = moment().format("Z");
  // console.log(test);
  console.log("loggggggggggg", datetimeLocal);

  let DD = datetimeLocal.date();
  let MM = datetimeLocal.month() + 1;
  let hh = datetimeLocal.hours();
  let mm = datetimeLocal.minutes();
  let YYYY = datetimeLocal.year();
  let ss = datetimeLocal.seconds();
  // rule.year = datetimeLocal.year();
  rule.mounth = datetimeLocal.month() + 1;
  rule.date = datetimeLocal.date();
  rule.hour = datetimeLocal.hours();
  rule.minute = datetimeLocal.minutes();
  rule.second = datetimeLocal.second();
  console.log(rule);
  console.log(DD, MM, YYYY, hh, mm);
  await schedule.scheduleJob(rule, () => {
    console.log("testoooooo", 12341);
  });

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
  get_search_user,
  note_post,
  note_put,
  note_detele,
  note_get_id,
  update_row,
  notification,
  notification_update,
  notification_delete,
  notification_get,
  alarm_immediately,
};
