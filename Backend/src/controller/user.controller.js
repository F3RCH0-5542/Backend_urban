// controller/user.controller.js
const Usuario = require("../models/Usuario");
const Rol = require("../models/Rol");
const bcrypt = require("bcrypt");

// ─── READ ───────────────────────────────────────────────────────────────────

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['clave'] },
            order: [['id_usuario', 'ASC']]
        });
        res.json(usuarios);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ msg: "Error al consultar usuarios." });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['clave'] }
        });
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });
        res.json({ usuario });
    } catch (err) {
        console.error("Error al obtener usuario por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};

const obtenerUsuariosConRol = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['clave'] },
            include: [{ model: Rol, attributes: ['id_rol', 'nombre_rol'] }],
            order: [['id_usuario', 'ASC']]
        });
        res.json(usuarios);
    } catch (err) {
        console.error("Error al obtener usuarios con rol:", err);
        res.status(500).json({ msg: "Error al consultar usuarios con roles." });
    }
};

// ─── Helper: excluir clave sin variable no usada ─────────────────────────────
// ✅ SonarQube fix L74/103/130/155: evitar variable '_' no utilizada
const sinClave = (usuarioJson) => {
    const { clave, ...resto } = usuarioJson; // eslint-disable-line no-unused-vars
    return resto;
};

// ─── CREATE ─────────────────────────────────────────────────────────────────

const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, documento, correo, clave, usuario, id_rol } = req.body;

        const existeUsuario = await Usuario.findOne({ where: { correo } });
        if (existeUsuario) return res.status(400).json({ msg: "El correo ya está registrado." });

        const salt = await bcrypt.genSalt(10);
        const claveHasheada = await bcrypt.hash(clave, salt);

        const nuevoUsuario = await Usuario.create({
            nombre, apellido, documento, correo, usuario,
            id_rol: id_rol || 2,
            clave: claveHasheada
        });

        res.status(201).json({
            msg: "Usuario creado exitosamente",
            usuario: sinClave(nuevoUsuario.toJSON())
        });
    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).json({ msg: "Error interno del servidor al crear usuario." });
    }
};

// ─── UPDATE ─────────────────────────────────────────────────────────────────

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

        if (data.clave) {
            const salt = await bcrypt.genSalt(10);
            data.clave = await bcrypt.hash(data.clave, salt);
        } else {
            delete data.clave;
        }

        await usuario.update(data);
        res.json({
            msg: "Usuario actualizado exitosamente",
            usuario: sinClave(usuario.toJSON())
        });
    } catch (err) {
        console.error("Error al actualizar usuario:", err);
        res.status(500).json({ msg: "Error interno del servidor al actualizar usuario." });
    }
};

const actualizarUsuarioParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

        if (data.clave) {
            const salt = await bcrypt.genSalt(10);
            data.clave = await bcrypt.hash(data.clave, salt);
        } else {
            delete data.clave;
        }

        await usuario.update(data);
        res.json({
            msg: "Usuario actualizado parcialmente",
            usuario: sinClave(usuario.toJSON())
        });
    } catch (err) {
        console.error("Error al actualizar usuario (PATCH):", err);
        res.status(500).json({ msg: "Error interno del servidor al actualizar usuario parcialmente." });
    }
};

const toggleEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        // ✅ SonarQube fix L144: Number.parseInt en lugar de parseInt
        if (Number.parseInt(id, 10) === 72) {
            return res.status(403).json({ msg: "No se puede modificar al Superadmin." });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

        await usuario.update({ activo });
        res.json({
            msg: "Estado actualizado",
            usuario: sinClave(usuario.toJSON())
        });
    } catch (err) {
        console.error("Error al cambiar estado:", err);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};

// ─── DELETE ─────────────────────────────────────────────────────────────────

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ SonarQube fix: Number.parseInt en lugar de parseInt
        if (Number.parseInt(id, 10) === 72) {
            return res.status(403).json({ msg: "No se puede eliminar al Superadmin." });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

        await usuario.destroy();
        res.json({ msg: `Usuario con ID ${id} eliminado exitosamente.` });
    } catch (err) {
        console.error("Error al eliminar usuario:", err);
        res.status(500).json({ msg: "Error interno del servidor al eliminar usuario.", error: err.message });
    }
};

// ─── EXPORTS ────────────────────────────────────────────────────────────────

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuariosConRol,
    crearUsuario,
    actualizarUsuario,
    actualizarUsuarioParcial,
    toggleEstadoUsuario,
    eliminarUsuario
};