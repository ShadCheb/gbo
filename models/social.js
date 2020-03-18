const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const social = sequelize.define('social', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  vk: {
    type: Sequelize.STRING
  },
  instagram: {
    type: Sequelize.STRING
  },
  youtube: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

module.exports = social;