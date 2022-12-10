const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

// get
const booking_user = async (req, res) => {
  const check_bkUser = await model.booking_info.findAll();
  successCode(res, check_bkUser, "Get success booking of user");
};
const booking_userid = async (req, res) => {
  let { id } = req.params;
  let check_id = { id }; //id user
  if (check_id) {
    const check_bkUser = await model.booking_info.findAll({
      where: {
        id_user: id,
      },
    });
    successCode(res, check_bkUser, "Get success booking of user");
  }
};
const get_department_slect = async (req, res) => {
  let { id } = req.params;
  let check_id = { id };
  if (check_id) {
    const get_depart = await model.persionality.findByPk(id);
    const get_slect = await model.select_type.findByPk(id);
    successCode(res, { get_depart, get_slect }, "Get successfull");
  }
};
// post
const add_booking = async (req, res) => {
  let { id } = req.params; // id user
  let id_user = id;
  let { start_time, end_time, _date, details } = req.body;
  let data = {
    start_time,
    end_time,
    _date,
    details,
    id_user,
  };
  if (data) {
    const data_bk = await model.booking_info.create(data);
    successCode(res, data_bk, "Add booking success");
  } else {
    failCode(res, "", "Missing fields booking");
  }
};
const add_depart = async (req, res) => {
  let { id } = req.params; //id user
  let id_user = id;
  let { array } = req.body;
  let data = { array, id_user };
  console.log(data);
  if (data) {
    const data_bk = await model.persionality.create(data);
    successCode(res, data_bk, "Add department success");
  }
};
const add_slect = async (req, res) => {
  let { id } = req.params; //id user
  let id_user = id;
  let { data } = req.body;
  let dta = { data, id_user };
  console.log(data);
  if (dta) {
    const data_bk = await model.select_type.create(dta);
    successCode(res, data_bk, "Add department success");
  }
};

//
const update_booking = async (req, res) => {
  let { id } = req.params; // id booking
  let id_user = id;
  let { start_time, end_time, _date, details } = req.body;
  let data = {
    start_time,
    end_time,
    _date,
    details,
    id_user,
  };
  if (data && id) {
    const updatebk = await model.booking_info.update(data, {
      where: {
        id_booking: id,
      },
    });
    successCode(res, "", "Success update booking");
  } else {
    failCode(res, "", "Update booking failed");
  }
};
const update_slect = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    await model.select_type.destroy({ where: { id_user: id } });
    Promise.all(data).then((values) => {
      values.map(async (ele) => {
        await model.select_type.create({
          _values: ele._values,
          id_user: ele.id_user,
        });
      });
    });
    successCode(res, "", "Update success selection");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const update_depart = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    await model.persionality.destroy({ where: { id_user: id } });
    Promise.all(data).then((values) => {
      values.map(async (ele) => {
        await model.persionality.create({
          _values: ele._values,
          _name: ele._values,
          id_user: ele.id_user,
        });
      });
    });
    successCode(res, "", "Update success selection");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

module.exports = {
  booking_user,
  add_booking,
  booking_userid,
  add_depart,
  add_slect,
  update_booking,
  update_slect,
  update_depart,
  get_department_slect,
};
