const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return booking_info.init(sequelize, DataTypes);
}

class booking_info extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_booking: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    _date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    details: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user'
      }
    },
    _department: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    _selection: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'booking_info',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_booking" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
  }
}
