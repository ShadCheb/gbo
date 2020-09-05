const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");

const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const Review = require('../models/review');
const ReviewVk = require('../models/review_vk');
const CityList = require('../models/cityList');
// const City = require('../models/city');
const Composition = require('../models/composition');
const Images = require('../models/images');

const emails = require('../emails/emails');

const detaGeneral = require('../middleware/dataGeneral');


router.get('/', detaGeneral,  async (req, res) => {
  try {
    let {cityList, data, subdomains} = res.locals.dataGeneral;
    let dataPage = await CityList.findOne(
      {
        where: {brief: data.brief},
        include: [
          { model: Employee },
          { 
            model: Equipment,
            include: [{
              model: Composition,
              include: [Images],
              order: [ [ 'composition_id', 'ASC' ] ]
            }],
          },
          { model: Review, 
            order: [[ 'id', 'DESC']],
            limit: 5 
          },
          { model: ReviewVk }
        ]
      }
    )
      .then(result => result.get({plain:true}));

    data = Object.assign(data, dataPage);

    res.render('main', {
      title: 'GAZOVED | Установка ГБО за один день в г. ' + data.name,
      isHome: true,
      cityList: JSON.stringify(cityList),
      data: JSON.stringify(data),
      subdomains: subdomains && JSON.stringify(subdomains)
    });
  } catch (e) {
    console.log(e);
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

router.post('/mail', async (req, res) => {
  const { page, btn, name, phone, 
    message, type, description, brand, issue } = req.body;
  const { name: city, brief } = req.session.dataGeneral.data;
  let { email } = req.session.dataGeneral.data.city;
  let emailData = emails.default;

  if (!email)
    email = 'gazoved21@mail.ru';

	let output = `
    <p>Пришла новая заявка.</p>
    <hr />
  `;

  if (city)
    output += `<p><b>Город:</b> ${city}</p>`
  if (page)
    output += `<p><b>Заявка отправлена со страницы:</b> ${page}</p>`;
  if (btn)
    output += `<p><b>При нажатии кнопки:</b> ${btn}</p>`;
  if (message)
    output += `<p><b>Сообщение от посетителя сайта:</b> ${message}</p>`;
  if (type)
    output += `<p><b>Тип заявки:</b> ${type}</p>`;
  if (description)
    output += `<p><b>Описание заявки:</b> ${description}</p>`;
  if (brand)
    output += `<p><b>Марка автомобиля:</b> ${brand}</p>`;
  if (issue)
    output += `<p><b>Год выпуска:</b> ${issue}</p>`;
  if (name)
    output += `<br /><p><b>Имя отправителя:</b> ${name}</p>`;
  if (phone)
    output += `<p><b>Телефон отправителя:</b> ${phone}</p>`; 

  if (emails[brief]) {
    emailData = emails[brief];
  }

  let transporter = nodemailer.createTransport({
    host: emailData.host,
    port: emailData.port,
    secure: true,
    auth: {
      user: emailData.user,
      pass: emailData.pass
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
    from: emailData.user,
    to: email,
    subject: 'Сообщение с сайта Gazoved',
    html: output // html body
  }; 

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json({error: 'Произошла ошибка. Попробуйте позже', info, err: error}); 

      return;
    }

    res.status(201).json({success: 'Сообщение отправлено. Ждите звонка', info, err: error});
  });
});



module.exports = router;
