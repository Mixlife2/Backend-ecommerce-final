const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const User = require("../dao/models/usersModels.js");
const Product = require("../dao/models/productModels.js");
const CartMongoDAO = require("../dao/cartMongoDAO.js")

router.get('/', (req, res) => {
    res.status(200).render('home', { login: req.session.usuario });
});

router.get("/chat", auth(['user', 'admin']), (req, res) => {
    res.render("chat", { login: req.session.usuario });
});

router.get('/registro', (req, res) => {
    let { error, mensaje } = req.query;
    res.status(200).render('registro', { error, mensaje, login: req.session.usuario });
});

router.get('/login', (req, res) => {
    res.status(200).render('login', { login: req.session.usuario });
});

router.get('/productos', auth(['usuario', 'admin', 'premium']), async (req, res) => {
    try {
        const productos = await Product.find({});
        res.render('productos', { productos, login: req.session.usuario });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send("Error al obtener productos");
    }
});

router.get('/carrito', auth(['usuario', 'admin', 'premium']), async (req, res) => {
    try {
        // Asegúrate de que el usuario tenga una sesión activa
        if (!req.session || !req.session.usuario) {
            return res.redirect('/login'); // Redirige al login si no hay sesión activa
        }

        // Obtener el ID del carrito del usuario desde la sesión o base de datos
        const carritoId = req.session.usuario.cart;
        if (!carritoId) {
            return res.status(404).send("Carrito no encontrado");
        }

        // Buscar el carrito en la base de datos y popular los productos
        let carrito = await CartMongoDAO.getOneByPopulate({_id: carritoId});
        if (!carrito) {
            return res.status(404).send("Carrito no encontrado");
        }

        // Renderizar la vista del carrito con los datos necesarios
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render("carrito", { usuario: req.session.usuario, carrito });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/perfil', auth(['user', 'admin']), async (req, res) => {
    
    let usuario = req.userDTO;
    if (!usuario) {
        return res.redirect('/login');
    }
    // Si el usuario es administrador, obtener la lista de usuarios
    let users = [];
    if (usuario.role === 'admin') {
        try {
            users = await User.find({}, 'first_name last_name email role').exec();
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    }

    res.status(200).render('perfil', { usuario, users, login: req.session.usuario });
});


module.exports = router;
