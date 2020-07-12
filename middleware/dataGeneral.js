const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const CityList = require('../models/cityList');

const subdomainData = {
  cheb: 'cheboksary',
  'n-cheb': 'new.cheb',
  ufa: 'ufa',
  'yoshkarola': 'yoshkarola',
  'n-novgorod': 'Nizhnii-Novgorod'
}


module.exports = async function(req, res, next) {
  try {
    let city = req.query.city;
    let cityList = [];

    // Присутствует данные домена (gazoved.com)
    // const domain = 'gazoved.com';
    // const domain = 'localhot\:8000';
    // const regStr = /(www\.*)*([a-zA-Z0-9-]*)(\.*{gazoved.com}){1}/;
    // const regStr = new RegExp(`(www\.*)*([a-zA-Z0-9-]*)(\.*${domain}){1}`);
    const subdomains = (req.get('host')).match(/(www\.*)*([a-zA-Z0-9-]*)(\.*gazoved.com){1}/);

    if (subdomains && subdomains[2] && subdomainData[subdomains[2]]) {
      let { brief } = await CityList.findOne({where: {subdomain: subdomains[2]}, attributes: ['brief'], raw: true});

      city = (brief) ? brief : city;
    }

    if (!city && req.session.city) {
      city = req.session.city;
    } else if (!city && (req.cookies && req.cookies['city'])) {
      city = req.cookies['city'];
      req.session.city = city;
    }

    if (!city) {
      cityList = await CityList.findAll({attributes: [ 'id', 'name', 'brief', 'subdomain' ], raw: true});
    
      if (!cityList || !cityList.length) {
        res.status(201).render('not-data'), {
          title: 'Нет данных'
        }

        return;
      }

      city = cityList[0].brief;

      res.cookie('city', city, {
        maxAge: 3600 * 365 * 30
      });
      req.session.city = city;
    }

    if (city != req.session.city || !req.session.dataGeneral) { 
      cityList = await CityList.findAll({attributes: [ 'id', 'name', 'brief', 'subdomain' ], raw: true});
    
      if (!cityList || !cityList.length) {
        res.status(201).render('not-data'), {
          title: 'Нет данных'
        }

        return;
      }

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
        .then(result => result.get({plain: true}));

      if (!data || !data.id) {
        res.status(201).render('not-data'), {
          title: 'Нет данных'
        }
      }

      if (data.time) {
        data.time.from = data.time.from.slice(0, -3);
        data.time.before = data.time.before.slice(0, -3);
      }

      res.locals.dataGeneral = {
        data,
        cityList,
        subdomains
      };
      req.session.dataGeneral = res.locals.dataGeneral;
      req.session.city = city;
      res.cookie('city', city, {
        maxAge: 3600 * 365 * 30
      });
    } else {
      res.locals.dataGeneral = req.session.dataGeneral;
    }

    next();
  } catch (e) {
    console.log(e);
    res.status( 201).render('not-data'), {
      title: 'Нет данных'
    }
  }
}