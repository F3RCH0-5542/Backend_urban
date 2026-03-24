const { Router } = require("express");
const { 
    obtenerPagos,
    obtenerPagoPorId,
    obtenerPagosPorPedido,
    obtenerPagosPorEstado,   // ✅ nuevo
    crearPago,
    actualizarPago,
    eliminarPago,
    obtenerPagosPorFecha,
    obtenerResumenPorMetodo
} = require("../controller/pago.controller");
const { validarToken, soloSuperAdmin, propietarioOSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Solo SuperAdmin puede ver todos los pagos
router.get("/", validarToken, soloSuperAdmin, obtenerPagos);
router.get("/fecha", validarToken, soloSuperAdmin, obtenerPagosPorFecha);
router.get("/resumen", validarToken, soloSuperAdmin, obtenerResumenPorMetodo);

// ✅ NUEVO: filtrar por estado_pago
router.get("/estado/:estado", validarToken, soloSuperAdmin, obtenerPagosPorEstado);

// Usuario puede ver pagos de sus propios pedidos, SuperAdmin puede ver cualquiera
router.get("/pedido/:id_pedido", validarToken, propietarioOSuperAdmin, obtenerPagosPorPedido);
router.get("/:id", validarToken, propietarioOSuperAdmin, obtenerPagoPorId);

// C: CREATE - Usuarios pueden crear pagos para sus pedidos
router.post("/", validarToken, crearPago);

// U: UPDATE - Solo SuperAdmin puede actualizar pagos
router.put("/:id", validarToken, soloSuperAdmin, actualizarPago);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarPago);

// D: DELETE - Solo SuperAdmin puede eliminar pagos
router.delete("/:id", validarToken, soloSuperAdmin, eliminarPago);

module.exports = router;