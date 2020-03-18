const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const address = sequelize.define('address', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  address: {
    type: Sequelize.STRING
  },
  coords: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

module.exports = address;