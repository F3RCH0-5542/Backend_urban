const express = require('express');
const router = express.Router();
const {
    obtenerPqrs,
    obtenerPqrsPorId,
    crearPqrs,
    actualizarPqrs,
    eliminarPqrs,
    responderPqrs,
} = require('../controller/pqrs.controller');
const { validarToken, soloSuperAdmin } = require('../middlewares/auth.middleware');

// ✅ USUARIO: ver sus propias PQRS
router.get("/mis-pqrs", validarToken, async (req, res) => {
    const { Pqrs } = require("../models");
    try {
        const pqrs = await Pqrs.findAll({
            where: { id_usuario: req.userId },
            order: [['fecha_solicitud', 'DESC']]
        });
        res.json(pqrs);
    } catch (err) {
        console.error("Error mis-pqrs:", err);
        res.status(500).json({ msg: "Error al obtener PQRS", error: err.message });
    }
});

// PÚBLICO: crear PQRS sin login
router.post('/', crearPqrs);

// ADMIN: ver todas
router.get('/',       validarToken, soloSuperAdmin, obtenerPqrs);
router.get('/:id',    validarToken, soloSuperAdmin, obtenerPqrsPorId);
router.put('/:id',    validarToken, soloSuperAdmin, actualizarPqrs);
router.delete('/:id', validarToken, soloSuperAdmin, eliminarPqrs);
router.post('/:id/responder', validarToken, soloSuperAdmin, responderPqrs);

module.exports = router;