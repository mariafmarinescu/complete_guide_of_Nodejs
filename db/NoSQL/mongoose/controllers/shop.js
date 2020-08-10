const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products, 
                pageTitle: 'All Planets', 
                path: '/products'
            });
        }.catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product, 
                pageTitle: product.title, 
                path: '/products'
            });
        }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
            .then(cart => {
                return cart
                    .getProducts()
                    .then(products => {
                        res.render('shop/cart', {
                            path: '/cart', 
                            pageTitle: 'Personal Cart', 
                            products: cartProducts
                        });
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user    
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: { id: productId }});
        })
        .then(products => {
            let product;
            if(product.length > 0) {
                product = products[0];
            }
            if(product) {
                const oldQuantity = product.cartItem.quantity;
                const newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findById(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProduct({ where: { id: prodId }});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        }).catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProduct(
                        products.map(product => {
                            product.orderItem = { quatity: product.cartItem.quantity };
                            return product;
                        })
                    );
                }).catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        }).catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] });
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders', 
                pageTitle: 'Personal Orders'
                orders: orders
            });
        }).catch(err => console.log(err));
    
};