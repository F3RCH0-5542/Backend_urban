// src/pqrs.jsx
import React, { useState } from "react";
import { createPqrs } from "./services/PqrsService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PQRS() {
  const [estado, setEstado] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [error, setError] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");

    const nombre = e.target.nombre_uc.value;
    const correo = e.target.correo_uc.value;
    const tipo = e.target.tipo_uc.value;
    const mensaje = e.target.mensaje_uc.value;

    setEstado(true);

    try {
      const dataToSend = {
        nombre: nombre.trim(),
        correo: correo.trim(),
        tipo_pqrs: tipo,
        descripcion: mensaje.trim(),
        estado: 'Pendiente',
        respuesta: ''
      };

      await createPqrs(dataToSend);

      const seguimiento = Math.floor(100000 + Math.random() * 900000);

      const mensajeTipo = {
        Peticion: "Gracias por tu petición. Será evaluada por nuestro equipo.",
        Queja: "Lamentamos el inconveniente. Lo atenderemos con prioridad.",
        Reclamo: "Gracias por informarnos. Revisaremos lo ocurrido.",
        Sugerencia: "¡Nos encanta recibir sugerencias! Las tendremos en cuenta.",
      };

      setRespuesta(
        `<i class="bi bi-check-circle-fill"></i> ${mensajeTipo[tipo] || 'Solicitud recibida correctamente.'}<br>
         Tu solicitud ha sido registrada exitosamente.<br>
         Número de seguimiento: <strong>#${seguimiento}</strong>`
      );

      setMostrarRespuesta(true);
      e.target.reset();
      setTimeout(() => setMostrarRespuesta(false), 8000);

    } catch (err) {
      console.error('Error al enviar PQRS:', err);
      setError(err.msg || 'Error al enviar la solicitud. Por favor, intenta nuevamente.');
    } finally {
      setEstado(false);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="../img/logo12.png" alt="UrbanCops" width="40" />
          </a>
          <button
            className="navbar-toggler text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarGorras"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarGorras">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* NBA — ✅ FIX: <button> en lugar de <a href="#"> */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle fw-bold btn btn-link p-0 text-white text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  NBA
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/chicago">Chicago Bulls</a></li>
                  <li><a className="dropdown-item" href="/boston">Boston Celtics</a></li>
                  <li><a className="dropdown-item" href="/lakers">Los Angeles Lakers</a></li>
                </ul>
              </li>

              {/* NFL — ✅ FIX: <button> en lugar de <a href="#"> */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle fw-bold btn btn-link p-0 text-white text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  NFL
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/falcon">Atlanta Falcons</a></li>
                  <li><a className="dropdown-item" href="/arizona">Arizona Cardinals</a></li>
                  <li><a className="dropdown-item" href="/vegas">Las Vegas Raiders</a></li>
                </ul>
              </li>

              {/* MLB — ✅ FIX: <button> en lugar de <a href="#"> */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle fw-bold btn btn-link p-0 text-white text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  MLB
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="/red">Boston Red Sox</a></li>
                  <li><a className="dropdown-item" href="/white">Chicago White Sox</a></li>
                  <li><a className="dropdown-item" href="/atlanta">Atlanta Braves</a></li>
                </ul>
              </li>

              <li className="nav-item"><a className="nav-link fw-bold text-white" href="/personalizacion">Personalizadas</a></li>
              <li className="nav-item"><a className="nav-link fw-bold text-white" href="/pqrs">PQRS</a></li>
            </ul>

            <form className="d-flex me-3">
              <input
                id="barra-busqueda"
                className="form-control"
                type="search"
                placeholder="Buscar gorras..."
                aria-label="Buscar"
              />
            </form>
            <a href="/login" className="btn text-white">
              <i className="bi bi-person"></i>
            </a>
            <button
              className="btn text-white position-relative"
              onClick={() => (window.location.href = "/carrito")}
            >
              <i className="bi bi-cart"></i>
              <span
                id="contador-carrito"
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ENCABEZADO */}
      <div className="container text-center my-5">
        <h1 className="text-white fw-bold">Tu Voz en UrbanCops</h1>
        <p className="lead text-white">
          ¿Tuviste algún inconveniente, sugerencia o reclamo? Envíanos tu mensaje, te escuchamos.
        </p>
      </div>

      {/* FORMULARIO */}
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-dark text-white py-3">
                <h5 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>Formulario de contacto
                </h5>
              </div>
              <div className="card-body p-4">
                <form id="formPQRS" onSubmit={manejarEnvio} autoComplete="off">
                  <div className="mb-3">
                    <label htmlFor="inputNombre" className="form-label fw-bold">
                      <i className="bi bi-person-fill me-2 text-primary"></i>Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="inputNombre"
                      name="nombre_uc"
                      placeholder="Escribe tu nombre"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputCorreo" className="form-label fw-bold">
                      <i className="bi bi-envelope-fill me-2 text-primary"></i>Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="inputCorreo"
                      name="correo_uc"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label fw-bold">
                      <i className="bi bi-ui-checks me-2 text-primary"></i>Tipo de solicitud
                    </label>
                    <select className="form-select form-select-lg" id="tipo" name="tipo_uc" required>
                      <option value="">Selecciona una opción</option>
                      <option value="Peticion">Petición</option>
                      <option value="Queja">Queja</option>
                      <option value="Reclamo">Reclamo</option>
                      <option value="Sugerencia">Sugerencia</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label fw-bold">
                      <i className="bi bi-chat-dots-fill me-2 text-primary"></i>Mensaje
                    </label>
                    <textarea
                      className="form-control form-control-lg"
                      id="mensaje"
                      name="mensaje_uc"
                      rows="5"
                      placeholder="Describe tu solicitud..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-dark btn-lg w-100" disabled={estado}>
                    {estado ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>Enviar
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {estado && !error && (
                  <div className="alert alert-info mt-3" role="alert">
                    <i className="bi bi-clock-history me-2"></i>Procesando tu solicitud...
                  </div>
                )}

                {mostrarRespuesta && (
                  <div
                    className="alert alert-success mt-3"
                    role="alert"
                    dangerouslySetInnerHTML={{ __html: respuesta }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-4">
        <div className="container">
          <p className="mb-0">&copy; 2025 UrbanCops. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}