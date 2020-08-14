const getUser = require('./getUserFromToken');


module.exports = function setCurrentUser( req, res, next ) {
    const token = req.header('authorization');
    const user = getUserFromToken(token)
                .then(user => {
                    req.user = user;
                    next();
                }).catch(err => console.log(err));
};


