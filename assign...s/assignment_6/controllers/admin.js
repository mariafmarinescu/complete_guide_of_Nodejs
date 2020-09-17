const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/product');



exports.getAddProduct = ( req, res, next ) => {
    res.render('admin/edit-product', {
        path: '/admin/edit-product',
        pageTitle: 'Add Planet',
        editing: false
    });
};

exports.postAddProduct = ( req, res, next ) => {
    const image = req.body.imageUrl;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    

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
        }).catch(err => console.log(err));
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
                pageTitle: 'Edit Planet',
                editing: editMode, 
                product: product
            });
        }).catch(err => console.log(err));
};



exports.postEditProduct = ( req, res, next ) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;


    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;

            if(product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            return product.save().then(result => {
                console.log('Product updated successfully!');
                res.redirect('admin/products')
            });
        }).catch(err => console.log(err));
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
        }).catch(err => console.log(err));
};


exports.postDeleteProduct = ( req, res, next ) => {
    const prodId = req.body.productId;

    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(() => {
            console.log('Product deleted successfully!');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
};
