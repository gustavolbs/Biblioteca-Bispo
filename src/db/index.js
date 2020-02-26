const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/user');
const Book = require('../models/books');

const connection = new Sequelize(dbConfig);

User.init(connection);
Book.init(connection);

module.exports = connection;
