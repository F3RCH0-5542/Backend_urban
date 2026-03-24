const { Pedido, Usuario, Rol } = require("../models");
const { Op } = require("sequelize");
const db = require("../config/database");
const Personalizacion = require("../models/Personalizacion");

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'enviado', 'completado', 'cancelado'];

const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [{
                model: Usuario,
                attributes: ['id_usuario', 'nombre', 'apellido', 'correo'],
                include: [{ model: Rol, attributes: ['nombre_rol'] }]
            }],
            order: [['fecha_pedido', 'DESC']]
        });
        res.json(pedidos);
    } catch (err) {
        console.error("Error al obtener pedidos:", err);
        res.status(500).json({ msg: "Error al consultar pedidos.", error: err.message });
    }
};

const obtenerPedidoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pedido = await Pedido.findByPk(id, {
            include: [{ model: Usuario, attributes: ['id_usuario', 'nombre', 'apellido', 'correo'] }]
        });

        if (!pedido) return res.status(404).json({ msg: "Pedido no encontrado." });

        const detalles = await db.query(
            `SELECT id_detalle, id_producto, nombre_producto, imagen, cantidad, precio_unitario, subtotal 
             FROM detalle_pedido WHERE id_pedido = ?`,
            { replacements: [id], type: db.QueryTypes.SELECT }
        );

        const [envio] = await db.query(
            `SELECT direccion, ciudad, telefono, estado_envio FROM envio WHERE id_pedido = ? LIMIT 1`,
            { replacements: [id], type: db.QueryTypes.SELECT }
        );

        const [pago] = await db.query(
            `SELECT metodo_pago, monto, estado_pago, fecha_pago FROM pago WHERE id_pedido = ? LIMIT 1`,
            { replacements: [id], type: db.QueryTypes.SELECT }
        );

        res.json({
            id_pedido:    pedido.id_pedido,
            fecha_pedido: pedido.fecha_pedido,
            total:        pedido.total,
            estado:       pedido.estado,
            metodo_pago:  pedido.metodo_pago,
            id_usuario:   pedido.id_usuario,
            Usuario:      pedido.Usuario,
            detalles:     detalles || [],
            envio:        envio || null,
            pago:         pago || null,
        });

    } catch (err) {
        console.error("Error al obtener pedido por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const obtenerMisPedidos = async (req, res) => {
    try {
        const id_usuario = req.userId;

        const pedidos = await Pedido.findAll({
            where: { id_usuario },
            order: [['fecha_pedido', 'DESC']]
        });

        const pedidosCompletos = await Promise.all(pedidos.map(async (p) => {
            const id = p.id_pedido;

            const detalles = await db.query(
                `SELECT id_detalle, id_producto, nombre_producto, imagen, cantidad, precio_unitario, subtotal
                 FROM detalle_pedido WHERE id_pedido = ?`,
                { replacements: [id], type: db.QueryTypes.SELECT }
            );

            const [envio] = await db.query(
                `SELECT direccion, ciudad, telefono, estado_envio FROM envio WHERE id_pedido = ? LIMIT 1`,
                { replacements: [id], type: db.QueryTypes.SELECT }
            );

            return {
                id_pedido:    p.id_pedido,
                fecha_pedido: p.fecha_pedido,
                total:        p.total,
                estado:       p.estado,
                metodo_pago:  p.metodo_pago,
                detalles:     detalles || [],
                envio:        envio || null,
            };
        }));

        res.json(pedidosCompletos);
    } catch (err) {
        console.error("Error mis pedidos:", err);
        res.status(500).json({ msg: "Error al consultar mis pedidos.", error: err.message });
    }
};

const obtenerPedidosPorUsuario = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario || req.userId;
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado." });

        const pedidos = await Pedido.findAll({
            where: { id_usuario },
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'correo'] }],
            order: [['fecha_pedido', 'DESC']]
        });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ msg: "Error al consultar pedidos del usuario.", error: err.message });
    }
};

const obtenerPedidosPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({ msg: "Estado no válido.", estadosValidos: ESTADOS_VALIDOS });
        }
        const pedidos = await Pedido.findAll({
            where: { estado },
            include: [{ model: Usuario, attributes: ['id_usuario', 'nombre', 'apellido', 'correo'] }],
            order: [['fecha_pedido', 'DESC']]
        });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const crearPedido = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const { productos, total, direccion, ciudad, telefono, metodo_pago } = req.body;
        const id_usuario = req.userId;

        console.log('📦 [PEDIDO] Creando pedido:', { cantidad_productos: productos?.length, total });

        if (!id_usuario) { await transaction.rollback(); return res.status(401).json({ ok: false, msg: "No autenticado" }); }
        if (!productos || productos.length === 0) { await transaction.rollback(); return res.status(400).json({ ok: false, msg: "El carrito está vacío" }); }
        if (!total || total <= 0) { await transaction.rollback(); return res.status(400).json({ ok: false, msg: "Total inválido" }); }

        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) { await transaction.rollback(); return res.status(400).json({ ok: false, msg: "Usuario no existe." }); }

        for (const producto of productos) {
            const [result] = await db.query(
                `SELECT stock_disponible FROM productos WHERE id_producto = ? AND activo = 1`,
                { replacements: [producto.id_producto], type: db.QueryTypes.SELECT, transaction }
            );
            if (!result) { await transaction.rollback(); return res.status(404).json({ ok: false, msg: `Producto "${producto.nombre}" no encontrado` }); }
            if (result.stock_disponible < (producto.cantidad || 1)) {
                await transaction.rollback();
                return res.status(400).json({ ok: false, msg: `Stock insuficiente para "${producto.nombre}". Disponible: ${result.stock_disponible}` });
            }
        }

        const [id_pedido] = await db.query(
            `INSERT INTO pedido (id_usuario, total, fecha_pedido, estado, metodo_pago) VALUES (?, ?, NOW(), 'pendiente', ?)`,
            { replacements: [id_usuario, total, metodo_pago || 'efectivo'], type: db.QueryTypes.INSERT, transaction }
        );
        console.log('✅ [PEDIDO] Pedido creado con ID:', id_pedido);

        for (const producto of productos) {
            const cantidad = producto.cantidad || 1;
            const subtotal = producto.precio * cantidad;

            await db.query(
                `INSERT INTO detalle_pedido (id_pedido, id_producto, nombre_producto, imagen, cantidad, precio_unitario, subtotal, id_personalizacion)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
                { replacements: [id_pedido, producto.id_producto, producto.nombre, producto.imagen, cantidad, producto.precio, subtotal], type: db.QueryTypes.INSERT, transaction }
            );

            await db.query(
                `UPDATE productos SET stock_disponible = stock_disponible - ? WHERE id_producto = ?`,
                { replacements: [cantidad, producto.id_producto], type: db.QueryTypes.UPDATE, transaction }
            );

            await db.query(
                `INSERT INTO inventario (id_producto, tipo, cantidad, stock_resultante, stock_minimo, motivo, fecha_movimiento)
                 SELECT ?, 'salida', ?, stock_disponible, 5, CONCAT('Pedido #', ?), NOW() FROM productos WHERE id_producto = ?`,
                { replacements: [producto.id_producto, cantidad, id_pedido, producto.id_producto], type: db.QueryTypes.INSERT, transaction }
            );
            console.log(`✅ [PEDIDO] Stock descontado - producto x${cantidad}`);
        }

        if (direccion && ciudad) {
            console.log('🚚 [PEDIDO] Creando envío...');
            await db.query(
                `INSERT INTO envio (id_pedido, direccion, ciudad, telefono, estado_envio, fecha) VALUES (?, ?, ?, ?, 'pendiente', NOW())`,
                { replacements: [id_pedido, direccion, ciudad, telefono || ''], type: db.QueryTypes.INSERT, transaction }
            );
        }

        await db.query(
            `INSERT INTO ventas (id_usuario, id_pedido, total, estado, fecha) VALUES (?, ?, ?, 'completada', NOW())`,
            { replacements: [id_usuario, id_pedido, total], type: db.QueryTypes.INSERT, transaction }
        );
        console.log('💰 [PEDIDO] Venta registrada automáticamente');

        await transaction.commit();
        console.log('✅ [PEDIDO] Transacción completada');

        const pedidoCompleto = await Pedido.findByPk(id_pedido, {
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'correo'] }]
        });

        res.status(201).json({
            ok: true,
            msg: "✅ Pedido creado exitosamente.",
            pedido: {
                id_pedido: pedidoCompleto.id_pedido,
                total: pedidoCompleto.total,
                fecha_pedido: pedidoCompleto.fecha_pedido,
                estado: pedidoCompleto.estado,
                metodo_pago: pedidoCompleto.metodo_pago,
                usuario: pedidoCompleto.Usuario,
                productos
            }
        });

    } catch (err) {
        await transaction.rollback();
        console.error("❌ [PEDIDO] Error:", err);
        res.status(500).json({ ok: false, msg: "Error interno al crear pedido", error: err.message });
    }
};

const crearPedidoDesdePersonalizacion = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const { id_personalizacion } = req.body;
        const id_usuario = req.userId;

        if (!id_personalizacion) {
            await transaction.rollback();
            return res.status(400).json({ msg: 'id_personalizacion es requerido' });
        }

        const pers = await Personalizacion.findOne({
            where: { id_personalizacion, estado: 'aprobada' },
            transaction
        });

        if (!pers) {
            await transaction.rollback();
            return res.status(404).json({ msg: 'Personalización no encontrada o aún no aprobada' });
        }

        if (pers.id_pedido) {
            await transaction.rollback();
            return res.status(400).json({ msg: 'Esta personalización ya tiene un pedido asociado' });
        }

        const [id_pedido] = await db.query(
            `INSERT INTO pedido (id_usuario, total, fecha_pedido, estado, metodo_pago)
             VALUES (?, ?, NOW(), 'pendiente', 'personalizacion')`,
            { replacements: [id_usuario, pers.precio_adicional], type: db.QueryTypes.INSERT, transaction }
        );

        const nombreDetalle = `Personalización ${pers.tipo_personalizacion}`;
        const imagenDetalle = pers.imagen_referencia || 'assets/img/personalizacion.png';
        await db.query(
            `INSERT INTO detalle_pedido (id_pedido, id_producto, nombre_producto, imagen, cantidad, precio_unitario, subtotal, id_personalizacion)
             VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
            {
                replacements: [
                    id_pedido,
                    pers.id_producto || null,
                    nombreDetalle,
                    imagenDetalle,
                    pers.precio_adicional,
                    pers.precio_adicional,
                    pers.id_personalizacion
                ],
                type: db.QueryTypes.INSERT,
                transaction
            }
        );

        await db.query(
            `INSERT INTO ventas (id_usuario, id_pedido, total, estado, fecha) VALUES (?, ?, ?, 'completada', NOW())`,
            { replacements: [id_usuario, id_pedido, pers.precio_adicional], type: db.QueryTypes.INSERT, transaction }
        );

        await pers.update({ id_pedido }, { transaction });

        await transaction.commit();
        console.log(`✅ Pedido #${id_pedido} creado desde personalización #${id_personalizacion}`);

        return res.status(201).json({
            msg: '¡Pedido confirmado exitosamente!',
            id_pedido,
            total: pers.precio_adicional
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Error crearPedidoDesdePersonalizacion:', error);
        return res.status(500).json({ msg: 'Error al crear pedido', error: error.message });
    }
};

const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_usuario, total, fecha_pedido, estado, metodo_pago } = req.body;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ msg: "Pedido no encontrado." });

        if (id_usuario) {
            const usuario = await Usuario.findByPk(id_usuario);
            if (!usuario) return res.status(400).json({ msg: "El usuario especificado no existe." });
        }

        if (total !== undefined && (Number.isNaN(Number(total)) || Number(total) <= 0))
            return res.status(400).json({ msg: "El total debe ser un número positivo." });
        if (estado && !ESTADOS_VALIDOS.includes(estado))
            return res.status(400).json({ msg: "Estado no válido.", estadosValidos: ESTADOS_VALIDOS });

        const datosLimpios = {};
        if (id_usuario)            datosLimpios.id_usuario   = Number(id_usuario);
        if (total !== undefined)   datosLimpios.total        = Number(total);
        if (fecha_pedido)          datosLimpios.fecha_pedido = new Date(fecha_pedido);
        if (estado)                datosLimpios.estado       = estado;
        if (metodo_pago)           datosLimpios.metodo_pago  = metodo_pago;

        await pedido.update(datosLimpios);
        const pedidoActualizado = await Pedido.findByPk(id, {
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'correo'] }]
        });
        res.json({ msg: "Pedido actualizado exitosamente", pedido: pedidoActualizado });
    } catch (err) {
        res.status(500).json({ msg: "Error al actualizar pedido.", error: err.message });
    }
};

