const schedule = require("node-schedule");
const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const model = init_models(sequelize);
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");

module.exports = (io) => {
  //báo thuc khi lich toi hen
  const alarm_immediately = async () => {
    // let aft_five_minute = moment.duration("00:05:00");
    // let datetimeLocal = moment(data.start).subtract(aft_five_minute);
    let Data = await model.notifications.findAll({
      include: ["department_notifies", "persionality_notifies"],
    });
    Data = JSON.parse(JSON.stringify(Data));
    // let test = moment().format("Z");

    console.log("array before", Data);
    Promise.all(
      Data.map(async (ele) => {
        let alarmDate = await moment(ele.alarmDate);
        let MM = (await alarmDate.month()) + 1;
        let DD = await alarmDate.date();
        let hh = await alarmDate.hours();
        let mm = await alarmDate.minutes();
        let ss = await alarmDate.second();
        //
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            let today = moment();
            await io.emit("getNotification");
            await notification_alarm({
              ...ele,
              today: today,
              type: 2,
              status: false,
              checkbk: ele.checkbk + 19,
            });
            await io.emit("getNotification");
          }
        );
      })
    );
  };
  return {
    alarm_immediately,
  };
};
