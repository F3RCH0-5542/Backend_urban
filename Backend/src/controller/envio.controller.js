const { Envio, Pedido, Usuario } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// ✅ Estados válidos
const ESTADOS_ENVIO_VALIDOS = ['pendiente', 'en_camino', 'entregado', 'devuelto'];

// R: READ - Obtener todos los envíos
const obtenerEnvios = async (req, res) => {
    try {
        const envios = await Envio.findAll({
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }],
            order: [['fecha', 'DESC']]
        });
        res.json(envios);
    } catch (err) {
        console.error("Error al obtener envíos:", err);
        res.status(500).json({ msg: "Error al consultar envíos.", error: err.message });
    }
};

// R: READ - Obtener envío por ID
const obtenerEnvioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const envio = await Envio.findByPk(id, {
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }]
        });
        if (!envio) {
            return res.status(404).json({ msg: "Envío no encontrado." });
        }
        res.json(envio);
    } catch (err) {
        console.error("Error al obtener envío por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// R: READ - Obtener envíos de un pedido específico
const obtenerEnviosPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const pedido = await Pedido.findByPk(id_pedido);
        if (!pedido) {
            return res.status(404).json({ msg: "Pedido no encontrado." });
        }

        const envios = await Envio.findAll({
            where: { id_pedido },
            include: [{
                model: Pedido,
                attributes: ['fecha_pedido', 'total']
            }],
            order: [['fecha', 'DESC']]
        });

        res.json(envios);
    } catch (err) {
        console.error("Error al obtener envíos por pedido:", err);
        res.status(500).json({ msg: "Error al consultar envíos del pedido.", error: err.message });
    }
};

// ✅ R: READ - Obtener envíos por estado
const obtenerEnviosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;

        if (!ESTADOS_ENVIO_VALIDOS.includes(estado)) {
            return res.status(400).json({ 
                msg: "Estado no válido.", 
                estadosValidos: ESTADOS_ENVIO_VALIDOS 
            });
        }

        const envios = await Envio.findAll({
            where: { estado_envio: estado },
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }],
            order: [['fecha', 'DESC']]
        });

        res.json(envios);
    } catch (err) {
        console.error("Error al obtener envíos por estado:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// C: CREATE - Crear nuevo envío
const crearEnvio = async (req, res) => {
    try {
        // ✅ Se incluyen ciudad, telefono y estado_envio
        const { id_pedido, direccion, ciudad, telefono, estado_envio, fecha } = req.body;

        if (!id_pedido || !direccion) {
            return res.status(400).json({ msg: "id_pedido y direccion son requeridos." });
        }

        // ✅ Validar estado si se envía
        if (estado_envio && !ESTADOS_ENVIO_VALIDOS.includes(estado_envio)) {
            return res.status(400).json({ 
                msg: "Estado de envío no válido.", 
                estadosValidos: ESTADOS_ENVIO_VALIDOS 
            });
        }

        const pedido = await Pedido.findByPk(id_pedido);
        if (!pedido) {
            return res.status(400).json({ msg: "El pedido especificado no existe." });
        }

        const nuevoEnvio = await Envio.create({
            id_pedido: Number(id_pedido),
            direccion: direccion.trim(),
            ciudad: ciudad || null,                     // ✅
            telefono: telefono || null,                 // ✅
            estado_envio: estado_envio || 'pendiente',  // ✅
            fecha: fecha ? new Date(fecha) : new Date()
        });

        const envioCompleto = await Envio.findByPk(nuevoEnvio.id_envio, {
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }]
        });

        res.status(201).json({ msg: "Envío registrado exitosamente", envio: envioCompleto });
    } catch (err) {
        console.error("Error al crear envío:", err);
        res.status(500).json({ msg: "Error interno del servidor al registrar envío.", error: err.message });
    }
};

// U: UPDATE (PUT) - Actualizar envío completo
const actualizarEnvio = async (req, res) => {
    try {
        const { id } = req.params;
        // ✅ Se incluyen ciudad, telefono y estado_envio
        const { id_pedido, direccion, ciudad, telefono, estado_envio, fecha } = req.body;

        const envio = await Envio.findByPk(id);
        if (!envio) {
            return res.status(404).json({ msg: "Envío no encontrado." });
        }

        if (id_pedido) {
            const pedido = await Pedido.findByPk(id_pedido);
            if (!pedido) {
                return res.status(400).json({ msg: "El pedido especificado no existe." });
            }
        }

        // ✅ Validar estado si se envía
        if (estado_envio && !ESTADOS_ENVIO_VALIDOS.includes(estado_envio)) {
            return res.status(400).json({ 
                msg: "Estado de envío no válido.", 
                estadosValidos: ESTADOS_ENVIO_VALIDOS 
            });
        }

        const datosLimpios = {};
        if (id_pedido) datosLimpios.id_pedido = Number(id_pedido);
        if (direccion) datosLimpios.direccion = direccion.trim();
        if (ciudad !== undefined) datosLimpios.ciudad = ciudad;         // ✅
        if (telefono !== undefined) datosLimpios.telefono = telefono;   // ✅
        if (estado_envio) datosLimpios.estado_envio = estado_envio;     // ✅
        if (fecha) datosLimpios.fecha = new Date(fecha);

        await envio.update(datosLimpios);

        const envioActualizado = await Envio.findByPk(id, {
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }]
        });

        res.json({ msg: "Envío actualizado exitosamente", envio: envioActualizado });
    } catch (err) {
        console.error("Error al actualizar envío:", err);
        res.status(500).json({ msg: "Error interno del servidor al actualizar envío.", error: err.message });
    }
};

