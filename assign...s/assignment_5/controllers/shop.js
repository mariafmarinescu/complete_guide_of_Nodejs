const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/planet-list', {
        prods: products,
        isAuthenticated: req.session.isloggedin,
        path: '/planets',
        pageTitle: 'All planets'
      })
    }).catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/planet-detail', {
        isAuthenticated: req.session.isloggedin,
        path: '/planets',
        product: product,
        pageTitle: product.title
      });
    }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        isAuthenticated: req.session.isloggedin,
        path: '/',
        prods: products,
        pageTitle: 'Shop'
      });
    }).catch(err => {
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
        isAuthenticated: req.session.isloggedin,
        path: '/cart',
        pageTitle: 'Cart - your planets',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
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
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    }).catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        isAuthenticated: req.session.isloggedin,
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders      
      });
    }).catch(err => console.log(err));
};
