const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "miclavesupersegura";

// LOGIN
const Login = async (req, res) => {
  const { correo, clave } = req.body;
  
  console.log('🔴 RECIBIDO:', { correo, clave, body: req.body }); // DEBUG

  try {
    const user = await Usuario.findOne({
      where: { correo },
      attributes: ["id_usuario", "nombre", "apellido", "correo", "clave", "id_rol"], // ⬅️ AGREGADO nombre y apellido
    });

    if (!user) {
      return res
        .status(401)
        .json({ msg: "Credenciales inválidas (Correo no encontrado)" });
    }

    let esValida = false;

    // 1) Intentamos comparar con bcrypt (hash guardado)
    if (user.clave && user.clave.startsWith("$2b$")) {
      esValida = await bcrypt.compare(clave, user.clave);
    } else {
      // 2) Fallback: comparación en modo plano (temporal hasta migrar DB)
      const claveDBLimpia = user.clave ? user.clave.trim() : null;
      esValida = clave === claveDBLimpia;
    }

    if (!esValida) {
      return res
        .status(401)
        .json({ msg: "Credenciales inválidas (Clave incorrecta)" });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ⬅️ AGREGADO: Enviar nombre y apellido
    res.json({ 
      msg: "Login exitoso", 
      token, 
      id_rol: user.id_rol,
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido
    });
  } catch (err) {
    console.error("❌ Error en Login:", err);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
      msg: "Error interno del servidor en login.",
      error: err.message
    });
  }
};

// SIGNUP (registro público)
const Signup = async (req, res) => {
  try {
    const { nombre, apellido, documento, correo, clave, usuario } = req.body;

    // Validar correo duplicado
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Hashear la clave
    const salt = await bcrypt.genSalt(10);
    const claveHasheada = await bcrypt.hash(clave, salt);

    // Crear usuario con rol por defecto (2 = usuario normal)
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      documento,
      correo,
      usuario,
      clave: claveHasheada,
      id_rol: 2, // ⬅️ CAMBIADO: Siempre rol 2 (usuario normal)
    });

    // Generar token para login inmediato
    const token = jwt.sign(
      { id: nuevoUsuario.id_usuario, rol: nuevoUsuario.id_rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ⬅️ CAMBIADO: Devolver datos completos del usuario
    res.status(201).json({
      msg: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.id_rol
      },
      token,
    });
  } catch (err) {
    console.error("❌ Error en Signup:", err);
    res.status(500).json({ 
      msg: "Error interno en signup",
      error: err.message 
    });
  }
};

module.exports = { Login, Signup };