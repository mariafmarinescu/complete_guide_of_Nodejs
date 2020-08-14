exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found. No planet in here, leave this strange place!', path: '/404'})
};