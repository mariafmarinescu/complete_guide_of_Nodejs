const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const routes = require('./routes/routes');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

let users = [];

app.get('/', (req, res, next) => {
    res.render('users', { pageTitle: 'Add user now!' });
});

app.get('/users', (req, res, next) => {
    res.render('users', { pageTitle: 'Only active users of users', users: users });
});

app.post('/add-user', (err, req, res, next) => {
    if (res.status(500)) {
        res.status(500).send('Something broke!');
        res.render('error', { error: err });
    } else {
        users.push({ username: req.body.username });
        res.redirect('/users');
    }

});



app.listen(3000, () => console.log('This simple app is listening on port 3000!'));