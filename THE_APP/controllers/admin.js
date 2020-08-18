const { validationResult } = require('express-validator/check');
const fileHelper = require('../util/file');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/product');



exports.getAddProduct = ( req, res, next ) => {
    res.render('admin/edit-product', {
        path: '/admin/edit-product',
        validationErrors: [],
        errorMessage: false, 
        hasError: false, 
        pageTitle: 'Add Planet',
        editing: false
    });
};



exports.postAddProduct = ( req, res, next ) => {
    const image = req.body.file;
    const imageUrl = image.path;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);


    if(!image) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            errorMessage: 'This file is not an image! Please upload a planet image!',
            validationErrors: [],
            pageTitle: 'Add Planet',
            hasError: false, 
            product: {
                title: title, 
                price: price, 
                description: description
            },
            editing: false
        });
    }


    if(!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            errorMessage: errors.array()[0].msg,
            pageTitle: 'Add Planet', 
            hasError: true, 
            product: {
                title: title, 
                price: price, 
                description: description
            }, 
            editing: false
        });
    }

    const product = new Product({
        userId: req.user, 
        imageUrl = imageUrl, 
        title: title,
        price: price,
        description: description
    });
    product
        .save()
        .then(result => {
            console.log('Product created successfully!');
            res.redirect('/admin/products');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};



exports.getEditProduct = ( req, res, next ) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;

    if(!editMode) {
        return res.redirect('/');
    }
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', {
                path: '/admin/edit-product',
                errorMessage: null, 
                validationErrors: [], 
                pageTitle: 'Edit Planet',
                hasError: false, 
                editing: editMode, 
                product: product
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode(500);
            return next(error);
        });
};



exports.postEditProduct = ( req, res, next ) => {
    const prodId = req.body.productId;
    const image = req.file;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/edit-product',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            pageTitle: 'Edit Planet',
            asError: true,
            product: {
                _id: prodId,
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
            },
        });
    }

    Product.findById(prodId)
        .then(product => {

            if(product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }

            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;

            if(image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }

            return product.save().then(result => {
                console.log('Product updated successfully!');
                res.redirect('admin/products')
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};



exports.getProducts = ( req, res, next ) => {
    Product.find({userId: req.user._id})
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                path: '/admin/products',
                prods: products, 
                pageTitle: 'Admin - planets'
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode =  500;
            return next(error);
        });
};


exports.postDeleteProduct = ( req, res, next ) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return next(new Error('Not Found!'));
            }
            fileHelper.deleteFile(product.imageUrl);

            return Product.deleteOne({_id: prodId, userId: req.user._id});
        })
        .then(() => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