const eliminarPedido = async (req, res) => {
    const transaction = await db.transaction();
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id);
        if (!pedido) { await transaction.rollback(); return res.status(404).json({ msg: "Pedido no encontrado." }); }

        const detalles = await db.query(
            `SELECT id_producto, cantidad FROM detalle_pedido WHERE id_pedido = ?`,
            { replacements: [id], type: db.QueryTypes.SELECT, transaction }
        );

        for (const detalle of detalles) {
            await db.query(
                `UPDATE productos SET stock_disponible = stock_disponible + ? WHERE id_producto = ?`,
                { replacements: [detalle.cantidad, detalle.id_producto], type: db.QueryTypes.UPDATE, transaction }
            );
        }

        await db.query(`DELETE FROM detalle_pedido WHERE id_pedido = ?`, { replacements: [id], type: db.QueryTypes.DELETE, transaction });
        await db.query(`DELETE FROM envio WHERE id_pedido = ?`, { replacements: [id], type: db.QueryTypes.DELETE, transaction });
        await pedido.destroy({ transaction });
        await transaction.commit();

        res.json({ msg: `Pedido #${id} eliminado y stock devuelto.` });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ msg: "Error al eliminar pedido.", error: err.message });
    }
};

const obtenerPedidosPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const whereCondition = {};
        if (fecha_inicio && fecha_fin) {
            whereCondition.fecha_pedido = { [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)] };
        }
        const pedidos = await Pedido.findAll({
            where: whereCondition,
            include: [{ model: Usuario, attributes: ['nombre', 'apellido', 'correo'] }],
            order: [['fecha_pedido', 'DESC']]
        });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ msg: "Error al consultar pedidos por fecha.", error: err.message });
    }
};

module.exports = {
    obtenerPedidos,
    obtenerPedidoPorId,
    obtenerPedidosPorUsuario,
    obtenerPedidosPorEstado,
    crearPedido,
    crearPedidoDesdePersonalizacion,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosPorFecha,
    obtenerMisPedidos
};