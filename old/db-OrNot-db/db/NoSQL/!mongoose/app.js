const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorsController = require('./controllers/errors');
const mongo = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5baa2528563f16379fc8a610')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

mongo(client => {
    console.log(client);
    app.listen(3000, () => console.log('This simple app is listening on port 3000!'));
})
