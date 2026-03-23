// controller/personalizacion.controller.js
const { Personalizacion, Pedido, Usuario, Producto } = require("../models");
const { Op } = require("sequelize");

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'aprobada', 'rechazada'];
const TIPOS_VALIDOS   = ['bordado', 'estampado', 'parche', 'tie-dye', 'otro'];
const TALLAS_VALIDAS  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICA'];

const includeCompleto = [
    {
        model: Pedido,
        attributes: ["id_pedido", "fecha_pedido", "total", "estado", "id_usuario"],
        include: [{
            model: Usuario,
            attributes: ["nombre", "apellido", "correo"]
        }]
    },
    {
        model: Producto,
        required: false
    }
];

const obtenerPersonalizaciones = async (req, res) => {
    try {
        const { rolId, userId } = req;
        const where = rolId !== 1 ? { "$Pedido.id_usuario$": userId } : {};
        const personalizaciones = await Personalizacion.findAll({
            where,
            include: includeCompleto,
            order: [["id_personalizacion", "DESC"]]
        });
        res.json(personalizaciones);
    } catch (err) {
        console.error("Error al obtener personalizaciones:", err);
        res.status(500).json({ msg: "Error al consultar personalizaciones.", error: err.message });
    }
};

const obtenerPersonalizacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { rolId, userId } = req;
        const personalizacion = await Personalizacion.findByPk(id, { include: includeCompleto });
        if (!personalizacion)
            return res.status(404).json({ msg: "Personalización no encontrada." });
        if (rolId !== 1 && personalizacion.Pedido.id_usuario !== userId)
            return res.status(403).json({ msg: "Acceso denegado." });
        res.json(personalizacion);
    } catch (err) {
        console.error("Error al obtener personalización por ID:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const obtenerPersonalizacionesPorPedido = async (req, res) => {
    try {
        const { id_pedido } = req.params;
        const { rolId, userId } = req;
        const pedido = await Pedido.findByPk(id_pedido);
        if (!pedido)
            return res.status(404).json({ msg: "Pedido no encontrado." });
        if (rolId !== 1 && pedido.id_usuario !== userId)
            return res.status(403).json({ msg: "Acceso denegado." });
        const personalizaciones = await Personalizacion.findAll({
            where: { id_pedido },
            include: includeCompleto,
            order: [["id_personalizacion", "DESC"]]
        });
        res.json(personalizaciones);
    } catch (err) {
        console.error("Error al obtener personalizaciones por pedido:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const obtenerPersonalizacionesPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        if (!ESTADOS_VALIDOS.includes(estado))
            return res.status(400).json({ msg: "Estado no válido.", estadosValidos: ESTADOS_VALIDOS });
        const personalizaciones = await Personalizacion.findAll({
            where: { estado },
            include: includeCompleto,
            order: [["id_personalizacion", "DESC"]]
        });
        res.json(personalizaciones);
    } catch (err) {
        console.error("Error al obtener por estado:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const crearPersonalizacion = async (req, res) => {
    try {
        const {
            id_producto, tipo_personalizacion, descripcion_personalizacion,
            imagen_referencia, color_deseado, talla, precio_adicional
        } = req.body;
        const { userId } = req;

        if (!tipo_personalizacion)
            return res.status(400).json({ msg: "tipo_personalizacion es requerido." });
        if (!TIPOS_VALIDOS.includes(tipo_personalizacion))
            return res.status(400).json({ msg: "Tipo no válido.", tiposValidos: TIPOS_VALIDOS });
        if (!descripcion_personalizacion)
            return res.status(400).json({ msg: "descripcion_personalizacion es requerida." });
        if (talla && !TALLAS_VALIDAS.includes(talla.toUpperCase()))
            return res.status(400).json({ msg: "Talla no válida.", tallasValidas: TALLAS_VALIDAS });
        if (id_producto) {
            const producto = await Producto.findByPk(id_producto);
            if (!producto)
                return res.status(404).json({ msg: "Producto no encontrado." });
        }

        // ✅ SonarQube fix: Number.parseFloat / Number.isNaN
        const precioFinal = precio_adicional ? Number.parseFloat(precio_adicional) : 0;
        if (Number.isNaN(precioFinal) || precioFinal < 0)
            return res.status(400).json({ msg: "precio_adicional debe ser un número positivo." });

        const nuevoPedido = await Pedido.create({
            fecha_pedido: new Date(),
            total: precioFinal,
            estado: 'pendiente',
            id_usuario: userId
        });

        const nuevaPersonalizacion = await Personalizacion.create({
            id_pedido:                   nuevoPedido.id_pedido,
            id_producto:                 id_producto || null,
            tipo_personalizacion:        tipo_personalizacion.trim(),
            descripcion_personalizacion: descripcion_personalizacion.trim(),
            imagen_referencia:           imagen_referencia || null,
            color_deseado:               color_deseado?.trim() || null,
            talla:                       talla?.toUpperCase() || null,
            estado:                      'pendiente',
            precio_adicional:            precioFinal
        });

        const resultado = await Personalizacion.findByPk(
            nuevaPersonalizacion.id_personalizacion,
            { include: includeCompleto }
        );

        res.status(201).json({
            msg: "Solicitud de personalización creada correctamente",
            personalizacion: resultado,
            pedido: nuevoPedido
        });
    } catch (err) {
        console.error("Error al crear personalización:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const actualizarPersonalizacion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            tipo_personalizacion, descripcion_personalizacion, imagen_referencia,
            color_deseado, talla, estado, precio_adicional
        } = req.body;

        const personalizacion = await Personalizacion.findByPk(id);
        if (!personalizacion)
            return res.status(404).json({ msg: "Personalización no encontrada." });
        if (estado && !ESTADOS_VALIDOS.includes(estado))
            return res.status(400).json({ msg: "Estado no válido.", estadosValidos: ESTADOS_VALIDOS });
        if (talla && !TALLAS_VALIDAS.includes(talla.toUpperCase()))
            return res.status(400).json({ msg: "Talla no válida." });

        if (precio_adicional !== undefined) {
            // ✅ SonarQube fix: Number.parseFloat / Number.isNaN
            const precio = Number.parseFloat(precio_adicional);
            if (Number.isNaN(precio) || precio < 0)
                return res.status(400).json({ msg: "precio_adicional debe ser un número positivo." });
        }

        const datosLimpios = {};
        if (tipo_personalizacion)            datosLimpios.tipo_personalizacion        = tipo_personalizacion.trim();
        if (descripcion_personalizacion)     datosLimpios.descripcion_personalizacion = descripcion_personalizacion.trim();
        if (imagen_referencia !== undefined) datosLimpios.imagen_referencia           = imagen_referencia;
        if (color_deseado !== undefined)     datosLimpios.color_deseado              = color_deseado?.trim() || null;
        if (talla !== undefined)             datosLimpios.talla                      = talla?.toUpperCase() || null;
        if (estado)                          datosLimpios.estado                     = estado;
        if (precio_adicional !== undefined)  datosLimpios.precio_adicional           = Number.parseFloat(precio_adicional);

        await personalizacion.update(datosLimpios);

        if (precio_adicional !== undefined) {
            await Pedido.update(
                { total: Number.parseFloat(precio_adicional) },
                { where: { id_pedido: personalizacion.id_pedido } }
            );
        }

        const actualizada = await Personalizacion.findByPk(id, { include: includeCompleto });
        res.json({ msg: "Personalización actualizada", personalizacion: actualizada });
    } catch (err) {
        console.error("Error al actualizar personalización:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const eliminarPersonalizacion = async (req, res) => {
    try {
        const { id } = req.params;
        const personalizacion = await Personalizacion.findByPk(id);
        if (!personalizacion)
            return res.status(404).json({ msg: "Personalización no encontrada." });
        await personalizacion.destroy();
        res.json({ msg: "Personalización eliminada correctamente." });
    } catch (err) {
        console.error("Error al eliminar personalización:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

const buscarPersonalizacionesPorDescripcion = async (req, res) => {
    try {
        const { busqueda } = req.query;
        if (!busqueda)
            return res.status(400).json({ msg: "Parámetro busqueda requerido." });
        const personalizaciones = await Personalizacion.findAll({
            where: {
                [Op.or]: [
                    { descripcion_personalizacion: { [Op.like]: `%${busqueda}%` } },
                    { tipo_personalizacion:         { [Op.like]: `%${busqueda}%` } },
                    { color_deseado:                { [Op.like]: `%${busqueda}%` } },
                    { talla:                        { [Op.like]: `%${busqueda}%` } }
                ]
            },
            include: includeCompleto,
            order: [["id_personalizacion", "DESC"]]
        });
        res.json(personalizaciones);
    } catch (err) {
        console.error("Error al buscar personalizaciones:", err);
        res.status(500).json({ msg: "Error interno del servidor.", error: err.message });
    }
};

module.exports = {
    obtenerPersonalizaciones,
    obtenerPersonalizacionPorId,
    obtenerPersonalizacionesPorPedido,
    obtenerPersonalizacionesPorEstado,
    crearPersonalizacion,
    actualizarPersonalizacion,
    eliminarPersonalizacion,
    buscarPersonalizacionesPorDescripcion
};