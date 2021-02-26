const {Router} = require('express');
const router = Router();

const detaGeneral = require('../middleware/dataGeneral');


router.get('/', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service', {
    title: 'Услуги | Gazoved ' + data.name,
    isServices: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

router.get('/metan', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service-item', {
    title: 'ГБО Метан | Gazoved ' + data.name,
    isMetan: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

router.get('/dizel', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service-item', {
    title: 'Газодизель | Gazoved ' + data.name,
    isDizel: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

router.get('/registration', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service-item', {
    title: 'Регистрация ГБО | Gazoved ' + data.name,
    isRegister: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

router.get('/variator', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service-item', {
    title: 'Вариатор | Gazoved ' + data.name,
    isVariator: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

router.get('/propan', detaGeneral, (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('service-item', {
    title: 'Пропан | Gazoved ' + data.name,
    isPropan: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief
  });
});

module.exports = router;