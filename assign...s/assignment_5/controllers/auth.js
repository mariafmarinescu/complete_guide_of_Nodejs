const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    isAuthenticated: false,
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.postLogin = (req, res, next) => {
  if (!req.session.user) {
    const user = new User({
      name: 'PlanetKing',
      email: 'king@planet.com',
      cart: {
        items: []
      }
    });
    user.save();
  } else {
      User.find(req.session.user)
        .then(user => {
          req.session.isloggedin = true;
          req.session.user = user;
          res.redirect('/');
        }).catch(err => console.log(err));
  };
};
