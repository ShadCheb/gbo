const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');

const cityList = sequelize.define('city_list', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  brief: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

cityList.hasOne(City);
cityList.hasMany(Address);
cityList.hasOne(Social);
cityList.hasOne(Time);
cityList.hasOne(Phone);
cityList.hasMany(Employee);
cityList.hasMany(Equipment);

module.exports = cityList;