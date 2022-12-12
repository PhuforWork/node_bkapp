const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return persionality.init(sequelize, DataTypes);
}

class persionality extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    value: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
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
          { name: "value" },
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
