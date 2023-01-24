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
    let Data = await model.notifications.findAll(
      { include: ["department_notifies", "persionality_notifies"] },
      // { raw: true }
    );
    // let test = moment().format("Z");
    // await alarmBooking.push({ ...data, date_early_5: datetimeLocal });

    // console.log("array before", alarmBooking);
    console.log("AAAaaAAaaaaaaaaaaa", Data);
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
            // await io.emit("sendAlarm");
            await io.emit("getNotification");

            await notification_alarm({
              ...ele,
              today: today,
              type: 2,
              status: false,
            });
            // alarmBooking = await alarmBooking.filter(
            //   (ele1) => ele1.start !== ele.start
            // );
            await io.emit("getNotification");
            // console.log("alarm after", alarmBooking);
          }
        );
      })
    );
  };
  return {
    alarm_immediately,
  };
};
