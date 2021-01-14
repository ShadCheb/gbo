const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const CityList = require('../models/cityList');


module.exports = async function(req, res, next) {
  try {
    let city = req.query.city;
    let cityList = [];
    let subdomain = '';
    const domain = (req.get('host').includes('localhost'))
      ? 'localhost:8000'
      : 'gazoved.com';

    res.cookie('city', '', {
      expires: new Date(0)
    });

    res.cookie('test', 'test0', {
      domain: 'test.com',
      maxAge: 3600 * 365 * 30,
    });
    
    if (req.get('host').includes('localhost')) {
      const subdomainGroup = (req.get('host')).match(/(www\.*)*([a-zA-Z0-9-]*)(\.*localhost){1}(:[0-9]+){1}/);

      subdomain = subdomainGroup && subdomainGroup[2] || '';
    } else {
      const subdomainGroup = (req.get('host')).match(/(www\.*)*([a-zA-Z0-9-]*)(\.*gazoved.com){1}/);

      subdomain = subdomainGroup && subdomainGroup[2] || '';
    }

    if (subdomain) {
      const { brief } = await CityList.findOne({ 
        where: { subdomain },
        attributes: ['brief'],
        raw: true
      });

      city = (brief) ? brief : city;
    }

    if (!city) {
      if (req.session && req.session.city) {
        city = req.session.city;
      } else if (req.cookies && req.cookies.city) {
        city = req.cookies.city;
        req.session.city = city;
      }
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
        maxAge: 3600 * 365 * 30,
        domain: `.${domain}`
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
          where: { brief: city },
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
        subdomain
      };
      req.session.dataGeneral = res.locals.dataGeneral;
      req.session.city = city;

      res.cookie('city', city, {
        maxAge: 3600 * 365 * 30,
        domain: `.${domain}`
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