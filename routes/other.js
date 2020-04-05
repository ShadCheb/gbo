const {Router} = require('express');
const router = Router();

const CityList = require('../models/cityList');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');

router.get('/stock', async (req, res) => {
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

  res.render('page', {
    title: 'Акции | Gazoved ' + (data && data.name || ''),
    isStock: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/contact', async (req, res) => {
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

  res.render('page', {
    title: 'Контакты | Gazoved ' + (data && data.name || ''),
    isContact: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/work', async (req, res) => {
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

  res.render('page', {
    title: 'Наши работы | Gazoved ' + (data && data.name || ''),
    isWork: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/work/:id', async (req, res) => {
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

  res.render('page', {
    title: 'Наши работы | Gazoved ' + (data && data.name || ''), // Подставить название машины
    isWorkItem: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});


module.exports = router;
