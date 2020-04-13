const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const CityList = require('../models/cityList');

module.exports = async function(req, res, next) {
  try {
    let city = req.query.city;
    const cityList = await CityList.findAll();

    if (!city || cityList.indexOf(city.toLowerCase()) == -1)
      city = 'cheboksary';

    /*
    if (!city || cityList.indexOf(city.toLowerCase()) == -1) {
      res.status(201).render('not-data'), {
        title: 'Нет данных'
      }
    }
    */
    
    let data = await CityList.findOne(
      {
        where: {brief: city},
        include: [
          { model: City },
          {
            model: Address,
            as: 'addresses'
          },
          { model: Social }, 
          { model: Time }, 
          { model: Phone },
        ]
      }
    )
      .then(result => result.get({plain:true}));

    if (!data || !data.id) {
      res.status(201).render('not-data'), {
        title: 'Нет данных'
      }
    }

    res.locals.dataGeneral = {
      data,
      cityList
    };
  } catch (e) {
    res.status(201).render('not-data'), {
      title: 'Нет данных'
    }
  }

  next();
}