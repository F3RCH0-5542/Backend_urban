const { Router } = require("express");
const { 
    obtenerRoles, 
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
} = require("../controller/rol.controller");
const { validarToken, soloSuperAdmin } = require("../middlewares/auth.middleware");

const router = Router();

// R: READ - Cualquier usuario autenticado puede ver roles

router.get("/", validarToken, obtenerRoles);
router.get("/:id", validarToken, obtenerRolPorId);

// C: CREATE - Solo superadmin puede crear roles
router.post("/", validarToken, soloSuperAdmin, crearRol);

// U: UPDATE - Solo superadmin puede actualizar roles
router.put("/:id", validarToken, soloSuperAdmin, actualizarRol);

// D: DELETE - Solo superadmin puede eliminar roles
router.delete("/:id", validarToken, soloSuperAdmin, eliminarRol);

router.patch("/:id", validarToken, soloSuperAdmin, actualizarRol);

module.exports = router;