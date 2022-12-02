const sequelize = require("../models/index");
const init_models = require("../models/init-models");
const model = init_models(sequelize);

const getuser = async (req, res) => {
  let data = await model.users.findAll();
  res.send(data);
};

module.exports = { getuser };
