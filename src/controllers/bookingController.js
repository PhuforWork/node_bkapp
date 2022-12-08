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
    successCode(res, data_bk, "Add booking success");
  } else {
    failCode(res, "", "Missing fields booking");
  }
};
const add_type = async (req, res) => {
  let { id } = req.params; //id booking
  let id_booking = id;
  let { _selection, _date, start_time, end_time } = req.body;
  let data = { _selection, id_booking, _date, start_time, end_time };
  if (data) {
    const data_type = await model.select_type.create(data);
    successCode(res, data_type, "Add type success");
  } else {
    failCode(res, "", "Missing fields Selection");
  }
};

const add_persionality = async (req, res) => {
  let { id } = req.params; //id booking
  let id_booking = id;
  let { _position, _department, _date, start_time, end_time } = req.body;
  let data = {
    _position,
    _department,
    id_booking,
    _date,
    start_time,
    end_time,
  };
  if (data) {
    const data_persional = await model.persionality.create(data);
    successCode(res, data_persional, "Add persional success");
  } else {
    failCode(res, "", "Missing fields Persionality");
  }
};
//
const update_booking = async (req, res) => {
  let { id } = req.params; // id booking
  let { start_time, end_time, _date, details } = req.body;
  let data = { start_time, end_time, _date, details };
  if (data && id) {
    const updatebk = await model.booking_info.update(data, {
      where: {
        id_booking: id,
      },
    });
    successCode(res, updatebk, "Success update booking");
  } else {
    failCode(res, "", "Update booking failed");
  }
};
const update_slect = async (req, res) => {
  let { _selection, id_booking, _date, start_time, end_time } = req.params;
  let data = { _selection, id_booking, _date, start_time, end_time };
  if (data) {
    const up_slect = await model.select_type.update(data, {
      where: {
        id_booking: id_booking,
        _date: _date,
        start_time: start_time,
        end_time: end_time,
      },
    });
    successCode(res, up_slect, "Update success selection");
  }
};
const update_persion = async (req, res) => {
  let { _department, id_booking, _date, start_time, end_time } = req.params;
  let data = { _department, id_booking, _date, start_time, end_time };
  if (data) {
    const up_persion = await model.persionality.update(data, {
      where: {
        id_booking: id_booking,
        _date: _date,
        start_time: start_time,
        end_time: end_time,
      },
    });
  }
};
module.exports = {
  booking_user,
  add_booking,
  booking_userid,
  add_type,
  add_persionality,
  update_booking,
  update_slect,
  update_persion,
};
