const { Router } = require("express");
const { Login, Signup } = require("../controller/auth.controller");

const router = Router();

/* ======================================================
   AUTH
   ====================================================== */

// 🔑 LOGIN
router.post("/login", Login);

// 📝 REGISTRO (usuario normal)
router.post("/signup", Signup);

module.exports = router;
