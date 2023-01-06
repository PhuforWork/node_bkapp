const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return notifications.init(sequelize, DataTypes);
}

class notifications extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_notify: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id_user'
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_notify" },
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
