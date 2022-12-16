const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return select_type_tb.init(sequelize, DataTypes);
}

class select_type_tb extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_sl: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    _values: {
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
    id_selection: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'select_type_tb',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sl" },
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
