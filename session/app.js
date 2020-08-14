const path = require('path');
const mongoose = require('mongoose');


const express = require('express');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.set('view engine', 'ejs');
app.set('views', 'views');

const admin_MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});


app.use(errorController.get404);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(
  session({
    secret: 'thePlanetItselfIsTHEsECRET',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);




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
