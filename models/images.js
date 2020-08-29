const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Images = sequelize.define('images', {
  image_id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  table: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

module.exports = Images;