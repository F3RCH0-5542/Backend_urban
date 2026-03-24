const { Registro, Usuario, Rol } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

// R: READ - Obtener todos los registros (log de auditoría)
const obtenerRegistros = async (req, res) => {
    try {
        const registros = await Registro.findAll({
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }],
            order: [['id_registro', 'DESC']]
        });
        res.json(registros);
    } catch (err) {
        console.error("Error al obtener registros:", err);
        res.status(500).json({ msg: "Error al consultar registros.", error: err.message });
    }
};

// R: READ - Obtener registro por ID
const obtenerRegistroPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await Registro.findByPk(id, {
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }]
        });
        if (!registro) {
            return res.status(404).json({ msg: "Registro no encontrado." });
        }
        res.json(registro);
    } catch (err) {
        console.error("Error al obtener registro por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// R: READ - Obtener registros de un usuario específico
const obtenerRegistrosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        
        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const registros = await Registro.findAll({
            where: { id_usuario },
            include: [{
                model: Usuario,
                attributes: ['nombre', 'apellido', 'correo']
            }],
            order: [['id_registro', 'DESC']]
        });
        
        res.json(registros);
    } catch (err) {
        console.error("Error al obtener registros por usuario:", err);
        res.status(500).json({ msg: "Error al consultar registros del usuario.", error: err.message });
    }
};

// C: CREATE - Crear nuevo registro (log de auditoría)
const crearRegistro = async (req, res) => {
    try {
        const { id_usuario, nombre, contraseña, rol } = req.body;
        
        // Validaciones
        if (!id_usuario || !nombre || !contraseña || !rol) {
            return res.status(400).json({ 
                msg: "id_usuario, nombre, contraseña y rol son requeridos." 
            });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(400).json({ msg: "El usuario especificado no existe." });
        }

        // Hashear contraseña para el log
        const salt = await bcrypt.genSalt(10);
        const contraseñaHasheada = await bcrypt.hash(contraseña, salt);

        const nuevoRegistro = await Registro.create({
            id_usuario: Number(id_usuario),
            nombre: nombre.trim(),
            contraseña: contraseñaHasheada,
            rol: rol.trim()
        });

        // Obtener el registro creado con información del usuario
        const registroCompleto = await Registro.findByPk(nuevoRegistro.id_registro, {
            attributes: { exclude: ['contraseña'] }, // No devolver la contraseña
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }]
        });

        res.status(201).json({ 
            msg: "Registro creado exitosamente", 
            registro: registroCompleto 
        });
    } catch (err) {
        console.error("Error al crear registro:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al crear registro.", 
            error: err.message 
        });
    }
};

// U: UPDATE (PUT) - Actualizar registro completo
const actualizarRegistro = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usuario, nombre, contraseña, rol } = req.body;
        
        const registro = await Registro.findByPk(id);
        if (!registro) {
            return res.status(404).json({ msg: "Registro no encontrado." });
        }

        // Validar usuario si se proporciona
        if (id_usuario) {
            const usuario = await Usuario.findByPk(id_usuario);
            if (!usuario) {
                return res.status(400).json({ msg: "El usuario especificado no existe." });
            }
        }

        const datosLimpios = {};
        if (id_usuario) datosLimpios.id_usuario = Number(id_usuario);
        if (nombre) datosLimpios.nombre = nombre.trim();
        if (rol) datosLimpios.rol = rol.trim();
        
        // Hashear nueva contraseña si se proporciona
        if (contraseña) {
            const salt = await bcrypt.genSalt(10);
            datosLimpios.contraseña = await bcrypt.hash(contraseña, salt);
        }

        await registro.update(datosLimpios);
        
        // Obtener el registro actualizado sin la contraseña
        const registroActualizado = await Registro.findByPk(id, {
            attributes: { exclude: ['contraseña'] },
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }]
        });
        
        res.json({ 
            msg: "Registro actualizado exitosamente", 
            registro: registroActualizado 
        });
    } catch (err) {
        console.error("Error al actualizar registro:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al actualizar registro.", 
            error: err.message 
        });
    }
};

