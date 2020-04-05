const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const review_vk = sequelize.define('review_vk', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  id_group: {
    type: Sequelize.STRING
  },
  id_token: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
})

module.exports = review_vk;