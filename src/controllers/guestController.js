const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const guest_booking = async (req, res) => {
  try {
    let { id } = req.params; //id_user
    let { start, end, detail } = req.body;
    let id_user = id;
    let chkguest = req.body.id;
    let id_selection = req.body.service.id_selection;
    let _values = req.body.service._values;

    let data = { start, end, detail, id_user };
    if (data) {
      await model.guest_booking.create(data);
      const idguest = await model.guest_booking.findOne({
        where: { checkguest: chkguest },
      });
      await model.service_guest.create({
        id_selection: id_selection,
        _values: _values,
        id_guest: idguest.id_guest,
      });
      successCode(res, "", "Success booking guest");
    } else {
      failCode(res, "", "Failed booking guest");
    }
  } catch (error) {
    errorCode(res, "", "Error 500");
  }
};
module.exports = { guest_booking };
