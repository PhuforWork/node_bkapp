const schedule = require("node-schedule");
const moment = require("moment");
module.exports = (io) => {
  //báo thuc khi lich toi hen
  let arlamBooking = [];
  const alarm_immediately = async (data) => {
    let datetimeLocal = moment(data.start);
    // let test = moment().format("Z");
    await arlamBooking.push(data);
    // console.log("1",arlamBooking);
    // console.log("loggggggggggg", datetimeLocal);
    Promise.all(
      arlamBooking.map(async (ele) => {
        // let MM = (await ele.start.month()) + 1;
        // let DD = await ele.start.date();
        // let hh = await ele.start.hours();
        // let mm = await ele.start.minutes();
        // let ss = (await ele.start.second()) * 0 + 1;
        //
        let MM = 1;
        let DD = 10;
        let hh = 14;
        let mm = 02;
        let ss = 1;

        console.log(hh, mm, ss, DD, MM);
        await schedule.scheduleJob(
          `${ss} ${mm} ${hh} ${DD} ${MM} *`,
          async () => {
            await io.emit("sendArlam", data);
            console.log("testSend",123);
            arlamBooking = await arlamBooking.filter(
              (ele1) => ele1.start !== ele.start
            );
          }
        );
      })
    );
  };
  return {
    alarm_immediately,
  };
};
