const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return persionality.init(sequelize, DataTypes);
}

class persionality extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_person: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    _position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    _department: {
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
    }
  }, {
    sequelize,
    tableName: 'persionality',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_person" },
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
