const jwt = require("jsonwebtoken");

const validarToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  // FIX: optional chaining en lugar de && encadenado
  if (!token) {
    const authHeader = req.headers.authorization ?? req.headers.Authorization;
    token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  }

  if (!token) {
    return res.status(403).json({ msg: "No se envió token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.rolId  = decoded.rol;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};

// ✅ Solo SuperAdmin (usuario 72 O rol 1)
const soloSuperAdmin = (req, res, next) => {
  if (req.userId === 72 || req.rolId === 1) {
    return next();
  }
  return res.status(403).json({ msg: "Acceso denegado. Solo superadmin." });
};

// ✅ Admin limitado (rol 1 o rol 3)
const soloAdmin = (req, res, next) => {
  if (req.rolId === 1 || req.rolId === 3) {
    return next();
  }
  return res.status(403).json({ msg: "Acceso denegado. Solo administradores." });
};

// ✅ Usuario autenticado (cualquier rol válido)
const usuarioAutenticado = (req, res, next) => {
  next();
};

// ✅ Propietario del recurso O SuperAdmin
const propietarioOSuperAdmin = (req, res, next) => {
  const { id, id_usuario } = req.params;
  const targetId = Number(id ?? id_usuario);

  if (req.userId === 72 || req.rolId === 1 || targetId === req.userId) {
    return next();
  }

  return res.status(403).json({
    msg: "Acceso denegado. Solo puedes acceder a tus propios datos."
  });
};

module.exports = {
  validarToken,
  soloSuperAdmin,
  soloAdmin,
  usuarioAutenticado,
  propietarioOSuperAdmin
};