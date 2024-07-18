const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const User = require("../dao/models/usersModels.js")

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
