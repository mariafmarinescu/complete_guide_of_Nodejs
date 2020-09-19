const express = require('express');
const router = express.Router();

const { body } = require('express-validator/check');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

router.put(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Enter a valid e-mail.')
            .custom((val, { req }) => {
                return User.findOne({ email: val }).then(userData => {
                    if (userData) {
                        return Promise.reject('E-Mail already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 7 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
    '/status',
    isAuth,
    [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.updateUserStatus
);

module.exports = router;
