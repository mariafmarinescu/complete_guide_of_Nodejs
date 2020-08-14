exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    isAuthenticated: req.session.isloggedin ? true : false,
    pageTitle: 'Page Not Found',
    path: '/404',
  });
};
