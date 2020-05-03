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
    data: JSON.stringify(data)
  });
});

router.get('/contact', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;

  res.render('page', {
    title: 'Контакты | Gazoved ' + data.name,
    isContact: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/work', detaGeneral, async (req, res) => {
  let page = (req.query.page)
    ? req.query.page
    : 1;
  const countPage = 8;
  let {cityList, data} = res.locals.dataGeneral;
  let dataPage = await CityList.findOne(
    {
      where: {brief: data.brief},
      include: [
        { model: Work, 
          order: [[ 'id', 'DESC']],
          offset: (page - 1) * countPage,
          limit: countPage 
        }
      ]
    }
  )
    .then(result => {
      return result.get({plain:true})
    });
    
  let countAll = 0;
  
  if (res.locals.countWork) {
    countAll = res.locals.countWork;
  } else {
    await Work.count(
      {
        where: {cityListId: data.id}
      }
    )
      .then(result => {
        countAll = result;
        res.locals.countWork = result;
      })
  }

  data['countAll'] = countAll;
  data['pages'] = Math.ceil(countAll / countPage);
  data['page'] = page;
  data = Object.assign(data, dataPage);

  res.render('page', {
    title: 'Наши работы | Gazoved ' + data.name,
    isWork: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});

router.get('/work/:id', detaGeneral, async (req, res) => {
  let {cityList, data} = res.locals.dataGeneral;
  let idWork = req.params.id;  
  let dataPage = await Work.findOne(
    {
      where: {id: idWork}
    }
  )
    .then(result => {
      return result.get({plain:true})
    });

  if (!dataPage || !dataPage.id) {
    res.status(404).render('404'), {
      title: 'Страница не найдена'
    }
  }

  dataPage['nameWork'] = dataPage['name'];
  dataPage['name'] = data['name'];
  dataPage['established'] = dataPage['established'] && dataPage['established'].split(',') || [];
  dataPage['additionally'] = dataPage['additionally'] && dataPage['additionally'].split(',') || [];
  dataPage['gallery'] = dataPage['gallery'] && dataPage['gallery'].split(',') || [];

  data = Object.assign(data, dataPage);

  res.render('page', {
    title: (dataPage.nameWork || 'Без названия') + ' | Gazoved ' + data.name, // Подставить название машины
    isWorkItem: true,
    cityList: JSON.stringify(cityList),
    data: JSON.stringify(data)
  });
});


module.exports = router;
