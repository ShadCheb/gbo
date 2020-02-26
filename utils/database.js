const Sequelize = require('sequelize');
const DB_NAME = 'gbo_db';
const USER_NAME = 'g_admin';
const PASSWORD = 'yd4D59sp!W';

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;