// controllers/inventario.controller.js
const Inventario = require("../models/inventario");
const db = require("../models");
const Producto = db.Producto || require("../models/Producto");
const DetallePedido = db.DetallePedido || require("../models/DetallePedido");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// ── Helper: obtener imagen de un producto desde detalle_pedido ──────────
const getImagenProducto = async (id_producto) => {
  try {
    const detalle = await DetallePedido.findOne({
      where: { id_producto, imagen: { [Op.ne]: null } },
      order: [["id_detalle", "DESC"]],
      attributes: ["imagen", "nombre_producto"],
    });
    return detalle
      ? { imagen: detalle.imagen, nombre: detalle.nombre_producto }
      : { imagen: null, nombre: null };
  } catch {
    return { imagen: null, nombre: null };
  }
};

// ── Helper: enriquecer lista de movimientos con imagen y nombre ──────────
const enriquecerMovimientos = async (movimientos) => {
  const ids = [...new Set(movimientos.map((m) => m.id_producto))];

  const infoMap = {};
  await Promise.all(
    ids.map(async (id) => {
      const [info, producto] = await Promise.all([
        getImagenProducto(id),
        Producto.findByPk(id, {
          attributes: ["id_producto", "nombre_producto", "stock_disponible"],
        }),
      ]);
      infoMap[id] = {
        imagen: info.imagen,
        nombre_producto:
          producto?.nombre_producto || info.nombre || `Producto #${id}`,
        stock_disponible: producto?.stock_disponible ?? null,
      };
    })
  );

  return movimientos.map((m) => ({
    ...m.toJSON(),
    nombre_producto: infoMap[m.id_producto]?.nombre_producto,
    imagen: infoMap[m.id_producto]?.imagen,
    stock_disponible: infoMap[m.id_producto]?.stock_disponible,
  }));
};

