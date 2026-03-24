const { Venta, Usuario, Pedido, DetallePedido } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// ✅ Estados válidos
const ESTADOS_VALIDOS = ['pendiente', 'completada', 'cancelada', 'reembolsada'];

// R: READ - Obtener todas las ventas
const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ],
            order: [['fecha', 'DESC']]
        });
        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas:", err);
        res.status(500).json({ msg: "Error al consultar ventas.", error: err.message });
    }
};

// R: READ - Obtener venta por ID
const obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ]
        });
        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada." });
        }
        res.json(venta);
    } catch (err) {
        console.error("Error al obtener venta por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// R: READ - Obtener ventas de un usuario específico
const obtenerVentasPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        const ventas = await Venta.findAll({
            where: { id_usuario },
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas por usuario:", err);
        res.status(500).json({ msg: "Error al consultar ventas del usuario.", error: err.message });
    }
};

// ✅ R: READ - Obtener ventas por estado
const obtenerVentasPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({ 
                msg: "Estado no válido.", 
                estadosValidos: ESTADOS_VALIDOS 
            });
        }

        const ventas = await Venta.findAll({
            where: { estado },
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas por estado:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

/* ======================================================
   C: CREATE - Crear venta + descontar stock automáticamente
   ====================================================== */
const crearVenta = async (req, res) => {
    // Usamos transacción para que todo sea atómico:
    // si falla algo, no se descuenta stock ni se crea la venta
    const t = await sequelize.transaction();

    try {
        const { id_usuario, id_pedido, fecha } = req.body;

        if (!id_usuario) {
            await t.rollback();
            return res.status(400).json({ msg: "id_usuario es requerido." });
        }

        if (!id_pedido) {
            await t.rollback();
            return res.status(400).json({ msg: "id_pedido es requerido." });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(id_usuario, { transaction: t });
        if (!usuario) {
            await t.rollback();
            return res.status(400).json({ msg: "El usuario especificado no existe." });
        }

        // Verificar que el pedido existe y le pertenece al usuario
        const pedido = await Pedido.findByPk(id_pedido, { transaction: t });
        if (!pedido) {
            await t.rollback();
            return res.status(400).json({ msg: "El pedido especificado no existe." });
        }
        if (pedido.id_usuario !== Number.parseInt(id_usuario)) {
            await t.rollback();
            return res.status(403).json({ msg: "El pedido no pertenece al usuario indicado." });
        }

        // ✅ Obtener los detalles del pedido para descontar stock
        const detalles = await DetallePedido.findAll({
         where: { id_pedido },
         transaction: t
          });

        if (!detalles || detalles.length === 0) {
            await t.rollback();
            return res.status(400).json({ msg: "El pedido no tiene productos asociados." });
        }

        // ✅ Calcular total desde los detalles del pedido
        const totalCalculado = detalles.reduce((sum, d) => {
            return sum + (Number.parseFloat(d.precio_unitario) * d.cantidad);
        }, 0);

        // Crear la venta
        const nuevaVenta = await Venta.create({
            id_usuario: Number.parseInt(id_usuario),
            id_pedido: Number.parseInt(id_pedido),
            fecha: fecha ? new Date(fecha) : new Date(),
            total: totalCalculado,
            estado: 'completada'  // Al crear la venta, la compra ya se realizó
        }, { transaction: t });

        // ✅ Marcar el pedido como completado
        await pedido.update({ estado: 'completado' }, { transaction: t });

        await t.commit();

        // Devolver la venta completa
        const ventaCompleta = await Venta.findByPk(nuevaVenta.id_venta, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ]
        });

        res.status(201).json({ 
            msg: "Venta registrada exitosamente y stock actualizado.", 
            venta: ventaCompleta
        });

    } catch (err) {
        await t.rollback();
        console.error("Error al crear venta:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al registrar venta.", 
            error: err.message 
        });
    }
};

// U: UPDATE - Actualizar venta (PUT)
const actualizarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        // ✅ Se incluyen nuevos campos
        const { id_usuario, id_pedido, fecha, total, estado } = req.body;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada." });
        }

        if (id_usuario) {
            const usuario = await Usuario.findByPk(id_usuario);
            if (!usuario) {
                return res.status(400).json({ msg: "El usuario especificado no existe." });
            }
        }

        if (id_pedido) {
            const pedido = await Pedido.findByPk(id_pedido);
            if (!pedido) {
                return res.status(400).json({ msg: "El pedido especificado no existe." });
            }
        }

        // ✅ Validar estado si se envía
        if (estado && !ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({ 
                msg: "Estado no válido.", 
                estadosValidos: ESTADOS_VALIDOS 
            });
        }

        const datosLimpios = {};
        if (id_usuario) datosLimpios.id_usuario = Number.parseInt(id_usuario);
        if (id_pedido) datosLimpios.id_pedido = Number.parseInt(id_pedido);
        if (fecha) datosLimpios.fecha = new Date(fecha);
        if (total !== undefined) datosLimpios.total = Number.parseFloat(total);
        if (estado) datosLimpios.estado = estado;

        await venta.update(datosLimpios);

        const ventaActualizada = await Venta.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ]
        });

        res.json({ 
            msg: "Venta actualizada exitosamente", 
            venta: ventaActualizada 
        });
    } catch (err) {
        console.error("Error al actualizar venta:", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al actualizar venta.", 
            error: err.message 
        });
    }
};

