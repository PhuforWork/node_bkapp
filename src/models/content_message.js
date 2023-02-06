const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return content_message.init(sequelize, DataTypes);
}

class content_message extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_content: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    msg: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    today: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
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
    id_user_send: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_user_receive: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_send: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_receive: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    group: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'content_message',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_content" },
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
