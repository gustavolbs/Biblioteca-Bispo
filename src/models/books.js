const { Model, DataTypes } = require('sequelize');

class book extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        author: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        borrowed: DataTypes.BOOLEAN,
        quantity_borrowed: DataTypes.INTEGER,
        borrowed_for_who: DataTypes.STRING,
        readed: DataTypes.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = book;
