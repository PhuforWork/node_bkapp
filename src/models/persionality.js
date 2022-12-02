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
      allowNull: false
    },
    _department: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_booking: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'booking_info',
        key: 'id_booking'
      }
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
