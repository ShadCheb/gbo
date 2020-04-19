const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const CityList = require('../models/cityList');


module.exports = async function(req, res, next) {
  try {
    let city = req.query.city;
    const cityList = await CityList.findAll({attributes: [ 'id', 'name', 'brief' ], raw: true});
    
    if (!cityList || !cityList.length) {
      res.status(201).render('not-data'), {
        title: 'Нет данных'
      }

      return;
    }

    if (!city && req.session.city) {
      city = req.session.city;
    } else if (!city && (req.cookies && req.cookies['city'])) {
      city = req.cookies['city'];
      req.session.city = city;
    }

    if (!city) {
      city = cityList[0].brief;

      res.cookie('city', city);
      req.session.city = city;
    }

    if (city != req.session.city || !req.session.dataGeneral) { 
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
      req.session.dataGeneral = res.locals.dataGeneral;
    } else {
      res.locals.dataGeneral = req.session.dataGeneral;
    }

    req.session.city = city;

    next();
  } catch (e) {
    res.status(201).render('not-data'), {
      title: 'Нет данных'
    }
  }
}