const { Router } = require("express");
const { 
    obtenerDetallesPedidos,
    obtenerDetallePorId,
    obtenerDetallesPorPedido,
    crearDetallePedido,
    actualizarDetallePedido,
    eliminarDetallePedido
} = require("../controller/detallePedido.controller");
const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Solo SuperAdmin puede ver detalles de pedidos
router.get("/", validarToken, soloSuperAdmin, obtenerDetallesPedidos);
router.get("/pedido/:id_pedido", validarToken, soloSuperAdmin, obtenerDetallesPorPedido);
router.get("/:id", validarToken, soloSuperAdmin, obtenerDetallePorId);

// C: CREATE - Solo SuperAdmin puede crear detalles de pedidos
router.post("/", validarToken, soloSuperAdmin, crearDetallePedido);

// U: UPDATE - Solo SuperAdmin puede actualizar detalles de pedidos
router.put("/:id", validarToken, soloSuperAdmin, actualizarDetallePedido);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarDetallePedido);

// D: DELETE - Solo SuperAdmin puede eliminar detalles de pedidos
router.delete("/:id", validarToken, soloSuperAdmin, eliminarDetallePedido);

module.exports = router;