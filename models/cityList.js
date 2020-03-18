const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const cityList = sequelize.define('city_list', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  brief: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = cityList;