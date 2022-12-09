const DataTypes = require("sequelize").DataTypes;
const _booking_info = require("./booking_info");
const _persionality = require("./persionality");
const _select_type = require("./select_type");
const _users = require("./users");

function initModels(sequelize) {
  const booking_info = _booking_info(sequelize, DataTypes);
  const persionality = _persionality(sequelize, DataTypes);
  const select_type = _select_type(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  booking_info.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(booking_info, { as: "booking_infos", foreignKey: "id_user"});
  persionality.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(persionality, { as: "persionalities", foreignKey: "id_user"});
  select_type.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(select_type, { as: "select_types", foreignKey: "id_user"});

  return {
    booking_info,
    persionality,
    select_type,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
