// src/routes/inventario.routes.js
const { Router } = require("express");
const {
  registrarMovimiento,
  obtenerProductosLista,
  obtenerHistorialProducto,
  obtenerMovimientos,
  obtenerStockBajo,
  eliminarMovimiento,
} = require("../controller/inventario.controller");
const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// Lista de productos con imagen (para el formulario Flutter)
router.get("/productos-lista", validarToken, soloSuperAdmin, obtenerProductosLista);

// Todos los movimientos (filtros opcionales: tipo, fecha, id_producto)
router.get("/", validarToken, soloSuperAdmin, obtenerMovimientos);

// Productos con stock bajo
router.get("/stock-bajo", validarToken, soloSuperAdmin, obtenerStockBajo);

// Historial de un producto específico
router.get("/producto/:id_producto", validarToken, soloSuperAdmin, obtenerHistorialProducto);

// Registrar movimiento (entrada / salida / ajuste)
router.post("/movimiento", validarToken, soloSuperAdmin, registrarMovimiento);

// Eliminar movimiento
router.delete("/:id", validarToken, soloSuperAdmin, eliminarMovimiento);

module.exports = router;