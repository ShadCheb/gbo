const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");

const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const Review = require('../models/review');
const ReviewVk = require('../models/review_vk');
const CityList = require('../models/cityList');

const reqEmail = require('../emails/request');
const keys = require('../keys');

const detaGeneral = require('../middleware/dataGeneral');

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

router.get('/', detaGeneral,  async (req, res) => {
  try {
    let {cityList, data} = res.locals.dataGeneral;
    let dataPage = await CityList.findOne(
      {
        where: {brief: data.brief},
        include: [
          { model: Employee },
          { model: Equipment },
          { model: Review, 
            order: [[ 'id', 'DESC']],
            limit: 5 
          },
          { model: ReviewVk },
          { model: Equipment },
        ]
      }
    )
      .then(result => result.get({plain:true}));

    data = Object.assign(data, dataPage);

    res.render('main', {
      title: 'Главная страница | Gazoved ' + data.name,
      isHome: true,
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
