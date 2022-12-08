const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return select_type.init(sequelize, DataTypes);
}

class select_type extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_selection: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    _selection: {
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
    _date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'select_type',
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
