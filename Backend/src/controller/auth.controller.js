const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "miclavesupersegura";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const Login = async (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({ msg: "Correo y contraseña son requeridos." });
  }

  try {
    const user = await Usuario.findOne({
      where: { correo },
      attributes: ["id_usuario", "nombre", "apellido", "correo", "clave", "id_rol"],
    });

    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas." });
    }

    const esValida = await bcrypt.compare(clave, user.clave);

    if (!esValida) {
      return res.status(401).json({ msg: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: user.id_usuario, rol: user.id_rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      msg: "Login exitoso",
      token,
      id_rol: user.id_rol,
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error interno del servidor en login." });
  }
};

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
const Signup = async (req, res) => {
  const { nombre, apellido, documento, correo, clave, usuario } = req.body;

  if (!nombre || !apellido || !documento || !correo || !clave) {
    return res.status(400).json({ msg: "Todos los campos son requeridos." });
  }

  try {
    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const claveHasheada = await bcrypt.hash(clave, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      documento,
      correo,
      usuario,
      clave: claveHasheada,
      id_rol: 2,
    });

    const token = jwt.sign(
      { id: nuevoUsuario.id_usuario, rol: nuevoUsuario.id_rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.id_rol,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Error interno en signup." });
  }
};

module.exports = { Login, Signup };