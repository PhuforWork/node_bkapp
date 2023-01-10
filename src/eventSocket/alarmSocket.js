const schedule = require("node-schedule");
const moment = require("moment");
const { notification_alarm } = require("../controllers/userController");
module.exports = (io) => {
  //báo thuc khi lich toi hen
  let alarmBooking = [];
  const alarm_immediately = async (data) => {
    let datetimeLocal = moment(data.start);
    // let test = moment().format("Z");
    await alarmBooking.push(datetimeLocal);
    // console.log("1",alarmBooking);
    // console.log("loggggggggggg", datetimeLocal);
    let today;
    const test = setInterval(() => {
      today = moment();
      clearInterval(test);
    }, 1000);

    console.log("today", today);
    Promise.all(
      alarmBooking.map(async (ele) => {
        if (ele === today) {
          let MM = (await ele.month()) + 1;
          let DD = await ele.date();
          let hh = await (ele.minutes() === 0 ? ele.hours() - 1 : ele.hours());
          let mm = await (ele.minutes() === 0 ? 55 : ele.minutes() - 5);
          let ss = (await ele.second()) * 0 + 1;
          //
          // let MM = 1;
          // let DD = 10;
          // let hh = 16;
          // let mm = 5;
          // let ss = 1;
          console.log("array before", alarmBooking);
          console.log("show datetime", hh, mm, ss, DD, MM);
          await schedule.scheduleJob(
            `${ss} ${mm} ${hh} ${DD} ${MM} *`,
            async () => {
              await io.emit("sendAlarm", { ...data, today: today });
              // console.log("testSend", 123);
              notification_alarm({ ...data, today: today });
              alarmBooking = await alarmBooking.filter((ele1) => ele1 !== ele);
              console.log("alarm after", alarmBooking);
            }
          );
        }
      })
    );
  };
  return {
    alarm_immediately,
  };
};
