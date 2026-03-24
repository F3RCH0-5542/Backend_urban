const { Router } = require("express");

const {
    obtenerPedidos,
    obtenerPedidoPorId,
    obtenerPedidosPorUsuario,
    obtenerPedidosPorEstado,
    crearPedido,
    crearPedidoDesdePersonalizacion,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidosPorFecha
} = require("../controller/pedido.controller");

const {
    validarToken,
    soloSuperAdmin,
    propietarioOSuperAdmin
} = require("../middlewares/auth.middleware");

const router = Router();

// 🔐 Solo SuperAdmin
router.get("/", validarToken, soloSuperAdmin, obtenerPedidos);
router.get("/fecha", validarToken, soloSuperAdmin, obtenerPedidosPorFecha);
router.get("/estado/:estado", validarToken, soloSuperAdmin, obtenerPedidosPorEstado);

// ✅ Mis pedidos (usuario autenticado via token)
router.get("/mis-pedidos", validarToken, obtenerPedidosPorUsuario);

// 👤 Usuario ve los suyos / SuperAdmin cualquiera
router.get("/usuario/:id_usuario", validarToken, propietarioOSuperAdmin, obtenerPedidosPorUsuario);
router.get("/:id", validarToken, propietarioOSuperAdmin, obtenerPedidoPorId);

// ✅ NUEVO: crear pedido desde personalización (va ANTES del POST /)
router.post("/desde-personalizacion", validarToken, crearPedidoDesdePersonalizacion);

// ➕ Crear pedido normal
router.post("/", validarToken, crearPedido);

// ✏️ Actualizar pedido
router.put("/:id", validarToken, soloSuperAdmin, actualizarPedido);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarPedido);

// 🗑️ Eliminar pedido
router.delete("/:id", validarToken, soloSuperAdmin, eliminarPedido);

module.exports = router;