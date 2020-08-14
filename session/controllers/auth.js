const User = require('../models/user');

exports.getLogin = ( req, res ) => {
  const isLoggedIn = req.get('Cokkie').split(';')[1].trim().split('=')[1] === 'true';

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });

  console.log(req.session.isLoggedIn);
};

exports.postLogin = ( req, res ) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};
