const express = require('express');
const router = express.Router();
const User = require('../dao/models/usersModels.js');
const upload = require("../middlewares/upload.js");
const mongoose = require("mongoose")


router.post('/:uid/documents', upload.array('documents'), async (req, res) => {
    const { uid } = req.params;
    const uploadedFiles = req.files; // Archivos subidos por Multer

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Procesar los archivos subidos y actualizar el usuario
        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                // Aquí podrías almacenar la información del archivo en tu base de datos
                // Por ejemplo, podrías guardar el nombre del archivo y su ubicación en `user.documents`
                user.documents.push({
                    name: file.originalname,
                    reference: '/uploads/documents/' + file.filename // Ruta donde se guarda el archivo
                });
            });

            // Actualizar el estado del usuario para indicar que ha subido documentos
            user.documents_uploaded = true;

            // Guardar los cambios en el usuario
            await user.save();
        }

        res.status(200).json({ message: 'Archivos subidos exitosamente', user });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/premium/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const userId = mongoose.Types.ObjectId.createFromHexString(uid);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.documents || user.documents.length !== 3) {
            return res.status(400).json({ error: 'El usuario no ha terminado de procesar su documentación' });
        }

        if (user.role === 'usuario') {
            user.role = 'premium';
            await user.save();
            return res.status(200).json({ message: `Rol cambiado a ${user.role}` });
        } else {
            return res.status(400).json({ error: 'El usuario ya es premium' });
        }
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
