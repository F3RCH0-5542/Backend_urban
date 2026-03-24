const { Op } = require("sequelize");
const db = require("../models");
const Producto = db.Producto || require("../models/Producto");

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            where: { activo: 1 },
            order: [['id_producto', 'DESC']]
        });
        res.json({ success: true, data: productos, total: productos.length });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ success: false, message: "Error al obtener productos", error: error.message });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        res.json({ success: true, data: producto });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({ success: false, message: "Error al obtener producto", error: error.message });
    }
};

const obtenerProductosPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const productos = await Producto.findAll({ where: { categoria, activo: 1 } });
        res.json({ success: true, data: productos, total: productos.length, categoria });
    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
        res.status(500).json({ success: false, message: "Error al obtener productos por categoría", error: error.message });
    }
};

const obtenerProductosStockBajo = async (req, res) => {
    try {
        const limite = req.query.limite || 10;
        const productos = await Producto.findAll({
            where: { stock_disponible: { [Op.lte]: limite }, activo: 1 },
            order: [['stock_disponible', 'ASC']]
        });
        res.json({ success: true, data: productos, total: productos.length, limite });
    } catch (error) {
        console.error("Error al obtener productos con stock bajo:", error);
        res.status(500).json({ success: false, message: "Error al obtener productos con stock bajo", error: error.message });
    }
};

const crearProducto = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio_base, categoria, stock_disponible } = req.body;

        if (!nombre_producto || !precio_base) {
            return res.status(400).json({ success: false, message: "Nombre del producto y precio son obligatorios" });
        }

        if (Number(precio_base) <= 0) {
            return res.status(400).json({ success: false, message: "El precio debe ser mayor a 0" });
        }

        const nuevoProducto = await Producto.create({
            nombre_producto,
            descripcion:      descripcion      || null,
            precio_base,
            categoria:        categoria        || null,
            stock_disponible: stock_disponible || 0,
            activo: 1
        });

        res.status(201).json({ success: true, message: "Producto creado exitosamente", data: nuevoProducto });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ success: false, message: "Error al crear producto", error: error.message });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_producto, descripcion, precio_base, categoria, stock_disponible, activo } = req.body;

        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

        if (precio_base !== undefined && Number(precio_base) <= 0) {
            return res.status(400).json({ success: false, message: "El precio debe ser mayor a 0" });
        }

        await producto.update({
            nombre_producto:  nombre_producto  ?? producto.nombre_producto,
            descripcion:      descripcion      !== undefined ? descripcion      : producto.descripcion,
            precio_base:      precio_base      ?? producto.precio_base,
            categoria:        categoria        !== undefined ? categoria        : producto.categoria,
            stock_disponible: stock_disponible !== undefined ? stock_disponible : producto.stock_disponible,
            activo:           activo           !== undefined ? activo           : producto.activo
        });

        res.json({ success: true, message: "Producto actualizado exitosamente", data: producto });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ success: false, message: "Error al actualizar producto", error: error.message });
    }
};

const actualizarProductoParcial = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });

        const { precio_base } = req.body;

        if (precio_base !== undefined && Number(precio_base) <= 0) {
            return res.status(400).json({ success: false, message: "El precio debe ser mayor a 0" });
        }

        await producto.update(req.body);
        res.json({ success: true, message: "Producto actualizado exitosamente", data: producto });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ success: false, message: "Error al actualizar producto", error: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        await producto.update({ activo: 0 });
        res.json({ success: true, message: "Producto desactivado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ success: false, message: "Error al eliminar producto", error: error.message });
    }
};

const buscarProductosPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;
        if (!nombre) return res.status(400).json({ success: false, message: "Debe proporcionar un nombre para buscar" });

        const productos = await Producto.findAll({
            where: { nombre_producto: { [Op.like]: `%${nombre}%` }, activo: 1 }
        });
        res.json({ success: true, data: productos, total: productos.length, busqueda: nombre });
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ success: false, message: "Error al buscar productos", error: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosStockBajo,
    crearProducto,
    actualizarProducto,
    actualizarProductoParcial,
    eliminarProducto,
    buscarProductosPorNombre
};