const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const phone = sequelize.define('phone', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  kod: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.STRING
  },
  link: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

module.exports = phone;