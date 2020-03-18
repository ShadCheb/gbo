const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const time = sequelize.define('time', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  from: {
    type: Sequelize.TIME
  },
  before: {
    type: Sequelize.TIME
  }
}, {
  timestamps: false
})

module.exports = time;