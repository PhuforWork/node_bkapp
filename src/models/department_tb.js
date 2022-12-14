const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return department_tb.init(sequelize, DataTypes);
}

class department_tb extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_booking: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'booking_info',
        key: 'id_booking'
      }
    }
  }, {
    sequelize,
    tableName: 'department_tb',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "value" },
        ]
      },
      {
        name: "id_booking",
        using: "BTREE",
        fields: [
          { name: "id_booking" },
        ]
      },
    ]
  });
  }
}
