const {Router} = require('express');
const router = Router();
const axios = require('axios');

const CityList = require('../models/cityList');
const City = require('../models/city');
const Address = require('../models/address');
const Social = require('../models/social');
const Time = require('../models/time');
const Phone = require('../models/phone');
const Employee = require('../models/employee');
const Equipment = require('../models/equipment');
const Review = require('../models/review');
const ReviewVk = require('../models/review_vk');
const Work = require('../models/work');

const {TOKEN_VK} = require('../keys/index');

const auth = require('../middleware/auth');

router.get('/', auth, async(req, res) => {
  try {
    const cityList = await CityList.findAll({raw:true});

    res.render('admin', {
      isAdmin: true,
      page: 'isAdmin',
      title: 'Панель управления',
      cityList: JSON.stringify(cityList)
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/', auth, async(req, res) => {
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
    );

    if (!result)
      res.status(203).json({error: 'Город не найден'});

    res.status(200).json(result);
  } catch (e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка'});
  }
});

router.post('/city', auth, async(req, res) => {
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

router.post('/general', auth, async(req, res) => {
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

router.post('/address', auth, async(req, res) => {
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

router.delete('/address/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Address.findOne({
      where: {id}
    });

    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/social', auth, async(req, res) => {
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

router.post('/time', auth, async(req, res) => {
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

router.post('/phone', auth, async(req, res) => {
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

router.post('/employee/get', auth, async(req, res) => {  
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

router.post('/employee', auth, async(req, res) => {
  let data = req.body;

  if (data.id) {
    try {
      Employee.update({
        name: data.name,
        post: data.post,
        experience: data.experience,
        avatar: data.avatar
      },
      {
        where: {id: data.id}
      })
        .then(async () => {
          const result = await Employee.findAll({
            where: {cityListId: data.city_list_id}
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Employee.create({
        name: data.name,
        post: data.post,
        experience: data.experience,
        avatar: data.avatar,
        cityListId: data.city_list_id
      })
        .then(async () => {
          const result = await Employee.findAll({
            where: {cityListId: data.city_list_id}
          });

          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.delete('/employee/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Employee.findOne({
      where: {id}
    });

    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/equipment/get', auth, async(req, res) => {  
  try {
    const cityId = req.body.cityId;

    const result = await Equipment.findAll({
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

router.post('/equipment', auth, async(req, res) => {
  let data = req.body;

  if (data.id) {
    try {
      Equipment.update({
        name: data.name,
        description: data.description,
        cylinder: data.cylinder
      },
      {
        where: {id: data.id}
      })
        .then(async () => {
          const result = await Equipment.findAll({
            cityListId: data.city_list_id
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Equipment.create({
        name: data.name,
        description: data.description,
        cylinder: data.cylinder,
        cityListId: data.city_list_id
      })
        .then(async () => {
          const result = await Equipment.findAll({
            where: {cityListId: data.city_list_id}
          });

          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.delete('/equipment/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Equipment.findOne({
      where: {id}
    });

    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/review/vk', auth, async(req, res) => {
  let {groupId, topicId} = req.body;

  if (!groupId || !topicId)
    res.status(201).json({error: 'Введены не все данные'});

  try {
    const count = '30';
    const extended = 1;
    const sort = 'desc';
    const version = '5.87';
    const query = `https://api.vk.com/method/board.getComments?group_id=${groupId}&topic_id=${topicId}&count=${count}&sort=${sort}&extended=${extended}&access_token=${TOKEN_VK}&v=${version}`;

    axios.post(query)
      .then(result => {
        res.status(201).json({result: result.data});
      })
      .catch(e => {
        console.log('Error! ', e);
        res.status(500).json({error: 'Произошла ошибка ' + e});
      });
  } catch(e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка ' + e});
  }
});

router.post('/review/get', auth, async(req, res) => {  
  try {
    const cityId = req.body.cityId;
    const result = await CityList.findOne({
      where: {id: cityId},
      include: [
        { model: ReviewVk },
        {
          model: Review,
          order: [ [ 'id', 'DESC' ] ],
          limit: 5
        }
      ]
    });

    if (!result)
      result = {
        review_vk: null,
        reviews: []
      };

    res.status(201).json({result});
  } catch(e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.post('/review_vk', auth, async(req, res) => {
  let data = req.body;

  if (data.id) {
    try {  
      ReviewVk.update({
        id_group: data.groupId,
        id_token: data.topicId,
      },
      { where: {id: data.id} })    
        .then(() => {
          res.status(203).json({});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {  
      ReviewVk.create({
        id_group: data.groupId,
        id_token: data.topicId,
        cityListId: data.cityListId
      })    
        .then(() => {
          res.status(203).json({});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.post('/review', auth, async(req, res) => {
  let data = req.body;
  let result = {}

  try {
    Review.create({
      name: data.profile.name,
      review: data.text,
      date: data.date,
      avatar: data.profile.avatar,
      id_com: data.id_com,
      cityListId: data.city_list_id
    })    
      .then(async () => {
        result = await Review.findAll({
          where: {cityListId: data.city_list_id},
          order: [[ 'id', 'DESC']],
          limit: 5
        });

        res.status(201).json({result});
      });
  } catch (e) {
    console.log('Error! ', e);
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});

router.delete('/review/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Review.findOne({
      where: {id}
    });

    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});


router.post('/work/get', auth, async(req, res) => {  
  try {
    const cityId = req.body.cityId;

    const result = await Work.findAll({
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

router.post('/work', auth, async(req, res) => {
  let data = req.body;

  if (data.id) {
    try {
      Work.update({
        name: data.name,
        mileage: data.mileage,
        saving: data.saving,
        avatar: data.avatar,
        established: data.established,
        additionally: data.additionally,
        gallery: data.gallery
      },
      {
        where: {id: data.id}
      })
        .then(async () => {
          const result = await Work.findAll({
            cityListId: data.city_list_id
          });

          res.status(201).json({result});
        });
    } catch(e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  } else {
    try {
      Work.create({
        name: data.name,
        avatar: data.avatar,
        established: data.established,
        additionally: data.additionally,
        gallery: data.gallery,
        cityListId: data.city_list_id
      })
        .then(async () => {
          const result = await Work.findAll({
            where: {cityListId: data.city_list_id}
          });

          res.status(201).json({result});
        });
    } catch (e) {
      console.log('Error! ', e);
      res.status(500).json({error: 'Произошла ошибка' + e});
    }
  }
});

router.delete('/work/:id', auth, async(req, res) => {
  try {
    const id = +req.params.id;
    const result = await Work.findOne({
      where: {id}
    });

    await result.destroy();
    res.status(204).json({});
  } catch (e) {
    res.status(500).json({error: 'Произошла ошибка' + e});
  }
});


module.exports = router;