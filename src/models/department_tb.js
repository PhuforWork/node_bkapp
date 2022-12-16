const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return department_tb.init(sequelize, DataTypes);
}

class department_tb extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_derp: {
      autoIncrement: true,
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
      allowNull: false,
      references: {
        model: 'booking_info',
        key: 'id_booking'
      }
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
          { name: "id_derp" },
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