// U: UPDATE (PATCH) - Actualización parcial
const actualizarEnvioParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const envio = await Envio.findByPk(id);
        if (!envio) {
            return res.status(404).json({ msg: "Envío no encontrado." });
        }

        if (data.id_pedido) {
            const pedido = await Pedido.findByPk(data.id_pedido);
            if (!pedido) {
                return res.status(400).json({ msg: "El pedido especificado no existe." });
            }
        }

        // ✅ Validar estado si se envía
        if (data.estado_envio && !ESTADOS_ENVIO_VALIDOS.includes(data.estado_envio)) {
            return res.status(400).json({ 
                msg: "Estado de envío no válido.", 
                estadosValidos: ESTADOS_ENVIO_VALIDOS 
            });
        }

        const datosLimpios = {};
        if (data.id_pedido) datosLimpios.id_pedido = Number(data.id_pedido);
        if (data.direccion) datosLimpios.direccion = data.direccion.trim();
        if (data.ciudad !== undefined) datosLimpios.ciudad = data.ciudad;       // ✅
        if (data.telefono !== undefined) datosLimpios.telefono = data.telefono; // ✅
        if (data.estado_envio) datosLimpios.estado_envio = data.estado_envio;   // ✅
        if (data.fecha) datosLimpios.fecha = new Date(data.fecha);

        await envio.update(datosLimpios);

        const envioActualizado = await Envio.findByPk(id, {
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }]
        });

        res.json({ msg: "Envío actualizado parcialmente", envio: envioActualizado });
    } catch (err) {
        console.error("Error al actualizar envío (PATCH):", err);
        res.status(500).json({ msg: "Error interno del servidor al actualizar envío parcialmente.", error: err.message });
    }
};

// D: DELETE - Eliminar envío
const eliminarEnvio = async (req, res) => {
    try {
        const { id } = req.params;

        const envio = await Envio.findByPk(id);
        if (!envio) {
            return res.status(404).json({ msg: "Envío no encontrado." });
        }

        await envio.destroy();
        res.json({ msg: `Envío con ID ${id} eliminado exitosamente.` });
    } catch (err) {
        console.error("Error al eliminar envío:", err);
        res.status(500).json({ msg: "Error interno del servidor al eliminar envío.", error: err.message });
    }
};

// Obtener envíos por rango de fechas
const obtenerEnviosPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        const whereCondition = {};
        if (fecha_inicio && fecha_fin) {
            whereCondition.fecha = {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        }

        const envios = await Envio.findAll({
            where: whereCondition,
            include: [{
                model: Pedido,
                attributes: ['id_pedido', 'fecha_pedido', 'total'],
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                }]
            }],
            order: [['fecha', 'DESC']]
        });

        res.json(envios);
    } catch (err) {
        console.error("Error al obtener envíos por fecha:", err);
        res.status(500).json({ msg: "Error al consultar envíos por fecha.", error: err.message });
    }
};

// Obtener estadísticas de envíos
const obtenerEstadisticasEnvios = async (req, res) => {
    try {
        const estadisticas = await Envio.findAll({
            attributes: [
                'estado_envio',
                [sequelize.fn('COUNT', sequelize.col('id_envio')), 'total_envios'],
                [sequelize.fn('DATE', sequelize.col('fecha')), 'fecha']
            ],
            group: ['estado_envio', sequelize.fn('DATE', sequelize.col('fecha'))],
            order: [[sequelize.fn('DATE', sequelize.col('fecha')), 'DESC']],
            limit: 30
        });

        res.json(estadisticas);
    } catch (err) {
        console.error("Error al obtener estadísticas de envíos:", err);
        res.status(500).json({ msg: "Error al consultar estadísticas de envíos.", error: err.message });
    }
};

module.exports = {
    obtenerEnvios,
    obtenerEnvioPorId,
    obtenerEnviosPorPedido,
    obtenerEnviosPorEstado,
    crearEnvio,
    actualizarEnvio,
    actualizarEnvioParcial,
    eliminarEnvio,
    obtenerEnviosPorFecha,
    obtenerEstadisticasEnvios
};