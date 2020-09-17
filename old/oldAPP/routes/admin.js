const path = require('path');
const express = require('express');
const router = express.Router();


const { body } = require('express-validator/check');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const { isString } = require('util');


router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', 
    [
        body('title')
            .isString()
            .isLength({ min: 11 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({ min: 7, max: 222 })
            .trim()
    ],
    isAuth, 
    adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 11 })
            .trim(),
        body('price')
            .isFloat(),
        body('description')
            .isString()
            .isLength({ min: 7, max: 222 })
            .trim()
    ],
    isAuth, 
    adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
