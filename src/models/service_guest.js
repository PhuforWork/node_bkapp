const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return service_guest.init(sequelize, DataTypes);
}

class service_guest extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_svgst: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    _values: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_selection: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    id_guest: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'guest_booking',
        key: 'id_guest'
      }
    }
  }, {
    sequelize,
    tableName: 'service_guest',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_svgst" },
        ]
      },
      {
        name: "id_guest",
        using: "BTREE",
        fields: [
          { name: "id_guest" },
        ]
      },
    ]
  });
  }
}
