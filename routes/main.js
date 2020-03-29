const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');

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

var fs = require("fs");

const Api = require('../models/apifile');

router.post('/api/test', async(req, res) => {
  try {
    const result = await Api.read();

    res.status(201).json({result});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.put('/api/test', async(req, res) => {
  try {
    let data = req.body;
    const api = new Api(data);

    await api.save(data);

    res.status(201).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});


router.get('/test', async(req, res) => {
  // res.render('../test/index');
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
