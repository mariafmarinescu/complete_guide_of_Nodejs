const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login', 
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('IDnumber') //todo : find whaaat is this
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
}