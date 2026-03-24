// controller/pqrs.controller.js
const { Pqrs } = require("../models");

const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Obtener todos los PQRS
const obtenerPqrs = async (req, res) => {
    try {
        const pqrs = await Pqrs.findAll({
            order: [['fecha_solicitud', 'DESC']]
        });
        res.json(pqrs);
    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).json({ msg: "Error al obtener PQRS", error: err.message });
    }
};

// Obtener PQRS por ID
const obtenerPqrsPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const pqrs = await Pqrs.findByPk(id);
        if (!pqrs) return res.status(404).json({ msg: "PQRS no encontrado" });
        res.json(pqrs);
    } catch (err) {
        res.status(500).json({ msg: "Error al obtener PQRS", error: err.message });
    }
};

// Crear PQRS
const crearPqrs = async (req, res) => {
    try {
        const { tipo_pqrs, descripcion, nombre, correo, estado, respuesta, id_usuario } = req.body;

        if (!nombre || !correo || !tipo_pqrs || !descripcion) {
            return res.status(400).json({
                msg: "Campos obligatorios: nombre, correo, tipo_pqrs, descripcion"
            });
        }

        const nuevoPqrs = await Pqrs.create({
            nombre: nombre.trim(),
            correo: correo.trim(),
            tipo_pqrs: capitalize(tipo_pqrs),
            descripcion: descripcion.trim(),
            estado: estado || 'Pendiente',
            id_usuario: id_usuario || null,
            respuesta: respuesta || ''
        });

        res.status(201).json({
            msg: "PQRS creada exitosamente",
            id_pqrs: nuevoPqrs.id_pqrs,
            pqrs: nuevoPqrs
        });
    } catch (err) {
        console.error("❌ Error al crear PQRS:", err.message);
        res.status(500).json({ msg: "Error al crear PQRS", error: err.message });
    }
};

// Actualizar PQRS
const actualizarPqrs = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_pqrs, descripcion, estado, respuesta, nombre, correo } = req.body;

        const pqrs = await Pqrs.findByPk(id);
        if (!pqrs) return res.status(404).json({ msg: "PQRS no encontrado" });

        const datos = {};
        if (nombre)                  datos.nombre      = nombre.trim();
        if (correo)                  datos.correo      = correo.trim();
        if (tipo_pqrs)               datos.tipo_pqrs   = capitalize(tipo_pqrs);
        if (descripcion)             datos.descripcion = descripcion.trim();
        if (estado)                  datos.estado      = estado;
        if (respuesta !== undefined) datos.respuesta   = respuesta.trim();

        await pqrs.update(datos);
        res.json({ msg: "PQRS actualizada exitosamente", pqrs });
    } catch (err) {
        res.status(500).json({ msg: "Error al actualizar PQRS", error: err.message });
    }
};

// Eliminar PQRS
const eliminarPqrs = async (req, res) => {
    try {
        const { id } = req.params;
        const pqrs = await Pqrs.findByPk(id);
        if (!pqrs) return res.status(404).json({ msg: "PQRS no encontrado" });

        await pqrs.destroy();
        res.json({ msg: "PQRS eliminada exitosamente" });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar PQRS", error: err.message });
    }
};

// Responder PQRS (solo admin)
const responderPqrs = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta, estado } = req.body;

        if (!respuesta || respuesta.trim() === '') {
            return res.status(400).json({ msg: "La respuesta no puede estar vacía." });
        }

        const pqrs = await Pqrs.findByPk(id);
        if (!pqrs) return res.status(404).json({ msg: "PQRS no encontrada." });

        await pqrs.update({
            respuesta: respuesta.trim(),
            estado: estado || 'Resuelto',
            fecha_respuesta: new Date()
        });

        res.json({
            msg: "PQRS respondida exitosamente",
            pqrs
        });
    } catch (err) {
        console.error("❌ Error al responder PQRS:", err.message);
        res.status(500).json({ msg: "Error al responder PQRS", error: err.message });
    }
};

module.exports = {
    obtenerPqrs,
    obtenerPqrsPorId,
    crearPqrs,
    actualizarPqrs,
    eliminarPqrs,
    responderPqrs,
};