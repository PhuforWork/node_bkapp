const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const booking_user = async (req, res) => {
  let { id } = req.params;
  let check_id = { id };
  const check_bkUser = await model.users.findByPk({
    includes: ["persionalities", "select_types"],
    id
  });
  if (check_id) {
    successCode(res, check_bkUser, "Get success booking of user");
  }
};
module.exports = { booking_user };
