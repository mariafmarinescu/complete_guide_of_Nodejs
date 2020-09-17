const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/product');
const Order = require('../models/order');
const ITEMS_PER_PAGE = 2;

exports.getProducts = ( req, res, next ) => {
    Product.find()
        .then(products => {
            console.log(products);
            res.render('shop/product-list', {
            path: '/products',
            prods: products,
            pageTitle: 'All Planets'
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = ( req, res, next ) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                path: '/products',
                pageTitle: product.title,
                product: product
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = ( req, res, next ) => {
    let totalItems;
    const page = req.query.page;

    Product.find()
        .count()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/index', {
                path: '/',
                pageTitle: 'Planet Shop',
                prods: products,
                totalProducts: totalItems,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                nextPage: page + 1,
                previousPage: page - 1
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCart = ( req, res, next ) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Cart - Planet Shop',
            products: products
        });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCart = ( req, res, next ) => {
    const prodId = req.body.productId;
    
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCartDeleteProduct = ( req, res, next ) => {
    const prodId = req.body.productId;
    
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postOrder = ( req, res, next ) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
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
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getOrders = ( req, res, next ) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getInvoice = ( req, res, next ) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then(order => {
            if(!order) {
                return next(new Error('Planet order not found.'));
            }
            if(order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Access denied!'));
            }
            const pdfDoc = new PDFDocument();
            const invoiceName = `invoice-${orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            );

            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(22).text('Planet Invoice', {
                underline: false
            });
            pdfDoc.text('=============================');

            let totalPrice = 0;

            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
                    );
            });
            pdfDoc.text('=============');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
            pdfDoc.end();
        }).catch(err => next(err));
};
