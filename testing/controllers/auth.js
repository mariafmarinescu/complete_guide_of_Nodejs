const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');

exports.signup = async ( req, res, next ) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    const error = new Error('Failed validation.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  };
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const hashed = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashed,
      name: name
    });

    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });

  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    };
    next(e);
  }
};

exports.login = async ( req, res, next ) => {
  let validatedUser;

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('E-mail not found.');
      error.statusCode = 401;
      throw error;
    };

    validatedUser = user;
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: validatedUser.email,
        userId: validatedUser._id.toString()
      },
      process.env.SECRET,
      { expiresIn: '3h' }
    );
    res.status(200).json({ token: token, userId: validatedUser._id.toString() });
    return;
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
    return e;
  }
};

exports.getUserStatus = async ( req, res, next ) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Inexistent user.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  };
};

exports.updateUserStatus = async ( req, res, next ) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Inexistent user.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  };
};
