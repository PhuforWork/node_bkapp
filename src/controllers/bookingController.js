const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const booking_user = async (req, res) => {
  let { id } = req.params;
  let check_id = { id };
  if (check_id) {
    const check_bkUser = await model.booking_info.findAll({
      include: ["select_types", "persionalities"],
    //   where: {
    //     id_user: id,
    //   },
    });
    successCode(res, check_bkUser, "Get success booking of user");
  }
};

const select_types = async (req, res) => {
  let { _selection, id_booking } = req.body;
  let data = { _selection, id_booking };
  if (data) {
    const data_type = await model.select_type.create(data);
    successCode(res, data_type, "Select type success");
  } else {
    failCode(res, "", "Missing types");
  }
};
module.exports = { booking_user, select_types };
