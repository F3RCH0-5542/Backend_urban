const DetallePedido = require("../models/DetallePedido");

// R: READ - Obtener todos los detalles de pedidos
const obtenerDetallesPedidos = async (req, res) => {
    try {
        const detalles = await DetallePedido.findAll({
            order: [['id_detalle', 'DESC']]
        });
        res.json(detalles);
    } catch (err) {
        console.error("❌ Error al obtener detalles de pedidos:", err);
        res.status(500).json({ msg: "Error al consultar detalles de pedidos.", error: err.message });
    }
};

// R: READ - Obtener detalle por ID
const obtenerDetallePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            return res.status(404).json({ msg: "Detalle de pedido no encontrado." });
        }
        res.json(detalle);
    } catch (err) {
        console.error("❌ Error al obtener detalle por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

// R: READ - Obtener detalles por ID de pedido
const obtenerDetallesPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        const detalles = await DetallePedido.findAll({
            where: { id_pedido },
            order: [['id_detalle', 'ASC']]
        });
        res.json(detalles);
    } catch (err) {
        console.error("❌ Error al obtener detalles por pedido:", err);
        res.status(500).json({ msg: "Error al consultar detalles del pedido.", error: err.message });
    }
};

// Helper: validar campos del detalle
const validarCamposDetalle = ({ id_pedido, id_producto, cantidad, precio_unitario }) => {
    if (!id_pedido || Number.isNaN(Number(id_pedido))) {
        return "El ID del pedido es requerido y debe ser un número.";
    }
    if (!id_producto || Number.isNaN(Number(id_producto))) {
        return "El ID del producto es requerido y debe ser un número.";
    }
    if (!cantidad || Number.isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
        return "La cantidad es requerida y debe ser mayor a 0.";
    }
    if (!precio_unitario || Number.isNaN(Number(precio_unitario)) || Number(precio_unitario) < 0) {
        return "El precio unitario es requerido y debe ser un número positivo.";
    }
    return null;
};

// C: CREATE - Crear nuevo detalle de pedido
const crearDetallePedido = async (req, res) => {
    try {
        const { id_pedido, id_producto, nombre_producto, imagen, cantidad, precio_unitario, id_personalizacion } = req.body;

        const error = validarCamposDetalle({ id_pedido, id_producto, cantidad, precio_unitario });
        if (error) return res.status(400).json({ msg: error });

        const subtotal = Number(precio_unitario) * Number(cantidad);

        const nuevoDetalle = await DetallePedido.create({
            id_pedido: Number(id_pedido),
            id_producto: Number(id_producto),
            nombre_producto: nombre_producto || null,
            imagen: imagen || null,
            cantidad: Number(cantidad),
            precio_unitario: Number(precio_unitario),
            subtotal,
            id_personalizacion: id_personalizacion ? Number(id_personalizacion) : null
        });

        res.status(201).json({
            msg: "Detalle de pedido creado exitosamente",
            detalle: nuevoDetalle
        });
    } catch (err) {
        console.error("❌ Error al crear detalle de pedido:", err);
        res.status(500).json({
            msg: "Error interno del servidor al crear detalle de pedido.",
            error: err.message
        });
    }
};

// U: UPDATE - Actualizar detalle de pedido
const actualizarDetallePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_pedido, id_producto, nombre_producto, imagen, cantidad, precio_unitario, id_personalizacion } = req.body;

        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            return res.status(404).json({ msg: "Detalle de pedido no encontrado." });
        }

        if (cantidad !== undefined && (Number.isNaN(Number(cantidad)) || Number(cantidad) <= 0)) {
            return res.status(400).json({ msg: "La cantidad debe ser mayor a 0." });
        }

        if (precio_unitario !== undefined && (Number.isNaN(Number(precio_unitario)) || Number(precio_unitario) < 0)) {
            return res.status(400).json({ msg: "El precio unitario debe ser un número positivo." });
        }

        const datosLimpios = {};
        if (id_pedido !== undefined)          datosLimpios.id_pedido          = Number(id_pedido);
        if (id_producto !== undefined)        datosLimpios.id_producto        = Number(id_producto);
        if (nombre_producto !== undefined)    datosLimpios.nombre_producto    = nombre_producto;
        if (imagen !== undefined)             datosLimpios.imagen             = imagen;
        if (cantidad !== undefined)           datosLimpios.cantidad           = Number(cantidad);
        if (precio_unitario !== undefined)    datosLimpios.precio_unitario    = Number(precio_unitario);
        if (id_personalizacion !== undefined) datosLimpios.id_personalizacion = id_personalizacion ? Number(id_personalizacion) : null;

        const cantidadFinal = cantidad !== undefined ? Number(cantidad) : detalle.cantidad;
        const precioFinal   = precio_unitario !== undefined ? Number(precio_unitario) : detalle.precio_unitario;
        datosLimpios.subtotal = cantidadFinal * precioFinal;

        await detalle.update(datosLimpios);
        res.json({ msg: "Detalle de pedido actualizado exitosamente", detalle });
    } catch (err) {
        console.error("❌ Error al actualizar detalle de pedido:", err);
        res.status(500).json({
            msg: "Error interno del servidor al actualizar detalle de pedido.",
            error: err.message
        });
    }
};

// D: DELETE - Eliminar detalle de pedido
const eliminarDetallePedido = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            return res.status(404).json({ msg: "Detalle de pedido no encontrado." });
        }

        await detalle.destroy();
        res.json({ msg: `Detalle de pedido con ID ${id} eliminado exitosamente.` });
    } catch (err) {
        console.error("❌ Error al eliminar detalle de pedido:", err);
        res.status(500).json({
            msg: "Error interno del servidor al eliminar detalle de pedido.",
            error: err.message,
        });
    }
};

module.exports = {
    obtenerDetallesPedidos,
    obtenerDetallePorId,
    obtenerDetallesPorPedido,
    crearDetallePedido,
    actualizarDetallePedido,
    eliminarDetallePedido
};