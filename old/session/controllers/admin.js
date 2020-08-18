const Product = require('../models/product');


exports.getAddProduct = ( req, res ) => {

  res.render('admin/edit-planet', {
    pageTitle: 'Add Planet',
    path: '/admin/add-planet',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });

};

exports.postAddProduct = ( req, res ) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    userId: req.user,
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
  });

  product
    .save()
    .then(result => {
      console.log('A new planet was created!');
      res.redirect('/admin/planets');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = ( req, res ) => {
  const editMode = req.query.edit;
  const prodId = req.params.productId;

  if (!editMode) {
    return res.redirect('/');
  }
  
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-planet', {
        isAuthenticated: req.session.isLoggedIn,
        pageTitle: 'Edit Planet',
        path: '/admin/edit-planet',
        editing: editMode,
        product: product
      });

    }).catch(err => console.log(err));
};

exports.postEditProduct = ( req, res ) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.imageUrl = updatedImageUrl;

      return product.save();
    })
    .then(result => {

      console.log('A product got updated!');
      res.redirect('/admin/planets');

    }).catch(err => console.log(err));
};

exports.getProducts = ( req, res ) => {
  Product.find()
    .then(products => {
      console.log(products);

      res.render('admin/planets', {
        prods: products,
        pageTitle: 'Admin Planets',
        path: '/admin/planets',
        isAuthenticated: req.session.isLoggedIn
      });

    }).catch(err => console.log(err));
};

exports.postDeleteProduct = ( req, res ) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {

      console.log('A product was deleted!');
      res.redirect('/admin/planets');

    }).catch(err => console.log(err));
};
