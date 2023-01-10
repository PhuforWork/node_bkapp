const schedule = require("node-schedule");
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");
module.exports = (io) => {
  //báo thuc khi lich toi hen
  let alarmBooking = [];
  const alarm_immediately = async (data) => {
    // let datetimeLocal = moment(data.start);
    let today = new Date();
    // let test = moment().format("Z");
    await alarmBooking.push(data);
    // console.log("1",alarmBooking);
    // console.log("loggggggggggg", datetimeLocal);
    Promise.all(
      alarmBooking.map(async (ele) => {
        let MM = (await ele.start.month()) + 1;
        let DD = await ele.start.date();
        let hh = await ele.start.hours();
        let mm = (await ele.start.minutes()) - 5;
        let ss = (await ele.start.second()) * 0 + 1;
        //
        // let MM = 1;
        // let DD = 10;
        // let hh = 16;
        // let mm = 5;
        // let ss = 1;
        console.log("1", alarmBooking);
        console.log(hh, mm, ss, DD, MM);
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            await io.emit("sendAlarm", { ...data, today: today });
            // console.log("testSend", 123);
            notification_alarm({ ...data, today: today });
            alarmBooking = await alarmBooking.filter(
              (ele1) => ele1.start !== ele.start
            );
            console.log("2", alarmBooking);
          }
        );
      })
    );
  };
  return {
    alarm_immediately,
  };
};
