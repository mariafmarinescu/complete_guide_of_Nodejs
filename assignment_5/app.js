const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_URI = `mongodb+srv://cluster0.zj50u.mongodb.net/${process.env.DB_NAME} --username theUser`;

const dotenv = require('dotenv');
dotenv.config();

const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: MONGO_URI, 
  collection: 'sessions'
})

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'any secret', //TODO: what secreet man
    resave: false, 
    saveUnitialized: false, 
    store: store
  })
);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);



mongoose
  .connect(MONGO_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Test',
          email: 'testy@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(`${process.env.PORT}`, () => console.log(`This simple app is listening on port ${process.env.PORT}!`));
  })
  .catch(err => {
    console.log(err);
  });
  
