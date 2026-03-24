const { Router } = require("express");
const { 
  obtenerUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  actualizarUsuarioParcial,
  eliminarUsuario, 
  obtenerUsuarioPorId,
  toggleEstadoUsuario,
} = require("../controller/user.controller");
const { validarToken, soloSuperAdmin, soloAdmin, propietarioOSuperAdmin } = require("../middlewares/auth.middleware");
const bcrypt = require("bcrypt");

const router = Router();

// ── PERFIL (usuario autenticado) ────────────────────────────────────────────

router.get("/perfil", validarToken, async (req, res) => {
    try {
        const { Usuario, Rol } = require("../models");
        const usuario = await Usuario.findByPk(req.userId, {
            attributes: { exclude: ['clave'] },
            include: [{ model: Rol, attributes: ['nombre_rol'] }]
        });
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });
        res.json(usuario);
    } catch (err) {
        console.error("Error al obtener perfil:", err);
        res.status(500).json({ msg: "Error al consultar perfil.", error: err.message });
    }
});

router.put("/perfil", validarToken, async (req, res) => {
    try {
        const { Usuario } = require("../models");
        const { nombre, apellido } = req.body;
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });
        const datosActualizar = {};
        if (nombre) datosActualizar.nombre = nombre.trim();
        if (apellido) datosActualizar.apellido = apellido.trim();
        await usuario.update(datosActualizar);
        const { clave: _, ...usuarioActualizado } = usuario.toJSON();
        res.json({ msg: "Perfil actualizado exitosamente", usuario: usuarioActualizado });
    } catch (err) {
        console.error("Error al actualizar perfil:", err);
        res.status(500).json({ msg: "Error al actualizar perfil.", error: err.message });
    }
});

router.put("/cambiar-contrasena", validarToken, async (req, res) => {
    try {
        const { Usuario } = require("../models");
        const { clave_actual, clave_nueva } = req.body;
        if (!clave_actual || !clave_nueva) {
            return res.status(400).json({ msg: "Se requieren ambas contraseñas." });
        }
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });
        const esValida = await bcrypt.compare(clave_actual, usuario.clave);
        if (!esValida) return res.status(401).json({ msg: "Contraseña actual incorrecta." });
        const salt = await bcrypt.genSalt(10);
        const claveHasheada = await bcrypt.hash(clave_nueva, salt);
        await usuario.update({ clave: claveHasheada });
        res.json({ msg: "Contraseña actualizada exitosamente" });
    } catch (err) {
        console.error("Error al cambiar contraseña:", err);
        res.status(500).json({ msg: "Error al cambiar contraseña.", error: err.message });
    }
});

// ── ADMIN: CRUD completo ────────────────────────────────────────────────────

// Ver todos — soloAdmin permite rol 1 y rol 3
router.get("/", validarToken, soloAdmin, obtenerUsuarios);

// Ruta de prueba admin
router.get("/admin", validarToken, soloSuperAdmin, (req, res) => {
    res.json({ msg: "Bienvenido superadmin", user: req.userId });
});

// Ver uno (dueño o admin)
router.get("/:id", validarToken, propietarioOSuperAdmin, obtenerUsuarioPorId);

// Crear — soloAdmin puede, pero admin limitado (rol 3) solo puede crear rol 2
router.post("/", validarToken, soloAdmin, (req, res, next) => {
    if (req.rolId === 3 && req.body.idRol !== 2) {
        return res.status(403).json({ msg: "Solo puedes crear usuarios con rol de cliente." });
    }
    next();
}, crearUsuario);

// Actualizar — soloAdmin puede editar
router.put("/:id", validarToken, soloAdmin, actualizarUsuario);
router.patch("/:id", validarToken, soloAdmin, actualizarUsuarioParcial);

// Toggle activo/inactivo — soloAdmin puede
router.patch("/:id/status", validarToken, soloAdmin, toggleEstadoUsuario);

// Eliminar — solo superAdmin puede eliminar
router.delete("/:id", validarToken, soloSuperAdmin, eliminarUsuario);

module.exports = router;