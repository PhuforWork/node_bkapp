const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return persionality_tb.init(sequelize, DataTypes);
}

class persionality_tb extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_per: {
      autoIncrement: true,
      type: DataTypes.DOUBLE,
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
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'persionality_tb',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_per" },
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
