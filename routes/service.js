const {Router} = require('express');
const router = Router();

const CityList = require('../models/cityList');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');


router.get('/', async (req, res) => {
  let city = req.query.city;
  const cityList = await CityList.findAll();

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  const data = await CityList.findOne(
    {
      where: {brief: city},
      include: [
        {
          model: Address,
          as: 'addresses'
        },
        { model: Social }, 
        { model: Time }, 
        { model: Phone }
      ]
    }
  );

  res.render('service', {
    title: 'Услуги | Gazoved ' + data.name,
    isServices: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/metan', async (req, res) => {
  let city = req.query.city;
  const cityList = await CityList.findAll();

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  const data = await CityList.findOne(
    {
      where: {brief: city},
      include: [
        {
          model: Address,
          as: 'addresses'
        },
        { model: Social }, 
        { model: Time }, 
        { model: Phone }
      ]
    }
  );

  res.render('service-item', {
    title: 'ГБО Метан | Gazoved ' + data.name,
    isMetan: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/dizel', async (req, res) => {
  let city = req.query.city;
  const cityList = await CityList.findAll();

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  const data = await CityList.findOne(
    {
      where: {brief: city},
      include: [
        {
          model: Address,
          as: 'addresses'
        },
        { model: Social }, 
        { model: Time }, 
        { model: Phone }
      ]
    }
  );

  res.render('service-item', {
    title: 'Газодизель | Gazoved ' + data.name,
    isDizel: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/registration', async (req, res) => {
  let city = req.query.city;
  const cityList = await CityList.findAll();

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  const data = await CityList.findOne(
    {
      where: {brief: city},
      include: [
        {
          model: Address,
          as: 'addresses'
        },
        { model: Social }, 
        { model: Time }, 
        { model: Phone }
      ]
    }
  );

  res.render('service-item', {
    title: 'Регистрация ГБО | Gazoved ' + data.name,
    isRegistration: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/variator', async (req, res) => {
  let city = req.query.city;
  const cityList = await CityList.findAll();

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  const data = await CityList.findOne(
    {
      where: {brief: city},
      include: [
        {
          model: Address,
          as: 'addresses'
        },
        { model: Social }, 
        { model: Time }, 
        { model: Phone }
      ]
    }
  );

  res.render('service-item', {
    title: 'Вариатор | Gazoved ' + data.name,
    isVariator: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

module.exports = router;