const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.NODEMAILER_API
        }
    })
);

exports.getLogin = ( req, res, next ) => {
    let message = req.flash('error');

    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        errorMessage: message, 
        pageTitle: 'Login - Planet Shop'
    });
};

exports.getSignUp = ( req, res, next ) => {
    let message = req.flash('error');

    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        errorMessage: message,
        pageTitle: 'Signup - Planet Shop'
    });
};

exports.postLogin = ( req, res, next ) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;

    if(!errors.isEmpty()) {
        res.render('auth/login', {
            path: '/login',
            errorMessage: errors.array()[0].msg, 
            pageTitle: 'Login - Planet Shop'
        });
    }

    User.findOne({ email: email })
        .then(user => {
            if(!user) {
                req.flash('error', 'Wrong credentials!')
                res.render('/login');
            };
        })
            bcrypt
                .compare(password, user.password)
                .then(match => {
                    if(match) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Wrong credentials!');
                    res.redirect('/login');
                }).catch(err => {
                    console.log(err);
                    res.redirect('/login');
                }).catch(err => console.log(err));
};



exports.postSignup = ( req, res, next ) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;

    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            pageTitle: 'Signup - Planet Shop',
        });
    }

    bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email, 
            password: hashedPassword, 
            cart: { items: []}
        });
        return user.save();
    })
    .then(result => {
        res.redirect('/login')
        return transporter.sendMail({
            to: email, 
            from: 'shop@planet.univ',
            subject: 'Find your your planet!',
            html: '<h2>You successfully created an account to the best planet shop!<h2>'
        });
    }).catch(err => console.log(err));
}

exports.postLogout = ( req, res, next ) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = ( req, res, next ) => {
    let message = req.flash('error');

    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset', 
        errorMessage: message,
        pageTitle: 'Password reset - Planet Shop'
    })
}

exports.postReset = ( req, res, next ) => {
    crypto.randomBytes(32, ( err, buffer ) => {
        const token = buffer.toString('hex');

        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }


        User.findOne({email: req.body.email})
            .then(user => {
                if(!user) {
                    req.flash('error', 'You need to signup!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 604800;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendEmail({
                to: req.body.email, 
                from: 'shop@planet.univ',
                subject: 'Reset password - Planet Shop ',
                html: `
                <h2>Password reset</h2>
                <p>Click it <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`
                });
            }).catch(err => {
                console.log(err);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password - Planet Shop',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  
exports.postNewPassword = (req, res, next) => {
    let resetUser;
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken;
  
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};
  