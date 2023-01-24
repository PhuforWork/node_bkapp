const schedule = require("node-schedule");
const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const model = init_models(sequelize);
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");
// const async = require("async");
let alarmBooking = [];
module.exports = (io) => {
  //báo thuc khi lich toi hen
  const alarm_immediately = async (data) => {
    // let aft_five_minute = moment.duration("00:05:00");
    // let datetimeLocal = moment(data.start).subtract(aft_five_minute);
    let Data = model.notifications.findAll();
    // let test = moment().format("Z");
    await alarmBooking.push({ ...data, date_early_5: datetimeLocal });

    console.log("array before", alarmBooking);
    Promise.all(
      Data.map(async (ele) => {
        let MM = (await ele.alarmDate.month()) + 1;
        let DD = await ele.alarmDate.date();
        let hh = await ele.alarmDate.hours();
        let mm = await ele.alarmDate.minutes();
        let ss = await ele.alarmDate.second();
        //
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            let today = moment();
            // await io.emit("sendAlarm");
            await io.emit("getNotification");
            await notification_alarm({ ...ele, today: today, type: 2 });
            // alarmBooking = await alarmBooking.filter(
            //   (ele1) => ele1.start !== ele.start
            // );
            await io.emit("getNotification");
            console.log("alarm after", alarmBooking);
          }
        );
      })
    );
  };
  return {
    alarm_immediately,
  };
};