// ─────────────────────────────────────────────
// GET /api/inventario/productos-lista
// ─────────────────────────────────────────────
const obtenerProductosLista = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true },
      attributes: ["id_producto", "nombre_producto", "stock_disponible", "categoria"],
      order: [["nombre_producto", "ASC"]],
    });

    const enriched = await Promise.all(
      productos.map(async (p) => {
        const info = await getImagenProducto(p.id_producto);
        return {
          id_producto: p.id_producto,
          nombre_producto: p.nombre_producto,
          stock_disponible: p.stock_disponible,
          categoria: p.categoria,
          imagen: info.imagen,
        };
      })
    );

    res.json({ success: true, total: enriched.length, productos: enriched });
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    res.status(500).json({ msg: "Error interno.", error: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /api/inventario/movimiento
// ─────────────────────────────────────────────
const registrarMovimiento = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_producto, tipo, cantidad, stock_minimo, motivo, id_referencia } =
      req.body;

    if (!id_producto || !tipo || !cantidad) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "id_producto, tipo y cantidad son obligatorios." });
    }

    if (!["entrada", "salida", "ajuste"].includes(tipo)) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "tipo debe ser 'entrada', 'salida' o 'ajuste'." });
    }

    if (Number.parseInt(cantidad) <= 0) {
      await t.rollback();
      return res
        .status(400)
        .json({ msg: "La cantidad debe ser mayor a 0." });
    }

    const producto = await Producto.findByPk(id_producto, { transaction: t });
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ msg: "Producto no encontrado." });
    }

    const stockActual = producto.stock_disponible;
    let nuevoStock;

    if (tipo === "entrada") {
      nuevoStock = stockActual + Number.parseInt(cantidad);
    } else if (tipo === "salida") {
      if (stockActual < Number.parseInt(cantidad)) {
        await t.rollback();
        return res.status(400).json({
          msg: `Stock insuficiente. Disponible: ${stockActual}, solicitado: ${cantidad}`,
        });
      }
      nuevoStock = stockActual - Number.parseInt(cantidad);
    } else {
      // ajuste: sobreescribe directamente
      nuevoStock = Number.parseInt(cantidad);
    }

    await producto.update({ stock_disponible: nuevoStock }, { transaction: t });

    const movimiento = await Inventario.create(
      {
        id_producto,
        tipo,
        cantidad: Number.parseInt(cantidad),
        stock_resultante: nuevoStock,
        stock_minimo: stock_minimo !== undefined ? Number.parseInt(stock_minimo) : 5,
        motivo: motivo || null,
        id_referencia: id_referencia || null,
        fecha_movimiento: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    const info = await getImagenProducto(id_producto);

    const alerta =
      nuevoStock <= movimiento.stock_minimo
        ? `⚠️ Stock bajo: ${nuevoStock} unidades (mínimo: ${movimiento.stock_minimo})`
        : null;

    res.status(201).json({
      success: true,
      msg: "Movimiento registrado exitosamente.",
      movimiento: {
        ...movimiento.toJSON(),
        nombre_producto: producto.nombre_producto,
        imagen: info.imagen,
      },
      stock_actual: nuevoStock,
      ...(alerta && { alerta }),
    });
  } catch (err) {
    await t.rollback();
    console.error("❌ Error al registrar movimiento:", err);
    res
      .status(500)
      .json({ msg: "Error interno al registrar movimiento.", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/inventario
// ─────────────────────────────────────────────
const obtenerMovimientos = async (req, res) => {
  try {
    const { tipo, fecha_inicio, fecha_fin, id_producto } = req.query;
    const where = {};

    if (tipo) where.tipo = tipo;
    if (id_producto) where.id_producto = id_producto;
    if (fecha_inicio && fecha_fin) {
      where.fecha_movimiento = {
        [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)],
      };
    }

    const movimientos = await Inventario.findAll({
      where,
      order: [["fecha_movimiento", "DESC"]],
    });

    const enriched = await enriquecerMovimientos(movimientos);

    res.json({ success: true, total: enriched.length, movimientos: enriched });
  } catch (err) {
    console.error("❌ Error al obtener movimientos:", err);
    res.status(500).json({ msg: "Error interno.", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/inventario/producto/:id_producto
// ─────────────────────────────────────────────
const obtenerHistorialProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado." });
    }

    const movimientos = await Inventario.findAll({
      where: { id_producto },
      order: [["fecha_movimiento", "DESC"]],
    });

    const info = await getImagenProducto(id_producto);
    const enriched = movimientos.map((m) => ({
      ...m.toJSON(),
      nombre_producto: producto.nombre_producto,
      imagen: info.imagen,
    }));

    res.json({
      success: true,
      producto: {
        id_producto: producto.id_producto,
        nombre: producto.nombre_producto,
        stock_actual: producto.stock_disponible,
        imagen: info.imagen,
      },
      total_movimientos: movimientos.length,
      movimientos: enriched,
    });
  } catch (err) {
    console.error("❌ Error al obtener historial:", err);
    res.status(500).json({ msg: "Error interno.", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/inventario/stock-bajo
// ─────────────────────────────────────────────
const obtenerStockBajo = async (req, res) => {
  try {
    const ultimosMovimientos = await Inventario.findAll({
      attributes: [
        "id_producto",
        [sequelize.fn("MAX", sequelize.col("id_inventario")), "ultimo_id"],
      ],
      group: ["id_producto"],
    });

    const ids = ultimosMovimientos.map((m) => m.getDataValue("ultimo_id"));

    const movimientos = await Inventario.findAll({
      where: { id_inventario: { [Op.in]: ids } },
    });

    const productosStockBajo = movimientos.filter(
      (m) => m.stock_resultante <= m.stock_minimo
    );

    const enriched = await Promise.all(
      productosStockBajo.map(async (m) => {
        const info = await getImagenProducto(m.id_producto);
        const producto = await Producto.findByPk(m.id_producto, {
          attributes: ["nombre_producto"],
        });
        return {
          id_producto: m.id_producto,
          nombre_producto: producto?.nombre_producto || `Producto #${m.id_producto}`,
          imagen: info.imagen,
          stock_actual: m.stock_resultante,
          stock_minimo: m.stock_minimo,
        };
      })
    );

    res.json({ success: true, total: enriched.length, productos: enriched });
  } catch (err) {
    console.error("❌ Error al obtener stock bajo:", err);
    res.status(500).json({ msg: "Error interno.", error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/inventario/:id
// ─────────────────────────────────────────────
const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await Inventario.findByPk(id);

    if (!movimiento) {
      return res.status(404).json({ msg: "Movimiento no encontrado." });
    }

    await movimiento.destroy();
    res.json({
      success: true,
      msg: `Movimiento #${id} eliminado. Recuerda verificar el stock del producto manualmente.`,
    });
  } catch (err) {
    console.error("❌ Error al eliminar movimiento:", err);
    res.status(500).json({ msg: "Error interno.", error: err.message });
  }
};

module.exports = {
  registrarMovimiento,
  obtenerProductosLista,
  obtenerHistorialProducto,
  obtenerMovimientos,
  obtenerStockBajo,
  eliminarMovimiento,
};