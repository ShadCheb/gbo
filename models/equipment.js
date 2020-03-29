const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const equipment = sequelize.define('equipment', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
}, {
  timestamps: false
})

module.exports = equipment;