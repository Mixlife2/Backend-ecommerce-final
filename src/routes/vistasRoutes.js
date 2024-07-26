const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const User = require("../dao/models/usersModels.js");
const Product = require("../dao/models/productModels.js");
const CartService = require("../services/cartServices.js")
const userDTO = require ("../dto/UserDTO.js")


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
        const usuario = req.session.usuario;
        
        console.log('Datos del usuario antes de renderizar:', usuario); // Verifica aquí

        res.status(200).render("productos", {
            productos, usuario
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send("Error al obtener productos");
    }
});





// src/routes/vistasRoutes.js
router.get('/carrito', auth(['user', 'admin']), async (req, res) => {
    try {
        const carrito = await CartService.getCartWithProducts({ userId: req.session.usuario._id });
        const usuario = req.session.usuario;

        res.render('carrito', { carrito, usuario });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).send("Error al obtener el carrito: " + error.message);
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
