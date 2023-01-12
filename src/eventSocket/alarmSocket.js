const schedule = require("node-schedule");
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");
module.exports = (io) => {
  //báo thuc khi lich toi hen
  let alarmBooking = [];
  const alarm_immediately = async (data) => {
    let aft_five_minute = moment.duration("00:05:00");
    let datetimeLocal = moment(data.start).subtract(aft_five_minute);
    // let test = moment().format("Z");
    await alarmBooking.push({ ...data, date_early_5: datetimeLocal });

    Promise.all(
      alarmBooking.map(async (ele) => {
        let MM = (await ele.date_early_5.month()) + 1;
        let DD = await ele.date_early_5.date();
        let hh = await ele.date_early_5.hours();
        let mm = await ele.date_early_5.minutes();
        let ss = (await ele.date_early_5.second()) * 0 + 1;
        //
        // let MM = 1;
        // let DD = 10;
        // let hh = 0;
        // let mm = 41;
        // let ss = 1;
        console.log("array before", alarmBooking);
        console.log("show datetime", hh, mm, ss, DD, MM);
        let data1 = alarmBooking[0];
        console.log("array[0]",data1);
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            let today = moment();
            let early_day = moment()
              .subtract(aft_five_minute)
              .format("YYYY-MM-DD hh:mm");
            await io.emit("sendAlarm", { ...data1, today: today });
            notification_alarm({ ...data1, today: today });
            alarmBooking = await alarmBooking.filter(
              (ele1) => ele1.start !== ele.start
            );
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
