const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('Your valid email address is required!.')
            .normalizeEmail(),
        body('password', 'THE valid password is required!')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);

router.post('/signup', 
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(( value, {req} ) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if(userDoc) {
                        return Promise.reject(
                            'We found an account with the same email address, so think at a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body('password','Password with least 7 characters.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom(( value, { req } ) => {
                if(value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
        })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;