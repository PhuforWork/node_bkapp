const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return department_notify.init(sequelize, DataTypes);
}

class department_notify extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_depart_notify: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_notify: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notifications',
        key: 'id_notify'
      }
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'department_notify',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_depart_notify" },
        ]
      },
      {
        name: "id_notify",
        using: "BTREE",
        fields: [
          { name: "id_notify" },
        ]
      },
    ]
  });
  }
}
