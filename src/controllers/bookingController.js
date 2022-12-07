const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const booking_user = async (req, res) => {
  let { id } = req.params;
  let id_booking = { id };
  if (id_booking) {
    const check_bkUser = await model.booking_info.findOne({
      includes: ["persionalities"],
      where: {
        id_booking,
      },
    });
    successCode(res, check_bkUser, "Get success booking of user");
  }
};
module.exports = { booking_user };
