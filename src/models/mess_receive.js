const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return mess_receive.init(sequelize, DataTypes);
}

class mess_receive extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_user_receive: {
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
    media: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_receive: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mess_receive',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_user_receive" },
        ]
      },
    ]
  });
  }
}
