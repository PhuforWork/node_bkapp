const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return persionality_notify.init(sequelize, DataTypes);
}

class persionality_notify extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_per_notify: {
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
    tableName: 'persionality_notify',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_per_notify" },
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
