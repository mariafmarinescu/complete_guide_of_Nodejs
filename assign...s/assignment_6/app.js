const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const dotenv = require('dotenv');
dotenv.config();

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const admin_MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cookieParser());


app.options( '*', cors({
  origin: ['*'],
  method: ['GET'],
  maxAgeSeconds: 3600
}));

const store = new MongoDBStore({
  uri: admin_MONGO_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: ( req, file, cb ) => {
    cb(null, 'images');
  },
  filename: ( req, file, cb ) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = ( req, file, cb ) => {
  if (
    file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: `${process.env.secret}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: 'session',
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    },
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use(( req, res, next ) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    }).catch(err => {
      next(new Error(err));
    });
});

app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(( error, req, res, next ) => {
  res.status(500).render('500', {
    path: '/500',
    pageTitle: 'Error!',
    isAuthenticated: req.session.isLoggedIn
  });
});


mongoose
  .connect(admin_MONGO_URI)
  .then(result => {
    app.listen(
      `${process.env.PORT}`, 
      () => console.log(`This simple app is listening on port ${process.env.PORT}!`));
  }).catch(err => {
    console.log(err);
  });
