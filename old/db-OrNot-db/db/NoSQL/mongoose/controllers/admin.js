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
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    const product = new Product({
            title: title,
            price: price, 
            imageUrl: imageUrl,
            description: description,
            userId: req.user
    });
    product
        .save()
        .then(result => {
            console.log('Product successfully created!')
            res.redirect('/admin/products');
         })
            .catch(err => {
                console.log(err);
                throw err;
            });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit this planet',
                path: 'admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });        
};


exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId;
    const updatedTitle =  req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result =>{
            console.log('Product successfully updated!')
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
            throw err;
        });        
};


exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                prods: products, 
                pageTitle: "Admin Planets",
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};


exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('Product successfully deleted!');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
            throw err;
        });
};