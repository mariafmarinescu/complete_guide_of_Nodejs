const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  
  res.render('admin/edit-product', {
    isAuthenticated: req.session.isLoggedIn,    
    path: '/admin/add-product',
    pageTitle: 'Add Product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    userId: req.session.user,
    imageUrl: imageUrl,
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
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/admin/edit-product',
        pageTitle: 'Edit Planet',
        editing: editMode,
        product: product
      });
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedImageUrl = req.body.imageUrl;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.imageUrl = updatedImageUrl;
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;

      return product.save();
    })
    .then(result => {
      console.log('Product updated successfully!');
      res.redirect('/admin/products');
    }).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/admin/products',
        prods: products,
        pageTitle: 'Planets - admin'
      });
    }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Product deleted successfully!');
      res.redirect('/admin/products');
    }).catch(err => console.log(err));
};
