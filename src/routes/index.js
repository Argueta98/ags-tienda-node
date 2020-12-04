const router = require('express').Router();
const fs = require('fs');
var Cart = require('../models/car');
var Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/productos', (req, res, next) => {
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('productos', {
            title: 'Carro De Compras',
            products: productChunks,
        });
    });

});

router.get('/add/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/productos');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/productos');
    });
});

//agregar a carrito
router.get('/cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'Carro De Compras',
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
});
//eliminar
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});



//Rutas directas
router.get('/', (req, res) => {
    res.render('index.hbs');
});

router.get('/nosotros', (req, res) => {
    res.render('nosotros.hbs');
});

/*router.get('/productos', (req, res) => {
  res.render('productos.hbs');
});*/

router.get('/carrito', (req, res) => {
    res.send('Carrito');
});

router.get('/contactenos', (req, res) => {
    res.render('contactenos.hbs');
});

router.get('/blog', (req, res) => {
    res.render('blog.hbs');
});



module.exports = router;