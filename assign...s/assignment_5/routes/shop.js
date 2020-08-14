const path = require('path');
const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

const isLoggedIn = require("../middleware/isLoggedIn.js");



router.get('/', shopController.getIndex);

router.get('/planets', shopController.getProducts);

router.get('/planets/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-planet', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);


module.exports = router;

