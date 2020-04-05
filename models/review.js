const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const review = sequelize.define('review', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  review: {
    type: Sequelize.TEXT
  },
  date: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  id_com: {
    type: Sequelize.INTEGER
  },
}, {
  timestamps: false
})

module.exports = review;