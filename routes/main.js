const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");

const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const CityList = require('../models/cityList');

const reqEmail = require('../emails/request');
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


// Для тест-задания
router.get('/test', async(req, res) => {
  const index = fs.readFileSync('./test/index.html');

  res.end(index);
});

router.get('/', async (req, res) => {
  try {
    let city = req.query.city;
    const cityList = await CityList.findAll();

    if (!city || cityList.indexOf(city.toLowerCase()) == -1)
      city = 'cheboksary';
    
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
          { model: Employee },
          { model: Equipment }
        ]
      }
    );

    res.render('main', {
      title: 'Главная страница | Gazoved ' + (data && data.name || ''),
      isHome: true,
      page: 'isHome',
      cityList: JSON.stringify(cityList),
      data: JSON.stringify(data)
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

router.post('/upload', async (req, res) => {
  try {
    let filedata = req.file;
    
    if(!filedata)
        res.status(403).json({error: 'Произошла ошибка. Попробуйте позже'});
    else
      res.status(201).json({success: filedata}); // Выводим в результате файл
  } catch (e) {
    res.status(403).json({error: 'Произошла ошибка. Попробуйте позже'});
  }
});



module.exports = router;
