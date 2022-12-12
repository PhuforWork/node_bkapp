const DataTypes = require("sequelize").DataTypes;
const _booking_info = require("./booking_info");
const _department = require("./department");
const _department_tb = require("./department_tb");
const _persionality = require("./persionality");
const _persionality_tb = require("./persionality_tb");
const _select_type = require("./select_type");
const _users = require("./users");

function initModels(sequelize) {
  const booking_info = _booking_info(sequelize, DataTypes);
  const department = _department(sequelize, DataTypes);
  const department_tb = _department_tb(sequelize, DataTypes);
  const persionality = _persionality(sequelize, DataTypes);
  const persionality_tb = _persionality_tb(sequelize, DataTypes);
  const select_type = _select_type(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  department_tb.belongsTo(booking_info, { as: "id_booking_booking_info", foreignKey: "id_booking"});
  booking_info.hasMany(department_tb, { as: "department_tbs", foreignKey: "id_booking"});
  persionality_tb.belongsTo(booking_info, { as: "id_booking_booking_info", foreignKey: "id_booking"});
  booking_info.hasMany(persionality_tb, { as: "persionality_tbs", foreignKey: "id_booking"});
  booking_info.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(booking_info, { as: "booking_infos", foreignKey: "id_user"});
  department.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(department, { as: "departments", foreignKey: "id_user"});
  persionality.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(persionality, { as: "persionalities", foreignKey: "id_user"});
  select_type.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(select_type, { as: "select_types", foreignKey: "id_user"});

  return {
    booking_info,
    department,
    department_tb,
    persionality,
    persionality_tb,
    select_type,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
