const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');

exports.signup = ( req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorData = new Error('Signup failed.');
        errorData.statusCode = 422;
        errorData.data = errors.array();
        throw error;
    };

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => { 
            const user = new User({
                email: email, 
                password: password, 
                name: name
            });
        return user.save();
    }).then( result => {
        res.status(201).json({ 
            message: 'New user was created successfully.',
            userId: result._id
        })
    }).catch( e => {
        if (!e.statusCode) {
            e.statusCode = 500;
        };
        next(e);
    })
};

exports.login = ( req, res, next ) => {
    const email = req.body.email;
    const password = req.body.password;
    let validatedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Invalid e-mail! Try again!');
                error.statusCode = 401;
                throw error;
            };
            validatedUser = user;
            return bcrypt.compare(password, user.password);
        }).then( valid => {
            if (!valid) {
                const error = new Error('Invalid password! Try again!');
                error.statusCode = 401;
                throw error;
            };
            const token = jwt.sign(
                {
                    email: validatedUser.email,
                    userId: validatedUser._id.toString()
                },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );
            res.status(200).json({ token: token, userId: validatedUser._id.toString()});
        }).catch( e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            };
            next(e);
        });

        exports.getUserByStatus = ( req, res, next ) => {
            const status = req.body.status;

            User.findById( req.userId ) 
                .then( user => {
                    if (!user) {
                        const error = new Error('Inexistent user.');
                        error.statusCode = 404;
                        throw error;
                    };
                    user.status = status;
                    return user.save();
                })
                .then( result => {
                    res.status(200).json({ message: 'User successfully updated!'});
                }).catch( e => {
                    if (!e.statusCode) {
                        e.statusCode = 500;
                    };
                    next(e);
                });
        };
}