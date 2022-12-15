const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return guest_booking.init(sequelize, DataTypes);
}

class guest_booking extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_guest: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    detail: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'guest_booking',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_guest" },
        ]
      },
    ]
  });
  }
}
