// src/registrar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Registrar() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    usuario: "",
    correo: "",
    clave: "",
    confirmarClave: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false);
  const [fortalezaClave, setFortalezaClave] = useState(0);

  const calcularFortaleza = (clave) => {
    let fortaleza = 0;
    if (clave.length >= 6) fortaleza += 25;
    if (clave.length >= 8) fortaleza += 25;
    if (/[A-Z]/.test(clave)) fortaleza += 25;
    if (/[0-9]/.test(clave)) fortaleza += 25;
    return fortaleza;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Calcular fortaleza de la contraseña
    if (name === "clave") {
      setFortalezaClave(calcularFortaleza(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim() ||
      !formData.documento.trim() || !formData.usuario.trim() ||
      !formData.correo.trim() || !formData.clave.trim()) {
      setTipo("danger");
      setMensaje("❌ Todos los campos son obligatorios");
      setCargando(false);
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.correo)) {
      setTipo("danger");
      setMensaje("❌ Por favor ingresa un correo válido");
      setCargando(false);
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.clave !== formData.confirmarClave) {
      setTipo("danger");
      setMensaje("❌ Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    // Validar longitud de contraseña
    if (formData.clave.length < 6) {
      setTipo("danger");
      setMensaje("❌ La contraseña debe tener al menos 6 caracteres");
      setCargando(false);
      return;
    }

    try {
      // Llamar a la API de registro
      const respuesta = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          documento: formData.documento.trim(),
          usuario: formData.usuario.trim(),
          correo: formData.correo.trim().toLowerCase(),
          clave: formData.clave,
          id_rol: 3 // Usuario normal
        }),
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        setTipo("success");
        setMensaje("✅ ¡Cuenta creada exitosamente! Redirigiendo...");

        // Limpiar formulario
        setFormData({
          nombre: "",
          apellido: "",
          documento: "",
          usuario: "",
          correo: "",
          clave: "",
          confirmarClave: ""
        });

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Manejar errores específicos del servidor
        setTipo("danger");
        if (data.msg && data.msg.includes("correo")) {
          setMensaje("❌ Este correo ya está registrado");
        } else if (data.msg && data.msg.includes("usuario")) {
          setMensaje("❌ Este nombre de usuario ya está en uso");
        } else {
          setMensaje("❌ " + (data.msg || "Error en el registro"));
        }
      }

    } catch (error) {
      setTipo("danger");
      setMensaje("❌ Error de conexión. Verifica que el servidor esté activo.");
      console.error("Error en registro:", error);
    } finally {
      setCargando(false);
    }
  };

  const getColorFortaleza = () => {
    if (fortalezaClave <= 25) return "#ff4444";
    if (fortalezaClave <= 50) return "#ffaa00";
    if (fortalezaClave <= 75) return "#ffdd00";
    return "#00ff88";
  };

  const getTextoFortaleza = () => {
    if (fortalezaClave === 0) return "";
    if (fortalezaClave <= 25) return "Débil";
    if (fortalezaClave <= 50) return "Regular";
    if (fortalezaClave <= 75) return "Buena";
    return "Fuerte";
  };

  return (
    <div className="login-wrapper">
      <div className="box" style={{ maxWidth: "450px" }}>
        <span className="borderline"></span>

        <form onSubmit={handleSubmit} noValidate>
          <h2 style={{
            marginBottom: "10px",
            fontSize: "2em",
            background: "linear-gradient(45deg, #fff, #00ff88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Crear Cuenta
          </h2>
          <p style={{
            color: "#aaa",
            marginBottom: "25px",
            fontSize: "0.9em",
            textAlign: "center"
          }}>
            Únete a nuestra comunidad
          </p>

          {mensaje && (
            <div
              className={`alert alert-${tipo}`}
              style={{
                marginBottom: "20px",
                fontFamily: "Arial",
                padding: "12px 15px",
                background: tipo === "danger"
                  ? "rgba(255, 68, 68, 0.1)"
                  : "rgba(0, 255, 136, 0.1)",
                border: `1px solid ${tipo === "danger" ? "#ff4444" : "#00ff88"}`,
                color: tipo === "danger" ? "#ff4444" : "#00ff88",
                borderRadius: "8px",
                fontSize: "0.9em",
                animation: "slideIn 0.3s ease-out"
              }}
            >
              {mensaje}
            </div>
          )}

          <div className="inputbox">
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              disabled={cargando}
            />
            <span>👤 Nombre</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type="text"
              name="apellido"
              required
              value={formData.apellido}
              onChange={handleChange}
              disabled={cargando}
            />
            <span>👤 Apellido</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type="text"
              name="documento"
              required
              value={formData.documento}
              onChange={handleChange}
              disabled={cargando}
            />
            <span>🆔 Documento</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type="text"
              name="usuario"
              required
              value={formData.usuario}
              onChange={handleChange}
              disabled={cargando}
            />
            <span>🎯 Nombre de usuario</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              autoComplete="email"
              disabled={cargando}
            />
            <span>📧 Correo electrónico</span>
            <i></i>
          </div>

          <div className="inputbox" style={{ position: "relative" }}>
            <input
              type={mostrarClave ? "text" : "password"}
              name="clave"
              required
              value={formData.clave}
              onChange={handleChange}
              minLength={6}
              autoComplete="new-password"
              disabled={cargando}
            />
            <span>🔒 Contraseña</span>
            <i></i>
            <button
              type="button"
              onClick={() => setMostrarClave(!mostrarClave)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.2em",
                padding: "5px",
                zIndex: 10
              }}
            >
              {mostrarClave ? "🙈" : "👁️"}
            </button>
          </div>

          {formData.clave && (
            <div style={{ marginBottom: "20px", marginTop: "-10px" }}>
              <div style={{
                height: "4px",
                background: "#333",
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${fortalezaClave}%`,
                  background: getColorFortaleza(),
                  transition: "all 0.3s ease"
                }}></div>
              </div>
              <p style={{
                fontSize: "0.8em",
                color: getColorFortaleza(),
                marginTop: "5px",
                textAlign: "right"
              }}>
                {getTextoFortaleza()}
              </p>
            </div>
          )}

          <div className="inputbox" style={{ position: "relative" }}>
            <input
              type={mostrarConfirmarClave ? "text" : "password"}
              name="confirmarClave"
              required
              value={formData.confirmarClave}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={cargando}
            />
            <span>🔒 Confirmar contraseña</span>
            <i></i>
            <button
              type="button"
              onClick={() => setMostrarConfirmarClave(!mostrarConfirmarClave)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.2em",
                padding: "5px",
                zIndex: 10
              }}
            >
              {mostrarConfirmarClave ? "🙈" : "👁️"}
            </button>
          </div>

          {formData.confirmarClave && (
            <div style={{ marginBottom: "15px", marginTop: "-10px" }}>
              {formData.clave === formData.confirmarClave ? (
                <p style={{ fontSize: "0.8em", color: "#00ff88" }}>
                  ✓ Las contraseñas coinciden
                </p>
              ) : (
                <p style={{ fontSize: "0.8em", color: "#ff4444" }}>
                  ✗ Las contraseñas no coinciden
                </p>
              )}
            </div>
          )}

          <div className="links" style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <a href="/login" style={{
              transition: "all 0.3s ease"
            }}>
              ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
            </a>
            <a href="/" style={{
              transition: "all 0.3s ease"
            }}>
              ← Volver al inicio
            </a>
          </div>

          <input
            type="submit"
            value={cargando ? "Creando cuenta..." : "Registrarse"}
            disabled={cargando}
            style={{
              cursor: cargando ? "not-allowed" : "pointer",
              opacity: cargando ? 0.7 : 1,
              transition: "all 0.3s ease",
              marginTop: "10px"
            }}
          />
        </form>
      </div>

      <style>{`
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .inputbox input:focus + span {
    color: #00ff88;
  }

  .links a:hover {
    color: #00ff88;
    text-decoration: underline;
  }

  input[type="submit"]:hover:not(:disabled) {
    background: #00ff88;
    color: #000;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
  }
`}</style>
    </div>
  );
}

export default Registrar;