const path = require('path');
const express = require('express');

const router = express.Router();

let users = [];

router.get('/', (req, res, next) => {
    res.render('users', { pageTitle: 'Add user now!' });
});

router.get('/users', (req, res, next) => {
    res.render('users', { pageTitle: 'Only active users of users', users: users });
});

router.post('/add-user', (err, req, res, next) => {
    if (res.status(500)) {
        res.status(500).send('Something broke!');
        res.render('error', { error: err });
    }
    users.push({ name: req.body.username });
    res.redirect('/users');
    next(err);
});


module.exports = router;
