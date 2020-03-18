const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const CityList = require('../models/cityList');
const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const Employee = require('../models/employee');
const User = require('../models/user');
const auth = require('../middleware/auth');

var fs = require("fs");

const Api = require('../models/apifile');

router.post('/api/test', async(req, res) => {
  try {
    const result = await Api.read();

    console.log('!!!!!!!!!result', result);

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

    res.render('index', {
      title: 'Главная страница | Gazoved',
      isHome: true,
      // page: 'isHome',
      cityList: JSON.stringify(cityList),
      city,
    });
  } catch (e) {
    console.log(e);
  }  
});

router.get('/auth', (req, res) => {
  let key = req.query.key;

  if (key !== '112')
    res.status(404).render('404', {
      layout: 'empty',
      title: 'Страница не найдена'
    });
  
  res.render('auth', {
    title: 'Авторизация',
    isAuth: true,
  })
});

router.post('/auth', async (req, res) => {
  try {
    const {login, password} = req.body;

    if (!login || !password) {
      res.status(203).json({error: 'Произошла ошибка. Попробуйе позже'});
      return;
    }
    const user = await User.findOne({ 
      where: {
        login 
      }
    });

    if (user) {
      const areSame = await bcrypt.compare(password, user.password);

      if (areSame) {
        req.session.user = {login: user.login};
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) {
            res.status(203).json({error: 'Произошла ошибка. Попробуйе позже'});
            throw err
          }
          res.status(200).json({succes: 'Ok'});
        });
      }
      else {
        res.status(203).json({error: 'Не верный пароль'});
      }
    }
    else {
      res.status(203).json({error: 'Не верный логин'});
    }
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка. Попробуйте позже'});
  }
});

router.get('/admin', auth, async(req, res) => {
  try {
    const cityList = await CityList.findAll({raw:true});

    // if (res.locals.isAuth)
    //   delete res.locals.isAuth;

    res.render('admin', {
      isAdmin: true,
      // page: 'isAdmin',
      title: 'Панель управления',
      cityList: JSON.stringify(cityList)
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/admin', auth, async(req, res) => {
  try {
    const city = req.body.city;

    if (!city)
      res.status(203).json({error: 'Город не найден'});

    const result = await CityList.findOne(
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
        ]
      }
    )

    if (!result)
      res.status(203).json({error: 'Город не найден'});

    res.status(200).json(result);
  } catch (e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка'});
  }
});

router.post('/admin/city', auth, async(req, res) => {
  try {
    CityList.create({
      name:   req.body.name,
      brief:  req.body.brief
    })
      .then(async () => {
        const result = await CityList.findAll({raw: true});
      
        res.status(201).json({result});
      });
  } catch (e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/admin/general', auth, async(req, res) => {
  const data = req.body;

  let city = await City.findOne({
    where: {cityListId: data.id}
  });

  if (city) { // Если редактировать информацию
    try {
      Promise.all([
        City.update(
          {
            name2: data.name2,
            email: data.email,
          },
          {
            where: {cityListId: data.id}
          }
        ),
        CityList.update(
          {
            name:  data.city,
            brief: data.brief
          },
          {
            where: {id: data.id}
          }
        )
      ])
        .then(async () => {
          const result = await CityList.findOne({
            where: {id: data.id},
            include: [City]
          });

          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else { // Если добавить новую информацию
    try {
      Promise.all([
        City.create(
          {
            name2:      data.name2,
            email:      data.email,
            cityListId: data.id
          }
        ),
        CityList.update(
          {
            name:  data.city,
            brief: data.brief
          },
          {
            where: {id: data.id}
          }
        )
      ])
        .then(async () => {
          const result = await CityList.findOne({
            where: {id: data.id},
            include: [City],
          });
  
          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.post('/admin/address', auth, async(req, res) => {
  const data = req.body;

  if (data.id) {
    try {
      Address.update({
        address: data.address,
        coords: data.coords
      },
      {
        where: {id: data.id}
      })
        .then(async () => {
          const result = await Address.findAll({
            where: {cityListId: data.cityListId},
          });

          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Address.create({
        address: data.address,
        coords: data.coords,
        cityListId: data.cityListId
      })
      .then(async () => {
        const result = await Address.findAll({
          where: {cityListId: data.cityListId}
        });
      
        res.status(201).json({result});
      });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.delete('/admin/address/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Address.findOne({
      where: {id}
    });

    console.log('result ', result);
    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/admin/social', auth, async(req, res) => {
  const data = req.body;

  if (data.socialId) {
    try {
      Social.update({
        vk: data.vk,
        instagram: data.instagram,
        youtube: data.youtube,
      },
      {
        where: {id: data.socialId}
      })
        .then(async () => {
          const result = await Social.findOne({

            where: {cityListId: data.id},
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Social.create({
        vk: data.vk,
        instagram: data.instagram,
        youtube: data.youtube,
        cityListId: data.id
      })
        .then(async () => {
          const result = await Social.findOne({
            where: {cityListId: data.id}
          });
        
          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});


router.post('/admin/time', auth, async(req, res) => {
  const data = req.body;

  if (data.timeId) {
    try {
      Time.update({
        from: data.from,
        before: data.before,
      },
      {
        where: {id: data.timeId}
      })
        .then(async () => {
          const result = await Time.findOne({
            where: {id: data.timeId},
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Time.create({
        from: data.from,
        before: data.before,
        cityListId: data.id
      })
        .then(async () => {
          const result = await Time.findOne({
            where: {cityListId: data.id}
          });
        
          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.post('/admin/phone', auth, async(req, res) => {
  const data = req.body;

  if (data.phoneId) {
    try {
      Phone.update({
        kod: data.kod,
        number: data.number,
        link: data.link
      },
      {
        where: {id: data.phoneId}
      })
        .then(async () => {
          const result = await Phone.findOne({

            where: {cityListId: data.id},
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Phone.create({
        kod: data.kod,
        number: data.number,
        link: data.link,
        cityListId: data.id
      })
        .then(async () => {
          const result = await Phone.findOne({
            where: {cityListId: data.id}
          });
        
          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});


router.post('/admin/employee/get', auth, async(req, res) => {  
  try {
    const cityId = req.body.cityId;

    const result = await Employee.findAll({
      where: {cityListId: cityId}
    });

    if (!result)
      result = [];

    res.status(201).json({result});
  } catch(e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/admin/employee', auth, async(req, res) => {
  let {originalname} = req.file;
  let data = req.body;

  if (data.id) {
    try {
      Employee.update({
        name: data.name,
        post: data.post,
        experience: data.experience,
        avatar: originalname
      },
      {
        where: {id: data.id}
      })
        .then(async () => {
          const result = await Employee.findOne({
            where: {id: data.id},
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      console.log('city', data.city_list_id);
      Employee.create({
        name: data.name,
        post: data.post,
        experience: data.experience,
        avatar: originalname,
        cityListId: data.city_list_id
      })
        .then(async (result) => {
          // const result = await Employee.findOne({
          //   where: {cityListId: data.city_list_id}
          // });
        
          res.status(201).json({result: result.dataValues});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});


module.exports = router;
