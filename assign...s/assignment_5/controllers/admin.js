const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {

  res.render('admin/edit-planet', {
    isAuthenticated: req.session.isloggedin ? true : false,
    pageTitle: 'Add Planet',
    path: '/admin/add-planet',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    userId: req.session.user,
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  });
  
  product
    .save()
    .then(result => {
      console.log('A product was just created!');
      res.redirect('/admin/products');
    })
    .catch(err => {
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
      res.render('admin/edit-planet', {
        isAuthenticated: req.session.isloggedin ? true : false,
        pageTitle: 'Edit Planet',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
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
    .then(result => {
      console.log('A product got updated!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {

  Product.find()
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        isAuthenticated:req.session.isloggedin ? true : false,
        prods: products,
        pageTitle: 'Admin Planets',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('A product was deleted!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
