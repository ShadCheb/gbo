const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Composition = require('../models/composition');

const Equipment = sequelize.define('equipment', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  tagline: {
    type: Sequelize.STRING
  },
  summary: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  cylinder: {
    type: Sequelize.STRING
  },
}, {
  timestamps: false
});

Equipment.hasMany(Composition);

module.exports = Equipment;