// U: UPDATE (PATCH) - Actualización parcial
const actualizarRegistroParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const registro = await Registro.findByPk(id);
        if (!registro) {
            return res.status(404).json({ msg: "Registro no encontrado." });
        }

        // Validar usuario si se proporciona
        if (data.id_usuario) {
            const usuario = await Usuario.findByPk(data.id_usuario);
            if (!usuario) {
                return res.status(400).json({ msg: "El usuario especificado no existe." });
            }
        }

        // Limpiar y preparar datos
        const datosLimpios = {};
        if (data.id_usuario) datosLimpios.id_usuario = Number(data.id_usuario);
        if (data.nombre) datosLimpios.nombre = data.nombre.trim();
        if (data.rol) datosLimpios.rol = data.rol.trim();
        
        // Hashear nueva contraseña si se proporciona
        if (data.contraseña) {
            const salt = await bcrypt.genSalt(10);
            datosLimpios.contraseña = await bcrypt.hash(data.contraseña, salt);
        }

        await registro.update(datosLimpios);

        // Obtener el registro actualizado sin la contraseña
        const registroActualizado = await Registro.findByPk(id, {
            attributes: { exclude: ['contraseña'] },
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }]
        });

        res.json({ 
            msg: "Registro actualizado parcialmente", 
            registro: registroActualizado 
        });
    } catch (err) {
        console.error("Error al actualizar registro (PATCH):", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al actualizar registro parcialmente.", 
            error: err.message 
        });
    }
};

// D: DELETE - Eliminar registro (normalmente no se eliminan los logs)
const eliminarRegistro = async (req, res) => {
    try {
        const { id } = req.params;

        const registro = await Registro.findByPk(id);
        if (!registro) {
            return res.status(404).json({ msg: "Registro no encontrado." });
        }

        await registro.destroy();
        res.json({ msg: `Registro con ID ${id} eliminado exitosamente.` });
    } catch (err) {
        console.error("Error al eliminar registro:", err);
        res.status(500).json({
            msg: "Error interno del servidor al eliminar registro.",
            error: err.message,
        });
    }
};

// Obtener registros por rol
const obtenerRegistrosPorRol = async (req, res) => {
    try {
        const { rol } = req.query;
        
        const whereCondition = {};
        if (rol) {
            whereCondition.rol = {
                [Op.like]: `%${rol}%`
            };
        }
        
        const registros = await Registro.findAll({
            where: whereCondition,
            attributes: { exclude: ['contraseña'] },
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{
                    model: Rol,
                    attributes: ['nombre_rol']
                }]
            }],
            order: [['id_registro', 'DESC']]
        });
        
        res.json(registros);
    } catch (err) {
        console.error("Error al obtener registros por rol:", err);
        res.status(500).json({ 
            msg: "Error al consultar registros por rol.", 
            error: err.message 
        });
    }
};

// Obtener resumen de registros por rol
const obtenerResumenPorRol = async (req, res) => {
    try {
        const resumen = await Registro.findAll({
            attributes: [
                'rol',
                [sequelize.fn('COUNT', sequelize.col('id_registro')), 'cantidad_registros']
            ],
            group: ['rol'],
            order: [[sequelize.fn('COUNT', sequelize.col('id_registro')), 'DESC']]
        });
        
        res.json(resumen);
    } catch (err) {
        console.error("Error al obtener resumen por rol:", err);
        res.status(500).json({ 
            msg: "Error al consultar resumen de registros.", 
            error: err.message 
        });
    }
};

module.exports = {
    obtenerRegistros,
    obtenerRegistroPorId,
    obtenerRegistrosPorUsuario,
    crearRegistro,
    actualizarRegistro,
    actualizarRegistroParcial,
    eliminarRegistro,
    obtenerRegistrosPorRol,
    obtenerResumenPorRol
};