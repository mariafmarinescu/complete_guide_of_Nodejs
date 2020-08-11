const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Planet', 
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
            price: price, 
            imageUrl: imageUrl,
            description: description
    });
        product
            .save()
            .then(result => {
                res.redirect('/admin/products');
            })
            .catch(err => {
                console.log(err);
            });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit this product',
                path: 'admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));        
};


exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    const updatedTitle =  req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const product = new Product(
        updatedTitle,
        updatedPrice,
        updatedDesc,
        updatedImageUrl
    );
    product
        .save()
        .then(result =>{
            console.log('product updated')
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products, 
                pageTitle: "Admin Products",
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log('product deleted successfully');
            res.redirect('/admin/products');
        }).catch(err => console.log(err))
};