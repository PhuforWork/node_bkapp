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
    _values: {
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
    _name: {
      type: DataTypes.STRING(255),
      allowNull: true
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
