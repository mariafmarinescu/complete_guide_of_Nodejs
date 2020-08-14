const path = require('path');
const express = require('express');

const isLoggedIn = require("../middleware/isLoggedIn.js");

const router = express.Router();


const adminController = require('../controllers/admin');


router.get('/add-planet', adminController.getAddProduct);

router.get('/planets', adminController.getProducts);

router.post('/add-planet', adminController.postAddProduct);

router.get('/edit-planet/:productId', adminController.getEditProduct);

router.post('/edit-planet', adminController.postEditProduct);

router.post('/delete-planet', adminController.postDeleteProduct);

module.exports = router;

