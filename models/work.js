const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const work = sequelize.define('work', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  established: {
    type: Sequelize.TEXT
  },
  additionally: {
    type: Sequelize.TEXT
  },
  gallery: {
    type: Sequelize.TEXT
  },
  mileage: {
    type: Sequelize.INTEGER
  },
  saving: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  }
}, {
  timestamps: false
})

module.exports = work;