const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CityList = require('./cityList');
const Address = require('./address');
const Social = require('./social');
const Time = require('./time');
const Phone = require('./phone');
const Employee = require('./employee');

const City = sequelize.define('city', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER
  },
  name2: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

CityList.hasOne(City, { onDelete: "cascade" });
CityList.hasMany(Address, { onDelete: "cascade" });
CityList.hasOne(Social, { onDelete: "cascade" });
CityList.hasOne(Time, { onDelete: "cascade" });
CityList.hasOne(Phone, { onDelete: "cascade" });
CityList.hasMany(Employee, { onDelete: "cascade" });


module.exports = City;
