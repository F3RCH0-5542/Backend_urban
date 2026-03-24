const { Router } = require("express");
const { 
    obtenerEnvios,
    obtenerEnvioPorId,
    obtenerEnviosPorPedido,
    obtenerEnviosPorEstado,     // ✅ nuevo
    crearEnvio,
    actualizarEnvio,
    actualizarEnvioParcial,
    eliminarEnvio,
    obtenerEnviosPorFecha,
    obtenerEstadisticasEnvios
} = require("../controller/envio.controller");
const { validarToken, soloSuperAdmin, propietarioOSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Solo SuperAdmin puede ver todos los envíos
router.get("/", validarToken, soloSuperAdmin, obtenerEnvios);
router.get("/fecha", validarToken, soloSuperAdmin, obtenerEnviosPorFecha);
router.get("/estadisticas", validarToken, soloSuperAdmin, obtenerEstadisticasEnvios);

// ✅ NUEVO: filtrar por estado 
router.get("/estado/:estado", validarToken, soloSuperAdmin, obtenerEnviosPorEstado);

// Usuario puede ver envíos de sus propios pedidos
router.get("/pedido/:id_pedido", validarToken, propietarioOSuperAdmin, obtenerEnviosPorPedido);
router.get("/:id", validarToken, propietarioOSuperAdmin, obtenerEnvioPorId);

// C: CREATE
router.post("/", validarToken, crearEnvio);

// U: UPDATE - Solo SuperAdmin
router.put("/:id", validarToken, soloSuperAdmin, actualizarEnvio);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarEnvioParcial);

// D: DELETE - Solo SuperAdmin
router.delete("/:id", validarToken, soloSuperAdmin, eliminarEnvio);

module.exports = router;