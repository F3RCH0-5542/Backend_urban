const { Router } = require("express");
const { 
    obtenerRegistros,
    obtenerRegistroPorId,
    obtenerRegistrosPorUsuario,
    crearRegistro,
    actualizarRegistro,
    actualizarRegistroParcial,
    eliminarRegistro,
    obtenerRegistrosPorRol,
    obtenerResumenPorRol
} = require("../controller/registro.controller");
const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Solo SuperAdmin puede ver logs de auditoría
router.get("/", validarToken, soloSuperAdmin, obtenerRegistros);
router.get("/rol", validarToken, soloSuperAdmin, obtenerRegistrosPorRol);
router.get("/resumen", validarToken, soloSuperAdmin, obtenerResumenPorRol);
router.get("/usuario/:id_usuario", validarToken, soloSuperAdmin, obtenerRegistrosPorUsuario);
router.get("/:id", validarToken, soloSuperAdmin, obtenerRegistroPorId);

// C: CREATE - Solo SuperAdmin puede crear registros de auditoría
router.post("/", validarToken, soloSuperAdmin, crearRegistro);

// U: UPDATE - Solo SuperAdmin puede modificar logs
router.put("/:id", validarToken, soloSuperAdmin, actualizarRegistro);
router.patch("/:id", validarToken, soloSuperAdmin, actualizarRegistroParcial);

// D: DELETE - Solo SuperAdmin puede eliminar logs
router.delete("/:id", validarToken, soloSuperAdmin, eliminarRegistro);

module.exports = router;