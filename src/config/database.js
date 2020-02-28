const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    timestamps: true,
    undescored: true,
  },
};
