const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);
const moment = require("moment");
const schedule = require("node-schedule");

// get
const booking_user = async (req, res) => {
  try {
    const check_bkUser = await model.booking_info.findAll();
    successCode(res, check_bkUser, "Get success booking of user");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const get_depart = async (req, res) => {
  try {
    const getdepart = await model.department.findAll();
    successCode(res, getdepart, "Get department success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const get_persional_id = async (req, res) => {
  try {
    let { id } = req.params; //id user
    const get_persional = await model.persionality.findAll({
      where: { id_user: id },
    });
    successCode(res, get_persional, "Get persional success");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};

const booking_userid = async (req, res) => {
  try {
    let { id } = req.params;
    let check_id = { id }; //id user
    if (check_id) {
      const check_bkUser = await model.booking_info.findAll({
        include: ["department_tbs", "persionality_tbs", "select_type_tbs"],
        where: {
          id_user: id,
        },
      });
      successCode(res, check_bkUser, "Get success booking of user");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const get_department_slect = async (req, res) => {
  try {
    let { id } = req.params;
    let check_id = { id };
    if (check_id) {
      const get_depart = await model.department.findByPk(id);
      const get_slect = await model.select_type.findByPk(id);
      successCode(res, { get_depart, get_slect }, "Get successfull");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// post
const add_booking = async (req, res) => {
  try {
    let { id } = req.params; // id user
    let id_user = id;
    let { start, end, detail, id_orther_user, isCheck, utcOffset } = req.body;
    let checkbk_n = req.body.id;
    let _values = req.body.service._values;
    let id_selection = req.body.service.id_selection;
    let label = req.body.department.label;
    let value = req.body.department.value;

    let checkbk = Math.floor(Math.random() * checkbk_n) + 1;
    let personality = req.body.personality;
    let data = {
      start,
      end,
      detail,
      id_user,
      label,
      checkbk,
      id_orther_user,
      isCheck,
      utcOffset,
      id_check_delete: checkbk_n,
    };
    let flag = true;
    if (data) {
      const duplicate_booking = await model.booking_info.findAll({
        where: { id_user: id },
      });
      let change_start = new Date(start).getTime(); //time
      let change_end = new Date(end).getTime(); //time
      let get_month = new Date(end).getMonth(); // get mounth
      let get_date = new Date(end).getDate(); // get mounth
      Promise.all(
        duplicate_booking.map(async (values) => {
          let map_start = new Date(values.start).getTime();
          let map_end = new Date(values.end).getTime();
          let map_month = new Date(values.end).getMonth();
          let map_date = new Date(values.end).getDate();
          if (change_start === map_start && change_end === map_end) {
            flag = false;
            failCode(res, { code: 09 }, "Duplicat booking 1");
          } else if (
            (change_start === map_start &&
              get_month === map_month &&
              get_date === map_date &&
              change_end > map_end) ||
            (change_start === map_start &&
              get_month === map_month &&
              get_date === map_date &&
              change_end < map_end)
          ) {
            flag = false;
            failCode(res, { code: 09 }, "Duplicat booking 2");
          } else if (
            (change_end === map_end &&
              get_month === map_month &&
              get_date === map_date &&
              change_start > map_start) ||
            (change_end === map_end &&
              get_month === map_month &&
              get_date === map_date &&
              change_start < map_start)
          ) {
            flag = false;
            failCode(res, { code: 09 }, "Duplicat booking 3");
          } else if (
            get_month === map_month &&
            get_date === map_date &&
            change_start > map_start &&
            change_end < map_end
          ) {
            flag = false;
            failCode(res, { code: 09 }, "Duplicat booking 4");
          } else if (
            get_month === map_month &&
            get_date === map_date &&
            change_start < map_start &&
            change_end > map_end
          ) {
            flag = false;
            failCode(res, { code: 09 }, "Duplicat booking 5");
          }
        })
      );
      //put code here
      let res_per = [];
      if (flag) {
        const res_bk = await model.booking_info.create(data); // trả dử liệu để notify
        const idbk = await model.booking_info.findOne({
          where: { checkbk: checkbk },
        });
        if (personality) {
          Promise.all(
            personality.map(async (values) => {
              await model.persionality_tb.create({
                value: values.value,
                label: values.label,
                id_booking: idbk.id_booking,
              });
              await res_per.push({
                value: values.value,
                label: values.label,
                id_booking: idbk.id_booking,
              });
            })
          );
        }
        await model.select_type_tb.create({
          id_selection: id_selection,
          _values: _values,
          id_booking: idbk.id_booking,
        });
        let res_der = await model.department_tb.create({
          value: value,
          label: label,
          id_booking: idbk.id_booking,
        });
        // await alarm_notification({
        //   status: false,
        //   id_user: id_user,
        //   start: start,
        //   end: end,
        //   department: label,
        //   personality: res_per,
        //   type: 2,
        // });
        successCode(res, { res_bk, res_per, res_der }, "Add booking success");
      } else {
        failCode(res, { code: 09 }, "Duplicate booking 6");
      }
    } else {
      failCode(res, { code: 012 }, "Missing fields booking");
    }
  } catch (error) {
    errorCode(res, "Error 500");
  }
};

const add_depart = async (req, res) => {
  let { id } = req.params; //id user
  let id_user = id;
  let { array } = req.body;
  let data = { array, id_user };
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
const update_depart = async (req, res) => {
  try {
    let { id } = req.params; //id user
    let data = req.body;
    // await model.department.destroy({ where: { id_user: id } });
    // Promise.all(data).then((values) => {
    //   values.map(async (ele) => {
    await model.department.create({
      label: data.label,
      value: data.value,
      id_user: data.id_user,
      email_depart: data.email_depart,
      phoneNumber: data.phoneNumber,
      domain: data.domain,
      additon: data.addition,
    });
    //   });
    // });
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
// update depart setting user
const update_dpt_new = async (req, res) => {
  try {
    let { id } = req.params; // id department
    let { label, value, id_user, email_depart, phoneNumber, domain } = req.body;
    let data = { label, value, id_user, email_depart, phoneNumber, domain };
    await model.department.update(data, { where: { id_derp: id } });
    successCode(res, "", "Success Update");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};
const delete_department = async (req, res) => {
  try {
    let { id } = req.params; //id department
    await model.department.destroy({ where: { id_derp: id } });
    successCode(res, "", "Success code");
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
// booking calender
const update_booking = async (req, res) => {
  try {
    let { id } = req.params; // id booking
    let { start, end, detail, id_orther_user } = req.body;
    let _values = req.body.service._values;
    let label = req.body.department.label;
    let personality = req.body.personality;
    let data = {
      start,
      end,
      detail,
      label,
      id_orther_user,
    };
    let check1 = await model.booking_info.findOne({
      where: { id_booking: id },
    });
    let check2 = await model.booking_info.findAll({
      where: { id_check_delete: check1.id_check_delete },
    });
    let flag = true;
    if (data) {
      if (flag) {
        Promise.all(
          check2.map(async (ele) => {
            await model.booking_info.update(data, {
              where: { checkbk: ele.checkbk },
            });
            await model.persionality_tb.destroy({
              where: { id_booking: ele.id_booking },
            });
            Promise.all(
              personality.map((values) => {
                model.persionality_tb.create({
                  value: values.value,
                  label: values.label,
                  id_booking: ele.id_booking,
                });
              })
            );
            await model.select_type_tb.update(
              {
                _values: _values,
              },
              { where: { id_booking: ele.id_booking } }
            );
            await model.department_tb.update(
              {
                label: label,
              },
              { where: { id_booking: ele.id_booking } }
            );
          })
        );
        successCode(res, "", "Add booking success");
      } else {
        failCode(res, { code: 09 }, "Duplicate booking 11");
      }
    } else {
      failCode(res, { code: 012 }, "Missing fields booking");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const delete_bk = async (req, res) => {
  try {
    let { id } = req.params; //id booking
    const check = await model.booking_info.findByPk(id);
    const dlt = await model.booking_info.findAll({
      where: { id_check_delete: check.id_check_delete },
    });
    if (check) {
      Promise.all(
        dlt.map(async (values) => {
          await model.department_tb.destroy({
            where: { id_booking: values.id_booking },
          });
          await model.persionality_tb.destroy({
            where: { id_booking: values.id_booking },
          });
          await model.select_type_tb.destroy({
            where: { id_booking: values.id_booking },
          });
          await model.booking_info.destroy({
            where: { id_booking: values.id_booking },
          });
        })
      );
      successCode(res, "", "Success delete");
    } else {
      failCode(res, { code: 013 }, "Delete fail");
    }
  } catch (error) {
    errorCode(res, "", "Error BackEnd");
  }
};
const notification = async (req, res) => {
  try {
    let today = moment();
    let { senderName, status, type } = req.body;
    let { start, end, detail, isCheck } = req.body.data.res_bk;
    let department = req.body.data.res_der.label;
    let data2 = req.body.data.res_per;
    let data3 = req.body.data.res_der;
    console.log("data3", data3);
    let data1 = {
      senderName,
      status,
      id_user: req.body.id_user,
      today,
      department,
      type,
      start,
      end,
      detail,
      isRead: true,
    };
    if (!isCheck) {
      let idNotify = await model.notifications.create(data1);
      Promise.all(
        data2.map(async (ele) => {
          await model.persionality_notify.create({
            id_notify: idNotify.id_notify,
            label: ele.label,
            value: ele.value,
          });
        })
      );
      await model.department_notify.create({
        ...data3,
        id_notify: idNotify.id_notify,
      });
    } else {
      let idNotify = await model.notifications.create({ ...data1, type: 3 });
      await model.department_notify.create({
        ...data3,
        id_notify: idNotify.id_notify,
      });
    }

    successCode(res, "", "Success");
  } catch (error) {
    errorCode(res, "Error Backend");
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
  get_depart,
  get_persional_id,
  notification,
  update_dpt_new,
  delete_department,
};
