const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");

const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const Review = require('../models/review');
const ReviewVk = require('../models/review_vk');
const CityList = require('../models/cityList');

// const reqEmail = require('../emails/request');
// const keys = require('../keys');

const detaGeneral = require('../middleware/dataGeneral');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.yandex.ru',
//   port: 587,
//   secure: false,
//   auth: {
//     user: keys.EMAIL_USER,
//     pass: keys.EMAIL_PASSWORD
//   }
// });


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

/* router.post('/mail/request', async (req, res) => {
  try {
    let data = req.body;

    await transporter.sendMail(reqEmail(data));

    res.status(201).json({success: 'Сообщение отправлено'});
  } catch (e) {
    res.status(403).json({error: 'Произошла ошибка. Попробуйте позже'});
  }
}); */

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

router.post('/mail', async (req, res) => {
  const page = req.body.page;
  const btn = req.body.btn;
  const name = req.body.name;
  const phone = req.body.phone;
  const message = req.body.message;
  const type = req.body.type;
  const description = req.body.description;
  const city = req.body.city;
  const cityList = (city)
    ? await CityList.findAll({brief: city})
    : await CityList.findOne();

  if (!cityList) {
    res.status(500).json({error: 'Произошла ошибка. Попробуйте позже'}); 

    return;
  }

  let email = cityList.email;

  if (!email)
    email = 'vas.box@mail.ru';

	let output = `
    <p>Пришла новая заявка.</p>
    <hr />
  `;

  if (page)
    output += `<p><b>Заявка отправлена со страницы:</b> ${page}</p>`
  if (btn)
    output += `<p><b>При нажатии кнопки:/b> ${btn}</p>`
  if (message)
    output += `<p><b>Сообщение от посетителя сайта:</b> ${message}</p>`;
  if (type)
    output += `<p><b>Тип заявки:</b> ${type}</p>`;
  if (description)
    output += `<p><b>Описание заявки:</b> ${description}</p>`;
  if (name)
    output += `<br /><p><b>Имя отправителя:</b> ${name}</p>`
  if (phone)
    output += `<p><b>Телефон отправителя:</b> ${phone}</p>`


  let transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
        user: 't3.t3st@yandex.ru',
        pass: 'rapira15'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 't3.t3st@yandex.ru', // sender address
    to: email,
    subject: 'Сообщение с сайта Gazoved', // Subject line
    // text: 'Hello world?', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({error: 'Произошла ошибка. Попробуйте позже'}); 

      return;
    }

    // console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.status(201).json({success: 'Сообщение отправлено. Ждите звонка'}); 
  });
});



module.exports = router;
