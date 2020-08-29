const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Images = require('./images');

const Composition = sequelize.define('composition', {
  composition_id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER
  },
  composition_type: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

Composition.hasOne(Images, { foreignKey: 'item_id' });

module.exports = Composition;