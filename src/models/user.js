const { Model, DataTypes } = require('sequelize');

class user extends Model {
  static init(sequelize) {
    super.init(
      {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        permission: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = user;
