const path = require('path');
const mongoose = require('mongoose');


const express = require('express');
const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const admin_MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const csrfProtection = csrf();
const store = new MongoDBStore({
  uri: admin_MONGO_URI,
  collection: 'sessions'
});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'hardcoded',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    }).catch(err => console.log(err));
});
app.use(errorController.get404);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

mongoose
  .connect(admin_MONGO_URI)
  .then(result => {
    app.listen(
      `${process.env.PORT}`, 
      () => console.log(`This simple app is listening on port ${process.env.PORT}!`));
  })
  .catch(err => {
    console.log(err);
  });
