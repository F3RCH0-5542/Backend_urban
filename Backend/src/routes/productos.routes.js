const { Router } = require("express");
const { 
    obtenerProductos,
    obtenerProductoPorId,
    obtenerProductosPorCategoria,
    obtenerProductosStockBajo,
    crearProducto,
    actualizarProducto,
    actualizarProductoParcial,
    eliminarProducto,
    buscarProductosPorNombre
} = require("../controller/productos.controller");
const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Usuarios autenticados pueden ver productos (catálogo público)
router.get("/", validarToken, obtenerProductos);
router.get("/stock-bajo", validarToken, soloSuperAdmin, obtenerProductosStockBajo);
router.get("/buscar", validarToken, buscarProductosPorNombre);
router.get("/categoria/:categoria", validarToken, obtenerProductosPorCategoria);
router.get("/:id", validarToken, obtenerProductoPorId);

// C: CREATE - Solo SuperAdmin
router.post("/", validarToken, soloSuperAdmin, crearProducto);

// U: UPDATE - Solo SuperAdmin
router.put("/:id", validarToken, soloSuperAdmin, actualizarProducto);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarProductoParcial);

// D: DELETE - Solo SuperAdmin
router.delete("/:id", validarToken, soloSuperAdmin, eliminarProducto);

module.exports = router;