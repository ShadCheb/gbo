const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const fs = require("fs");
const rp = require('request-promise');

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


function getUrl(url, params) {
  if (!url || typeof params !== 'object') return;  

  let uri = url;
  let count = 0;

  for(let i in params) {
    let p = (count === 0) ? '?' : '&';

    if(params[i]) {
      uri += `${p}${i}=${params[i]}`;
      count++;
    }
  }
  count = 0;

  return encodeURI(uri);
}


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
  try {
    const { page, btn, name, phone, 
      message, type, description, brand, issue,
      power, birth, addres, number__passport, from__passport } = req.body;
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
    if (power)
      output += `<p><b>Мощность:</b> ${power}</p>`;
    if (issue)
      output += `<p><b>Год выпуска:</b> ${issue}</p>`;
    if (name)
      output += `<br /><p><b>Имя отправителя:</b> ${name}</p>`;
    if (phone)
      output += `<p><b>Телефон отправителя:</b> ${phone}</p>`; 
  
    if (birth)
      output += `<p><b>Дата рождения:</b> ${birth}</p>`;
    if (addres)
      output += `<p><b>Адрес регистрации:</b> ${addres}</p>`;
    if (number__passport)
      output += `<p><b>Серия и номер паспорта:</b> ${number__passport}</p>`;
    if (from__passport)
      output += `<p><b>Кем и когда выдан:</b> ${from__passport}</p>`;
  
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
      res.status(201).json({success: 'Сообщение отправлено. Ждите звонка', info, err: error, sendRequest: 'success' });
  
      // Отправка успешного запроса на стороний сервис Calltouch
      const numberServer = 16;
      const siteId = 41294;
      const url1 = `https://api-node${numberServer}.calltouch.ru/calls-service/RestAPI/requests/${siteId}/register/`;
      const params1 = {
        subject: type || btn,
        fio: name || 'Без имени',
        phoneNumber: phone,
        comment: description,
        tags: city,
        requestUrl: page,
        sessionId: 'ei1ijzpa'
      };
      const uri1 = getUrl(url1, params1);
      const optionsCall = {
        method: 'GET',
        uri: uri1
      };
      rp(optionsCall)
        .then(function (parsedBody) {
          console.log('Calltouch_Success', parsedBody);
        })
        .catch(function (err) {
          console.log('Calltouch_error', err);
        });
  
      // Отправка успешного запроса на стороний сервис
      const url2 = 'https://hub.6crm.ru/gazoved/site/server.php';
      const params2 = {
        page,
        btn,
        name,
        phone,
        message,
        type,
        description,
        brand,
      };
      const uri2 = getUrl(url2, params2);
      const options = {
        method: 'GET',
        uri: uri2,
      };
  
      rp(options)
        .then(function (parsedBody) {
          console.log('parsedBody', parsedBody);
        })
        .catch(function (err) {
          console.log('err', err);
        });
  
  
      // Отправка post amocrm Ufa
      const optionsAmo = {
        method: 'POST',
        uri: 'http://soyuzavto72.ru/gazoved',
        body: {
          page,
          btn,
          name,
          phone,
          type,
          description
        },
        json: true
      };
  
      rp(optionsAmo)
        .then(function (parsedBody) {
          console.log('SendAmocrmUfa', parsedBody);
        })
        .catch(function (err) {
          console.log('ErrorAmocrmUfa', err);
        });
    });
    
  } catch (e) {
    console.log('Error.', e.message);
  }
});



module.exports = router;
