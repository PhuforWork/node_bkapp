const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const booking_user = async (req, res) => {
  let { id } = req.params;
  let check_id = { id };
  if (check_id) {
    const check_bkUser = await model.booking_info.findAll({
      include: ["select_types", "persionalities"],
    });
    successCode(res, check_bkUser, "Get success booking of user");
  }
};
const booking_userid = async (req, res) => {
  let { id } = req.params;
  let check_id = { id }; //id user
  if (check_id) {
    const check_bkUser = await model.booking_info.findAll({
      include: ["select_types", "persionalities"],
        where: {
          id_user: id,
        },
    });
    successCode(res, check_bkUser, "Get success booking of user");
  }
};

const add_booking = async (req, res) => {
  let { id } = req.params; // id user
  let id_user = id;
  let { start_time, end_time, _date, details } = req.body;
  let data = { start_time, end_time, _date, details, id_user };
  if (data) {
    const data_bk = await model.booking_info.create(data);
    successCode(res, data_bk, "Select type success");
  } else {
    failCode(res, "", "Missing fields booking");
  }
};
module.exports = { booking_user, add_booking,booking_userid };
