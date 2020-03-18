const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb(null, './images')
    cb(null, path.join(__dirname + '/../images'));
    // cb(null, path.join(__dirname,".","images", file.originalname));
  },
  filename(req, file, cb) {
    let name = Math.floor(Math.random() * Math.floor(99999)) + '_' + file.originalname;

    cb(null, name)
  }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage, fileFilter
})