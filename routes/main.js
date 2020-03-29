const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");

const CityList = require('../models/cityList');

const reqEmail = require('../emails/request')
const keys = require('../keys');

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 587,
  secure: false,
  auth: {
    user: keys.EMAIL_USER,
    pass: keys.EMAIL_PASSWORD
  }
});


const auth = require('../middleware/auth');


router.get('/test', async(req, res) => {
  const index = fs.readFileSync('./test/index.html');

  res.end(index);
});


router.get('/', async (req, res) => {
  try {
    let city = req.query.city;
    const cityList = await CityList.findAll();
    // const cityList = ['cheboksary', 'kazan', 'nizhny-novgorod', 'yoshkar-ola']; // Список возможных городов

    if (!city || cityList.indexOf(city.toLowerCase()) == -1)
      city = 'cheboksary';

    res.render('main', {
      title: 'Главная страница | Gazoved',
      isHome: true,
      page: 'isHome',
      cityList: JSON.stringify(cityList),
      city,
    });
  } catch (e) {
    console.log(e);
  }  
});

router.post('/mail/request', async (req, res) => {
  try {
    let data = req.body;

    await transporter.sendMail(reqEmail(data));

    res.status(201).json({success: 'Сообщение отправлено'});
  } catch (e) {
    res.status(403).json({error: 'Произошла ошибка. Попробуйте позже'});
  }
});


module.exports = router;
