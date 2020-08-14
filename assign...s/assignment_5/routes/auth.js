const path = require('path');
const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// const isLoggedIn = require("../middleware/isLoggedIn.js");


router.get('/login', authController.getLogin);

router.post('/login',  authController.postLogin);


module.exports = router;
