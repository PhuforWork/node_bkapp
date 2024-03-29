const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return media_message.init(sequelize, DataTypes);
}

class media_message extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_media: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    media: {
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
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    today: {
      type: DataTypes.DATE,
      allowNull: true
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'media_message',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_media" },
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
