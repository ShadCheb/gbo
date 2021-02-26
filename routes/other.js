const {Router} = require('express');
const router = Router();

const detaGeneral = require('../middleware/dataGeneral');

const CityList = require('../models/cityList');
const Work = require('../models/work');


router.get('/stock', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('page', {
    title: 'Акции | Gazoved ' + data.name,
    isStock: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief,
  });
});

router.get('/stock/friend', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('page', {
    title: 'Акция приведи друга | Gazoved ' + data.name,
    isStockItem: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief,
  });
});

router.get('/contact', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('page', {
    title: 'Контакты | Gazoved ' + data.name,
    isContact: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief,
  });
});

router.get('/work', detaGeneral, async (req, res) => {
  let page = (req.query.page)
    ? Number(req.query.page)
    : 1;
  const countPage = 8;
  let {cityList, data} = res.locals.dataGeneral;
  const dataPage = await Work.findAll({
    order: [[ 'id', 'DESC']],
    offset: (page - 1) * countPage,
    limit: countPage,
    raw: true
  });
    
  let countAll = 0;
  
  if (res.locals.countWork) {
    countAll = res.locals.countWork;
  } else {
    await Work.count()
      .then(result => {
        countAll = result;
        res.locals.countWork = result;
      })
  }

  data['countAll'] = countAll;
  data['pages'] = Math.ceil(countAll / countPage);
  data['page'] = page;
  data['works'] = dataPage;
  // data = Object.assign(data, dataPage);

  res.render('page', {
    title: 'Наши работы | Gazoved ' + data.name,
    isWork: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief,
  });
});

router.get('/work/:id', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;
  let idWork = req.params.id;  
  let dataPage = null;
  
  try {
    dataPage = await Work.findOne(
      {
        where: {id: idWork}
      }
    )
      .then(result => {
        return (result) 
          ? result.get({plain: true})
          : null;
      });
    } catch (e) {      
      res.status(404).render('404'), {
        title: 'Страница не найдена'
      }

      return;
    }

  if (!dataPage || !dataPage.id) {
    res.status(404).render('404'), {
      title: 'Страница не найдена'
    }

    return;
  }

  dataPage['nameWork'] = dataPage['name'] || '';
  dataPage['name'] = data['name'] || '';
  dataPage['established'] = dataPage['established'] && dataPage['established'].split(',') || [];
  dataPage['additionally'] = dataPage['additionally'] && dataPage['additionally'].split(',') || [];
  dataPage['gallery'] = dataPage['gallery'] && dataPage['gallery'].split(',') || [];

  data = Object.assign(data, dataPage);

  res.render('page', {
    title: (dataPage.nameWork || 'Без названия') + ' | Gazoved ' + data.name, // Подставить название машины
    isWorkItem: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data),
    city: data.brief,
  });
});


module.exports = router;
