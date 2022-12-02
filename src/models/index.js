const { Sequelize } = require("sequelize");
const configs = require("../configs/index");

const sequelize = new Sequelize(
  configs.db_name,
  configs.db_user,
  configs.db_password,
  {
    host: configs.db_host,
    dialect: configs.db_dialect,
    port: configs.db_port,
  }
);

module.exports = sequelize;
