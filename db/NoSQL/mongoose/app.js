const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  prodId = req.user.prodId;
  User.findById(prodId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.PASS}@cluster0.zj50u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`  )
  .then(result => {
    prodId = req.user.prodId;
    User.findOne(prodId).then(user => {
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
