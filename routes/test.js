const {Router} = require('express');
const router = Router();

const Api = require('../models/apifile');

router.post('/api/test', async(req, res) => {
  try {
    const result = await Api.read();

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

module.exports = router;