// U: UPDATE (PATCH) - Actualización parcial
const actualizarVentaParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const venta = await Venta.findByPk(id);
        if (!venta) {
            return res.status(404).json({ msg: "Venta no encontrada." });
        }

        if (data.id_usuario) {
            const usuario = await Usuario.findByPk(data.id_usuario);
            if (!usuario) {
                return res.status(400).json({ msg: "El usuario especificado no existe." });
            }
        }

        // ✅ Validar estado si se envía
        if (data.estado && !ESTADOS_VALIDOS.includes(data.estado)) {
            return res.status(400).json({ 
                msg: "Estado no válido.", 
                estadosValidos: ESTADOS_VALIDOS 
            });
        }

        const datosLimpios = {};
        if (data.id_usuario) datosLimpios.id_usuario = Number.parseInt(data.id_usuario);
        if (data.id_pedido) datosLimpios.id_pedido = Number.parseInt(data.id_pedido);
        if (data.fecha) datosLimpios.fecha = new Date(data.fecha);
        if (data.total !== undefined) datosLimpios.total = Number.parseFloat(data.total);
        if (data.estado) datosLimpios.estado = data.estado;

        await venta.update(datosLimpios);

        const ventaActualizada = await Venta.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ]
        });

        res.json({ 
            msg: "Venta actualizada parcialmente", 
            venta: ventaActualizada 
        });
    } catch (err) {
        console.error("Error al actualizar venta (PATCH):", err);
        res.status(500).json({ 
            msg: "Error interno del servidor al actualizar venta parcialmente.", 
            error: err.message 
        });
    }
};

// Obtener ventas por rango de fechas
const obtenerVentasPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        const whereCondition = {};
        if (fecha_inicio && fecha_fin) {
            whereCondition.fecha = {
                [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
            };
        }

        const ventas = await Venta.findAll({
            where: whereCondition,
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nombre', 'apellido', 'correo']
                },
                {
                    model: Pedido,
                    attributes: ['id_pedido', 'fecha_pedido', 'estado']
                }
            ],
            order: [['fecha', 'DESC']]
        });

        res.json(ventas);
    } catch (err) {
        console.error("Error al obtener ventas por fecha:", err);
        res.status(500).json({ 
            msg: "Error al consultar ventas por fecha.", 
            error: err.message 
        });
    }
};

// Obtener estadísticas de ventas
const obtenerEstadisticasVentas = async (req, res) => {
    try {
        const estadisticas = await Venta.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id_venta')), 'total_ventas'],
                // ✅ Suma del total de ventas por día
                [sequelize.fn('SUM', sequelize.col('total')), 'ingresos_dia'],
                [sequelize.fn('DATE', sequelize.col('fecha')), 'fecha'],
            ],
            where: { estado: 'completada' }, // ✅ Solo ventas completadas
            group: [sequelize.fn('DATE', sequelize.col('fecha'))],
            order: [[sequelize.fn('DATE', sequelize.col('fecha')), 'DESC']],
            limit: 30
        });

        res.json(estadisticas);
    } catch (err) {
        console.error("Error al obtener estadísticas de ventas:", err);
        res.status(500).json({ 
            msg: "Error al consultar estadísticas de ventas.", 
            error: err.message 
        });
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    obtenerVentasPorUsuario,
    obtenerVentasPorEstado,
    crearVenta,
    actualizarVenta,
    actualizarVentaParcial,
    obtenerVentasPorFecha,
    obtenerEstadisticasVentas
};