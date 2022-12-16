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
      include: ["department_tbs", "persionality_tbs"],
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
    const get_depart = await model.department.findByPk(id);
    const get_slect = await model.select_type.findByPk(id);
    successCode(res, { get_depart, get_slect }, "Get successfull");
  }
};
// post
const add_booking = async (req, res) => {
  try {
    let { id } = req.params; // id user
    let id_user = id;
    let { start, end, detail } = req.body;
    let checkbk = req.body.id;
    console.log(checkbk);
    let _values = req.body.service._values;
    let id_selection = req.body.service.id_selection;
    let label = req.body.department.label;
    let value = req.body.department.value;

    console.log("payload", req.body);

    let personality = req.body.personality;
    let data = {
      start,
      end,
      detail,
      id_user,
      label,
      checkbk,
    };

    if (data) {
      await model.booking_info.create(data);
      const idbk = await model.booking_info.findOne({
        where: { checkbk: checkbk },
      });
      console.log("id_bk", { ids: idbk.id_booking });
      Promise.all(
        personality.map(async (values) => {
          await model.persionality_tb.create({
            value: values.value,
            label: values.label,
            id_booking: idbk.id_booking,
          });
        })
      );

      await model.select_type_tb.create({
        id_selection: id_selection,
        _values: _values,
        id_booking: idbk.id_booking,
      });
      await model.department_tb.create({
        value: value,
        label: label,
        id_booking: idbk.id_booking,
      });

      const a = await model.persionality_tb.findAll({
        where: { id_booking: idbk.id_booking },
      });
      const b = await model.select_type_tb.findAll({
        where: { id_booking: idbk.id_booking },
      });
      const c = await model.department_tb.findAll({
        where: { id_booking: idbk.id_booking },
      });
      successCode(res, { a, b, c }, "Add booking success");
    } else {
      failCode(res, "", "Missing fields booking");
    }
  } catch (error) {
    console.log("err", error);
    errorCode(res, "", "Error 500");
  }
};

const add_depart = async (req, res) => {
  let { id } = req.params; //id user
  let id_user = id;
  let { array } = req.body;
  let data = { array, id_user };
  console.log(data);
  if (data) {
    const data_bk = await model.department.create(data);
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

//setting user
const update_slect = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    await model.select_type.destroy({ where: { id_user: id } });
    Promise.all(data).then((values) => {
      values.map(async (ele) => {
        await model.select_type.create({
          id_selection: ele.id_selection,
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
// setting user
const update_depart = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    await model.department.destroy({ where: { id_user: id } });
    Promise.all(data).then((values) => {
      values.map(async (ele) => {
        await model.department.create({
          label: ele.label,
          value: ele.value,
          id_user: ele.id_user,
        });
      });
    });
    successCode(res, "", "Update success department");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const update_persional = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    await model.persionality.destroy({ where: { id_user: id } });
    Promise.all(data).then((values) => {
      values.map(async (ele) => {
        console.log(ele.value);
        await model.persionality.create({
          label: ele.label,
          value: ele.value,
          id_user: ele.id_user,
        });
      });
    });
    successCode(res, "", "Update success persional");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// booking calender
const update_booking = async (req, res) => {
  let { id } = req.params; // id booking
  let { start, end, detail } = req.body;
  let _values = req.body.service._values;
  let label = req.body.department.label;
  let checkbk = req.body.id;
  let personality = req.body.personality;
  let data = {
    start,
    end,
    detail,
    checkbk,
    label,
  };
  console.log(data.detail);
  if (data) {
    await model.booking_info.update(data, { where: { id_booking: id } });
    const idbk = await model.booking_info.findOne({ where: { checkbk: checkbk } });
    await model.persionality_tb.destroy({
      where: { id_booking: idbk.id_booking },
    });
    Promise.all(
      personality.map((values) => {
        model.persionality_tb.create({
          value: values.value,
          label: values.label,
          id_booking: idbk.id_booking,
        });
      })
    );
    await model.select_type_tb.update(
      {
        _values: _values,
      },
      { where: { id_booking: idbk.id_booking } }
    );
    await model.department_tb.update(
      {
        label: label,
      },
      { where: { id_booking: idbk.id_booking } }
    );
    successCode(res, "", "Add booking success");
  } else {
    failCode(res, "", "Missing fields booking");
  }
};

const delete_bk = async (req, res) => {
  let { id } = req.params; //id booking
  const check = await model.booking_info.findByPk(id);

  if (check) {
    await model.department_tb.destroy({ where: { id_booking: id } });
    await model.persionality_tb.destroy({ where: { id_booking: id } });
    await model.select_type_tb.destroy({ where: { id_booking: id } });
    await model.booking_info.destroy({ where: { id_booking: id } });
    successCode(res, "", "Success delete");
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
  update_persional,
  delete_bk,
};
