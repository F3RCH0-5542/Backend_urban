import React, { useEffect, useState } from "react";

const ChicagoBulls = () => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carritoUrbanCops")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const agregarAlCarrito = (nombre, precio, imagen) => {
    const nuevoCarrito = [...carrito, { nombre, precio, imagen }];
    setCarrito(nuevoCarrito);
    localStorage.setItem("carritoUrbanCops", JSON.stringify(nuevoCarrito));
  };

  return (
    <>
      {/* Navbar */}
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

              <li className="nav-item"><a className="nav-link fw-bold" href="/personalizacion">Personalizadas</a></li>
              <li className="nav-item"><a className="nav-link fw-bold" href="/pqrs">PQRS</a></li>
            </ul>

            <form className="d-flex me-3">
              <input id="barra-busqueda" className="form-control" type="search" placeholder="Buscar gorras..." aria-label="Buscar" />
            </form>
            <a href="/login" className="btn text-white"><i className="bi bi-person"></i></a>
            <button
              className="btn text-white position-relative"
              onClick={() => (window.location.href = "/carrito")}
            >
              <i className="bi bi-cart"></i>
              <span
                id="contador-carrito"
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {carrito.length}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/chi4.jpg" className="d-block w-100" alt="Chicago Bulls" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Sección Chicago Bulls */}
      <section className="container my-5 text-center">
        <h2>Chicago Bulls</h2>
        <p>
          Chicago Bulls se volvieron un ícono mundial gracias a su éxito y a Michael Jordan, considerado por muchos el mejor jugador de la historia.
          Su logo (el toro rojo) es llamativo y poderoso, así que las gorras y ropa con su marca se volvieron una moda urbana, incluso entre personas que no siguen el baloncesto.
          Es un símbolo de estilo y cultura pop.
        </p>

        <div className="row justify-content-center mt-4">
          {[
            { nombre: "Chicago Bulls",              precio: 95000, imagen: "/img/Bulls/1.png",                    desc: "Gorra New Era 59FIFTY de la colección NBA Classic." },
            { nombre: "Chicago Bulls Black",        precio: 92000, imagen: "/img/Bulls/2-removebg-preview.png",   desc: "Gorra con logotipo bordado y diseño premium." },
            { nombre: "Chicago Bulls logo",         precio: 98000, imagen: "/img/Bulls/3.png",                    desc: "Modelo clásico con detalles bordados oficiales." },
            { nombre: "Chicago Bulls Red",          precio: 95000, imagen: "/img/Bulls/4-removebg-preview.png",   desc: "Gorra New Era multi color." },
            { nombre: "Chicago Bulls Blue Ice",     precio: 92000, imagen: "/img/Bulls/5-removebg-preview.png",   desc: "Gorra con logotipo bordado y diseño premium." },
            { nombre: "Chicago Bulls Hormada",      precio: 98000, imagen: "/img/Bulls/6.png",                    desc: "Modelo clásico con detalles bordados oficiales." },
            { nombre: "Chicago Bulls Beige",        precio: 95000, imagen: "/img/Bulls/7-removebg-preview.png",   desc: "Gorra New Era de la colección NBA Classic." },
            { nombre: "Chicago Blue",               precio: 92000, imagen: "/img/Bulls/8-removebg-preview.png",   desc: "Gorra con logotipo bordado y diseño premium." },
            { nombre: "Chicago Bulls Beige Hormada",precio: 98000, imagen: "/img/Bulls/9-removebg-preview.png",   desc: "Modelo clásico con detalles bordados oficiales." },
          ].map((producto, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="p-3 rounded text-dark-bg">
                <h3>{producto.nombre}</h3>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="img-fluid my-2"
                  style={{ height: "100px", objectFit: "cover" }}
                />
                <p>{producto.desc}</p>
                <p className="fw-bold">${producto.precio.toLocaleString()} COP</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => agregarAlCarrito(producto.nombre, producto.precio, producto.imagen)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">UrbanCops</h5>
              <p>Gorras urbanas exclusivas con estilo auténtico. Representa tu equipo, tu barrio y tu esencia.</p>
              {/* ✅ FIX: <button> en lugar de <a href="#"> */}
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
                <li><a href="/nba" className="text-white text-decoration-none">NBA</a></li>
                <li><a href="/mlb" className="text-white text-decoration-none">MLB</a></li>
                <li><a href="/personalizadas" className="text-white text-decoration-none">Personalizadas</a></li>
              </ul>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">Contacto</h5>
              <p><i className="bi bi-envelope"></i> contacto@urbancops.com</p>
              <p><i className="bi bi-phone"></i> +57 310 000 0000</p>
              <p><i className="bi bi-geo-alt"></i> Bogotá, Colombia</p>
            </div>
          </div>

          <hr className="border-gray" />

          <div className="text-center small">&copy; 2025 UrbanCops. Todos los derechos reservados.</div>
        </div>
      </footer>
    </>
  );
};

export default ChicagoBulls;