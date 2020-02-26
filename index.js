const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session')
const csrf = require('csurf');

const varMiddleware = require('./middleware/variables')
const keys = require('./keys')

const mainRoutes = require('./routes/main');

const PORT = 3000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(csrf());
app.use(varMiddleware);

app.use('/', mainRoutes);

function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running in port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();