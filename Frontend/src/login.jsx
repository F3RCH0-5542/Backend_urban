// src/login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState(""); // success o danger

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Llamar a la API de Node.js
      const respuesta = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await respuesta.json();

      // Verificar si el login fue exitoso
      if (data.msg !== "Login exitoso") {
        throw new Error(data.msg || "Login incorrecto");
      }

      // Determinar el rol del usuario
      let userRole = 'usuario'; // Por defecto
      
      if (data.id_rol === 1) {
        userRole = 'admin';
      } else {
        userRole = 'usuario';
      }

      // Preparar datos del usuario
      const usuarioData = {
        id: data.id_usuario,
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        correo: correo,
        rol: data.id_rol,
        rolNombre: userRole // Agregar el nombre del rol
      };

      // Guardar en localStorage
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioData));
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", userRole); // ⬅️ CRUCIAL para el sistema de rutas

      // Guardar en el CONTEXTO GLOBAL
      login(usuarioData);

      setTipo("success");
      setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");

      setTimeout(() => {
        // ⬅️ SOLO ROL 1 ES ADMIN
        if (data.id_rol === 1) {
          // Admin → Panel de administración
          navigate("/admin");
        } else {
          // Usuarios normales (rol 2, 3, etc.) → Tienda
          navigate("/home");
        }
      }, 1500);
      
    } catch (error) {
      setTipo("danger");
      setMensaje("❌ Correo o contraseña incorrectos");
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="box">
        <span className="borderline"></span>

        <form onSubmit={handleSubmit} noValidate>
          <h2>Iniciar sesión</h2>

          {mensaje && (
            <div
              className={`alert alert-${tipo}`}
              style={{
                marginBottom: "15px",
                fontFamily: "Arial",
                padding: "10px",
                background: tipo === "danger" ? "#fdd" : "#dfd",
                borderLeft: `5px solid ${
                  tipo === "danger" ? "red" : "green"
                }`,
                color: tipo === "danger" ? "red" : "green",
                borderRadius: "4px"
              }}
            >
              {mensaje}
            </div>
          )}

          <div className="inputbox">
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
            />
            <span>Correo electrónico</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type="password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
            />
            <span>Contraseña</span>
            <i></i>
          </div>

          <div className="links">
            <a href="./registrar">Registrarse</a>
            <a href="/">Volver al inicio</a>
          </div>

          <input type="submit" value="Iniciar sesión" />
        </form>
      </div>
    </div>
  );
}

export default Login;