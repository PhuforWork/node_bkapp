const DataTypes = require("sequelize").DataTypes;
const _booking_info = require("./booking_info");
const _department = require("./department");
const _department_tb = require("./department_tb");
const _note_item = require("./note_item");
const _notifications = require("./notifications");
const _persionality = require("./persionality");
const _persionality_notify = require("./persionality_notify");
const _persionality_tb = require("./persionality_tb");
const _select_type = require("./select_type");
const _select_type_tb = require("./select_type_tb");
const _users = require("./users");

function initModels(sequelize) {
  const booking_info = _booking_info(sequelize, DataTypes);
  const department = _department(sequelize, DataTypes);
  const department_tb = _department_tb(sequelize, DataTypes);
  const note_item = _note_item(sequelize, DataTypes);
  const notifications = _notifications(sequelize, DataTypes);
  const persionality = _persionality(sequelize, DataTypes);
  const persionality_notify = _persionality_notify(sequelize, DataTypes);
  const persionality_tb = _persionality_tb(sequelize, DataTypes);
  const select_type = _select_type(sequelize, DataTypes);
  const select_type_tb = _select_type_tb(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  department_tb.belongsTo(booking_info, { as: "id_booking_booking_info", foreignKey: "id_booking"});
  booking_info.hasMany(department_tb, { as: "department_tbs", foreignKey: "id_booking"});
  persionality_tb.belongsTo(booking_info, { as: "id_booking_booking_info", foreignKey: "id_booking"});
  booking_info.hasMany(persionality_tb, { as: "persionality_tbs", foreignKey: "id_booking"});
  select_type_tb.belongsTo(booking_info, { as: "id_booking_booking_info", foreignKey: "id_booking"});
  booking_info.hasMany(select_type_tb, { as: "select_type_tbs", foreignKey: "id_booking"});
  persionality_notify.belongsTo(notifications, { as: "id_notify_notification", foreignKey: "id_notify"});
  notifications.hasMany(persionality_notify, { as: "persionality_notifies", foreignKey: "id_notify"});
  booking_info.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(booking_info, { as: "booking_infos", foreignKey: "id_user"});
  department.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(department, { as: "departments", foreignKey: "id_user"});
  note_item.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(note_item, { as: "note_items", foreignKey: "id_user"});
  notifications.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(notifications, { as: "notifications", foreignKey: "id_user"});
  persionality.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(persionality, { as: "persionalities", foreignKey: "id_user"});
  select_type.belongsTo(users, { as: "id_user_user", foreignKey: "id_user"});
  users.hasMany(select_type, { as: "select_types", foreignKey: "id_user"});

  return {
    booking_info,
    department,
    department_tb,
    note_item,
    notifications,
    persionality,
    persionality_notify,
    persionality_tb,
    select_type,
    select_type_tb,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
