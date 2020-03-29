const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user');

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

module.exports = router;