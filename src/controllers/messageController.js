const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const { successCode, failCode, errorCode } = require("../untils/respone");
const model = init_models(sequelize);

const get_contact_messs = async (req, res) => {
  try {
    const getAllContact = await model.users.findAll({
      include: [],
      attributes: { exclude: ["_password", "email"] },
    });
    successCode(res, getAllContact, "Get Success");
  } catch (error) {
    errorCode(res, "Error BackEnd");
  }
};

module.exports = { get_contact_messs };
