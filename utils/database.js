const Sequelize = require('sequelize');
const {DB_NAME, USER_NAME, PASSWORD} = require('../keys/index');

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    freezeTableName: true,
  }
});

module.exports = sequelize;