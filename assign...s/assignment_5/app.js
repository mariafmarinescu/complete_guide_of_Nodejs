const path = require('path');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
const admin_MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}`;


const express = require('express');
const session = require('client-sessions');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const store = new MongoStore({
  uri: `${process.env.MONGO_CONNECTION_STR}`});


app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(errorController.get404);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
  // async ( req, res ) => {
  // const sessionSecrets = await Store.getSessionSecrets();

  // })( req, res );
// });
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
const sessionHandler = session({
  secret : 'none',
  rolling : true,
  resave : true,
  saveUninitialized : true
  // name: 'session', 
  // secret: 'hardcoded',
  // keys: ['key1', 'key2'],
  // store:  new MongoStore({ 
  //   url: `${process.env.MONGO_CONNECTION_STR}`,
  //   client: `${process.env.MONGO_USER}`,
  //   dbName: `${process.env.DB_NAME}`,
  //   autoRemove: 'disabled'
  // }),
  // cookie: {
  //   secure: true, 
  //   httpOnly: true, 
  //   domain: 'localhost',
  //   path: '/', 
  //   expires: expiryDate,
  // },
});
app.use(sessionHandler);
app.use(express.static('client'));


mongoose
  .connect(`${process.env.MONGO_CONNECTION_STR}`)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'PlanetKing',
          email: 'king@planet.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(
      `${process.env.PORT}`, 
      () => console.log(`This simple app is listening on port ${process.env.PORT}!`));
  })
  .catch(err => {
    console.log(err);
  });

  app.post('/login', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) {
        res.render('login.jade', { error: 'Invalid email or password.' });
      } else {
        if (req.body.password === user.password) {
          res.redirect('/dashboard');
        } else {
          res.render('login.jade', { error: 'Invalid email or password.' });
        }
      }
    });
  });