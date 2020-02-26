const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
  let city = req.query.city;
  const cityList = ['cheboksary', 'kazan', 'nizhny-novgorod', 'yoshkar-ola']; // Список возможных городов

  if (!city || cityList.indexOf(city.toLowerCase()) == -1)
    city = 'cheboksary';

  res.render('index', {
    title: 'Главная страница | Gazoved',
    isHome: true,
    city
  })
});


module.exports = router;