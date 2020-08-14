const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  if (!user) {
    const user = new User({
      name: 'PlanetKing',
      email: 'king@planet.com',
      cart: {
        items: []
      }
    });
    user.save();
  } else {

  }
  User.find(req.user)
    .then(user => {
      req.session.isloggedin = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
