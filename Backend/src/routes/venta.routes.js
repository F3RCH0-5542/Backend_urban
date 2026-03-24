const { Router } = require("express");
const { 
    obtenerVentas,
    obtenerVentaPorId,
    obtenerVentasPorUsuario,
    obtenerVentasPorEstado,     
    crearVenta,
    actualizarVenta,
    actualizarVentaParcial,
    obtenerVentasPorFecha,
    obtenerEstadisticasVentas
} = require("../controller/Venta.controller");
const { validarToken, soloSuperAdmin, propietarioOSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Solo SuperAdmin puede ver todas las ventas y estadísticas
router.get("/", validarToken, soloSuperAdmin, obtenerVentas);
router.get("/fecha", validarToken, soloSuperAdmin, obtenerVentasPorFecha);
router.get("/estadisticas", validarToken, soloSuperAdmin, obtenerEstadisticasVentas);

// ✅ NUEVO: filtrar por estado (solo admin)
router.get("/estado/:estado", validarToken, soloSuperAdmin, obtenerVentasPorEstado);

// Usuario puede ver sus propias ventas, SuperAdmin puede ver cualquiera
router.get("/usuario/:id_usuario", validarToken, propietarioOSuperAdmin, obtenerVentasPorUsuario);
router.get("/:id", validarToken, propietarioOSuperAdmin, obtenerVentaPorId);

// C: CREATE - Usuario puede registrar su compra (descuenta stock automáticamente)
router.post("/", validarToken, crearVenta);

// U: UPDATE - Solo SuperAdmin puede actualizar ventas
router.put("/:id", validarToken, soloSuperAdmin, actualizarVenta);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarVentaParcial);

// ❌ DELETE ELIMINADO - Las ventas NO se eliminan (historial contable)

module.exports = router;