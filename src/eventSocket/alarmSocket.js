const schedule = require("node-schedule");
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");
// const async = require("async");
let alarmBooking = [];
module.exports = (io) => {
  //báo thuc khi lich toi hen
  const alarm_immediately = async (data) => {
    let aft_five_minute = moment.duration("00:05:00");
    let datetimeLocal = moment(data.start).subtract(aft_five_minute);
    // let test = moment().format("Z");
    await alarmBooking.push({ ...data, date_early_5: datetimeLocal });
    console.log("array before", alarmBooking);
    Promise.all(
      alarmBooking.map(async (ele) => {
        let MM = (await ele.date_early_5.month()) + 1;
        let DD = await ele.date_early_5.date();
        let hh = await ele.date_early_5.hours();
        let mm = await ele.date_early_5.minutes();
        let ss = await ele.date_early_5.second();
        //
        // let MM = 1;
        // let DD = 10;
        // let hh = 0;
        // let mm = 41;
        // let ss = 1;
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            let today = moment();
            // await io.emit("sendAlarm");
            console.log(data1);
            notification_alarm({...ele, today: today });
            alarmBooking = alarmBooking.filter(
              (ele1) => ele1.start !== ele.start
            );
            io.emit("getNotification");
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
