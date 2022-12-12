const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return select_type_tb.init(sequelize, DataTypes);
}

class select_type_tb extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_selection: {
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
      allowNull: true,
      references: {
        model: 'booking_info',
        key: 'id_booking'
      }
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
          { name: "id_selection" },
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
