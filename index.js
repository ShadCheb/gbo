const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session')
const csrf = require('csurf');
const sequelize = require('./utils/database');

const varMiddleware = require('./middleware/variables');
const error404 = require('./middleware/404');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys');

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const serviceRoutes = require('./routes/service');
const otherRoutes = require('./routes/other');
const testRoutes = require('./routes/test');

const PORT = 3005;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
});

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Для теста (времено)
app.use('/', testRoutes);

app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(fileMiddleware.single('filedata'));
app.use(csrf());
app.use(varMiddleware);

app.use('/', mainRoutes);
app.use('/', otherRoutes);
app.use('/services', serviceRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use(error404);

async function start() {
  try {
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();