import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// ✅ FIX: TeamCard definida FUERA de Categorias para evitar errores de PropTypes y re-renders
function TeamCard({ equipo, btnClass }) {
  return (
    <article
      className="card h-100 shadow-sm border-0"
      style={{ transition: 'transform 0.3s', cursor: 'pointer' }}
      aria-label={equipo.nombre}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div className="card-body text-center p-4">
        <img
          src={equipo.imagen}
          alt={equipo.nombre}
          className="img-fluid mb-3"
          style={{ height: '120px', objectFit: 'contain' }}
        />
        <h4 className="fw-bold mb-2">{equipo.nombre}</h4>
        <p className="text-muted small mb-3">{equipo.desc}</p>
        <a href={equipo.ruta} className={`btn ${btnClass} w-100`}>
          Ver Colección <i className="bi bi-arrow-right"></i>
        </a>
      </div>
    </article>
  );
}

TeamCard.propTypes = {
  equipo: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    imagen: PropTypes.string.isRequired,
    ruta:   PropTypes.string.isRequired,
    desc:   PropTypes.string.isRequired,
  }).isRequired,
  btnClass: PropTypes.string.isRequired,
};

function Categorias() {
  const [contadorCarrito, setContadorCarrito] = useState(0);

  useEffect(() => {
    actualizarContadorCarrito();
  }, []);

  const actualizarContadorCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem('carritoUrbanCops')) || [];
    setContadorCarrito(carrito.length);
  };

  const todosLosEquipos = {
    nba: [
      { nombre: 'Chicago Bulls',      imagen: '/img/chicago.png',   ruta: '/chicago', desc: 'El legendario equipo de Michael Jordan' },
      { nombre: 'Boston Celtics',     imagen: '/img/chicago.png',   ruta: '/boston',  desc: 'La franquicia más ganadora de la NBA' },
      { nombre: 'Los Angeles Lakers', imagen: '/img/Lakers12.png',  ruta: '/lakers',  desc: 'El show time de la costa oeste' }
    ],
    nfl: [
      { nombre: 'Atlanta Falcons',   imagen: '/img/Atlanta12.png', ruta: '/falcon',  desc: 'Los halcones del sur profundo' },
      { nombre: 'Arizona Cardinals', imagen: '/img/Arizona12.png', ruta: '/arizona', desc: 'El equipo más antiguo de la NFL' },
      { nombre: 'Las Vegas Raiders', imagen: '/img/Raiders12.png', ruta: '/vegas',   desc: 'La nación Raider en el desierto' }
    ],
    mlb: [
      { nombre: 'Boston Red Sox',    imagen: '/img/chicago.png',   ruta: '/red',     desc: 'Los medias rojas de Fenway Park' },
      { nombre: 'Chicago White Sox', imagen: '/img/chicago.png',   ruta: '/white',   desc: 'El orgullo del South Side' },
      { nombre: 'Atlanta Braves',    imagen: '/img/Atlanta12.png', ruta: '/atlanta', desc: 'Los bravos campeones del sureste' }
    ]
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="/img/logo12.png" alt="UrbanCops" width="40" />
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

              <li className="nav-item">
                <a className="nav-link fw-bold" href="/personalizacion">Personalizadas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/pqrs">PQRS</a>
              </li>
            </ul>

            <div className="d-flex me-3">
              <input className="form-control" type="search" placeholder="Buscar gorras..." aria-label="Buscar gorras" />
            </div>

            <a href="/login" className="btn text-white me-2"><i className="bi bi-person"></i></a>
            <button
              className="btn text-white position-relative"
              onClick={() => (window.location.href = '/carrito')}
            >
              <i className="bi bi-cart"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {contadorCarrito}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="bg-dark text-white text-center py-5" style={{ borderBottom: '3px solid #dc2626' }}>
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">CATEGORÍAS</h1>
          <p className="lead fs-4">Encuentra tu estilo | Elige tu equipo | Representa tu pasión</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="#nba" className="btn btn-outline-light btn-lg">NBA</a>
            <a href="#nfl" className="btn btn-outline-light btn-lg">NFL</a>
            <a href="#mlb" className="btn btn-outline-light btn-lg">MLB</a>
          </div>
        </div>
      </div>

      {/* SECCIÓN NBA */}
      <section id="nba" className="container my-5">
        <div className="row align-items-center mb-4">
          <div className="col">
            <h2 className="fw-bold text-white" style={{ borderLeft: '5px solid #dc2626', paddingLeft: '15px' }}>
              🏀 NBA
            </h2>
            <p className="text-white-50">National Basketball Association</p>
          </div>
        </div>
        <div className="row justify-content-center">
          {todosLosEquipos.nba.map((equipo, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <TeamCard equipo={equipo} btnClass="btn-danger" />
            </div>
          ))}
        </div>
      </section>

      <div className="bg-light py-2"></div>

      {/* SECCIÓN NFL */}
      <section id="nfl" className="container my-5">
        <div className="row align-items-center mb-4">
          <div className="col">
            <h2 className="fw-bold text-white" style={{ borderLeft: '5px solid #2563eb', paddingLeft: '15px' }}>
              🏈 NFL
            </h2>
            <p className="text-white-50">National Football League</p>
          </div>
        </div>
        <div className="row justify-content-center">
          {todosLosEquipos.nfl.map((equipo, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <TeamCard equipo={equipo} btnClass="btn-primary" />
            </div>
          ))}
        </div>
      </section>

      <div className="bg-light py-2"></div>

      {/* SECCIÓN MLB */}
      <section id="mlb" className="container my-5">
        <div className="row align-items-center mb-4">
          <div className="col">
            <h2 className="fw-bold text-white" style={{ borderLeft: '5px solid #059669', paddingLeft: '15px' }}>
              ⚾ MLB
            </h2>
            <p className="text-white-50">Major League Baseball</p>
          </div>
        </div>
        <div className="row justify-content-center">
          {todosLosEquipos.mlb.map((equipo, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <TeamCard equipo={equipo} btnClass="btn-success" />
            </div>
          ))}
        </div>
      </section>

      {/* BANNER PERSONALIZACIÓN */}
      <section className="bg-warning py-5 my-5">
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-3">✨ ¿Quieres algo único?</h2>
          <p className="lead mb-4">Diseña tu propia gorra personalizada con tu logo, texto o diseño favorito</p>
          <a href="/personalizacion" className="btn btn-dark btn-lg px-5 py-3">
            Crear mi Gorra Personalizada <i className="bi bi-palette-fill ms-2"></i>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white pt-5 pb-3">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">UrbanCops</h5>
              <p>Gorras urbanas exclusivas con estilo auténtico. Representa tu equipo, tu barrio y tu esencia.</p>
              <div>
                <button
                  className="btn text-white me-3 p-0 border-0 bg-transparent"
                  aria-label="Facebook"
                  onClick={() => window.open('https://facebook.com', '_blank')}
                >
                  <i className="bi bi-facebook"></i>
                </button>
                <button
                  className="btn text-white me-3 p-0 border-0 bg-transparent"
                  aria-label="Instagram"
                  onClick={() => window.open('https://instagram.com', '_blank')}
                >
                  <i className="bi bi-instagram"></i>
                </button>
                <button
                  className="btn text-white p-0 border-0 bg-transparent"
                  aria-label="WhatsApp"
                  onClick={() => window.open('https://wa.me/573100000000', '_blank')}
                >
                  <i className="bi bi-whatsapp"></i>
                </button>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">Enlaces Rápidos</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Inicio</a></li>
                <li><a href="#nba" className="text-white text-decoration-none">NBA</a></li>
                <li><a href="#nfl" className="text-white text-decoration-none">NFL</a></li>
                <li><a href="#mlb" className="text-white text-decoration-none">MLB</a></li>
                <li><a href="/personalizacion" className="text-white text-decoration-none">Personalizadas</a></li>
              </ul>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">Contacto</h5>
              <p><i className="bi bi-envelope"></i> contacto@urbancops.com</p>
              <p><i className="bi bi-phone"></i> +57 310 000 0000</p>
              <p><i className="bi bi-geo-alt"></i> Bogotá, Colombia</p>
            </div>
          </div>

          <hr className="border-secondary" />

          <div className="text-center small">
            &copy; 2025 UrbanCops. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

export default Categorias;