const path = require('path');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
const admin_MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}`;


const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const isLoggedIn = require("./middleware/isLoggedIn.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const store = new MongoDBStore({
  uri: admin_MONGO_URI,
  collection: 'sessions'
});

app.use(session({
  secret: 'hardcoded secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));


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


mongoose
  .connect(admin_MONGO_URI)
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
