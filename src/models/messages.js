const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return messages.init(sequelize, DataTypes);
}

class messages extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id_user'
      }
    },
    id_user_send: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      references: {
        model: 'mess_sends',
        key: 'id_user_send'
      }
    },
    id_user_receive: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      references: {
        model: 'mess_receive',
        key: 'id_user_receive'
      }
    }
  }, {
    sequelize,
    tableName: 'messages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_user_send" },
          { name: "id_user_receive" },
        ]
      },
      {
        name: "id_user",
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "id_user_receive",
        using: "BTREE",
        fields: [
          { name: "id_user_receive" },
        ]
      },
    ]
  });
  }
}
