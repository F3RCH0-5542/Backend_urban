const Rol = require("../models/Rol");
const { Usuario } = require("../models");
const { Op } = require("sequelize");

// R: READ - Obtener todos los roles
const obtenerRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll({
            order: [['id_rol', 'ASC']]
        });
        res.json(roles);
    } catch (err) {
        console.error("❌ Error al obtener roles:", err);
        res.status(500).json({ msg: "Error al consultar roles.", error: err.message });
    }
};

// R: READ - Obtener rol por ID
const obtenerRolPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await Rol.findByPk(id);
        if (!rol) {
            return res.status(404).json({ msg: "Rol no encontrado." });
        }
        res.json(rol);
    } catch (err) {
        console.error("❌ Error al obtener rol por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// C: CREATE - Crear nuevo rol
const crearRol = async (req, res) => {
    try {
        const { nombre_rol, descripcion } = req.body;
        
        if (!nombre_rol || nombre_rol.trim() === '') {
            return res.status(400).json({ msg: "El nombre_rol es requerido." });
        }

        const nombreLimpio = nombre_rol.trim();
        
        const existeRol = await Rol.findOne({ 
            where: { nombre_rol: nombreLimpio }
        });
        
        if (existeRol) {
            return res.status(400).json({ 
                msg: "El nombre del rol ya existe.", 
                rolExistente: existeRol.nombre_rol 
            });
        }

        const nuevoRol = await Rol.create({ 
            nombre_rol: nombreLimpio, 
            descripcion: descripcion ? descripcion.trim() : null
        });
        
        res.status(201).json({ msg: "Rol creado exitosamente", rol: nuevoRol });
    } catch (err) {
        console.error("❌ Error al crear rol:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al crear rol.", 
            error: err.message 
        });
    }
};

// U: UPDATE - Actualizar rol
const actualizarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_rol, descripcion } = req.body;
        
        const rol = await Rol.findByPk(id);
        if (!rol) {
            return res.status(404).json({ msg: "Rol no encontrado." });
        }

        if (nombre_rol && nombre_rol.trim() !== '') {
            const nombreLimpio = nombre_rol.trim();
            
            const existeOtroRol = await Rol.findOne({ 
                where: {
                    nombre_rol: nombreLimpio,
                    id_rol: { [Op.ne]: id }
                }
            });
            
            if (existeOtroRol) {
                return res.status(400).json({ 
                    msg: "Ya existe otro rol con ese nombre.", 
                    rolExistente: existeOtroRol.nombre_rol 
                });
            }
        }

        const datosLimpios = {};
        if (nombre_rol && nombre_rol.trim() !== '') {
            datosLimpios.nombre_rol = nombre_rol.trim();
        }
        if (descripcion !== undefined) {
            datosLimpios.descripcion = descripcion ? descripcion.trim() : null;
        }

        await rol.update(datosLimpios);
        res.json({ msg: "Rol actualizado exitosamente", rol });
    } catch (err) {
        console.error("❌ Error al actualizar rol:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al actualizar rol.", 
            error: err.message 
        });
    }
};

// D: DELETE - Eliminar rol
const eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number(id) === 1 || Number(id) === 2) {
            return res.status(403).json({ 
                msg: "No se pueden eliminar los roles básicos del sistema (superadmin, administrador, usuario, cliente)." 
            });
        }

        const rol = await Rol.findByPk(id);
        if (!rol) {
            return res.status(404).json({ msg: "Rol no encontrado." });
        }

        const usuariosConEsteRol = await Usuario.findOne({ where: { id_rol: id } });
        if (usuariosConEsteRol) {
            return res.status(400).json({ 
                msg: "No se puede eliminar el rol porque hay usuarios asignados a él." 
            });
        }

        await rol.destroy();
        res.json({ msg: `Rol "${rol.nombre_rol}" eliminado exitosamente.` });
    } catch (err) {
        console.error("❌ Error al eliminar rol:", err);
        res.status(500).json({
            msg: "Error interno del servidor al eliminar rol.",
            error: err.message,
        });
    }
};

module.exports = {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
};