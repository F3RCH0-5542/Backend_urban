const { Router } = require("express");
const {
    obtenerPersonalizaciones,
    obtenerPersonalizacionPorId,
    obtenerPersonalizacionesPorPedido,
    obtenerPersonalizacionesPorEstado,
    crearPersonalizacion,
    actualizarPersonalizacion,
    eliminarPersonalizacion,
    buscarPersonalizacionesPorDescripcion
} = require("../controller/personalizacion.controller");

const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// ✅ USUARIO: ver sus propias personalizaciones
router.get("/mis-personalizaciones", validarToken, async (req, res) => {
    const { Personalizacion, Pedido, Producto } = require("../models");
    try {
        const personalizaciones = await Personalizacion.findAll({
            include: [{
                model: Pedido,
                attributes: ["id_pedido", "fecha_pedido", "total", "estado", "id_usuario"],
                where: { id_usuario: req.userId },
                required: true
            }, {
                model: Producto,
                required: false
            }],
            order: [["id_personalizacion", "DESC"]]
        });
        res.json(personalizaciones);
    } catch (err) {
        console.error("Error mis-personalizaciones:", err);
        res.status(500).json({ msg: "Error al consultar personalizaciones.", error: err.message });
    }
});

// ADMIN: ver todas
router.get("/", validarToken, soloSuperAdmin, obtenerPersonalizaciones);
router.get("/buscar", validarToken, soloSuperAdmin, buscarPersonalizacionesPorDescripcion);
router.get("/estado/:estado", validarToken, soloSuperAdmin, obtenerPersonalizacionesPorEstado);

// Usuario puede ver las de sus pedidos
router.get("/pedido/:id_pedido", validarToken, obtenerPersonalizacionesPorPedido);
router.get("/:id", validarToken, obtenerPersonalizacionPorId);

// CREATE - Usuario puede crear
router.post("/", validarToken, crearPersonalizacion);

// UPDATE/DELETE - Solo SuperAdmin
router.put("/:id", validarToken, soloSuperAdmin, actualizarPersonalizacion);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarPersonalizacion);
router.delete("/:id", validarToken, soloSuperAdmin, eliminarPersonalizacion);

module.exports = router;