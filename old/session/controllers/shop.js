const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = ( req, res ) => {
  Product.find()
    .then(products => {

      res.render('shop/planet-list', {
        isAuthenticated: req.session.isLoggedIn,
        prods: products,
        pageTitle: 'All planets',
        path: '/planets'
      });
      
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = ( req, res ) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {

      res.render('shop/planet-detail', {
        isAuthenticated: req.session.isLoggedIn,
        product: product,
        pageTitle: product.title,
        path: '/planets'
      });
    }).catch(err => console.log(err));
};

exports.getIndex = ( req, res ) => {

  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;

      res.render('shop/cart', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/cart',
        pageTitle: 'Cart - your planets',
        products: products
      });
    }).catch(err => console.log(err));
};

exports.postCart = ( req, res ) => {
  const prodId = req.body.productId;
  
  Product.findById(prodId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      console.log('A new cart has been made! ' + result.toString());
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {

      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });

      const order = new Order({
        user: {
          userId: req.user,
          name: req.user.name
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {

      res.redirect('/orders');

    }).catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {

      res.render('shop/orders', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });

    }).catch(err => console.log(err));
};
