const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const employee = sequelize.define('employee', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  post: {
    type: Sequelize.STRING
  },
  experience: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

module.exports = employee;