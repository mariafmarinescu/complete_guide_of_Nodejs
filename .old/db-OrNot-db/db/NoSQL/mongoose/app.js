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

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);

// app.use((req, res, next) => {
//   User.findById('5f35529cfdb51b152ffd559f')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });



const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@planetcluster.4uagb.mongodb.net/${process.env.DB_NAME}?rpoolSize=20&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true })
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
      };
    })
    app.listen(`${process.env.PORT}`, () => console.log(`This simple app is listening on port ${process.env.PORT}!`));
  }).catch(err => console.log(err));
