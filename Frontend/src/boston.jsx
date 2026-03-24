import React, { useEffect } from "react";

function BostonCeltics() {
  const agregarAlCarrito = (nombre, precio, imagen) => {
    const carrito = JSON.parse(localStorage.getItem("carritoUrbanCops")) || [];
    carrito.push({ nombre, precio, imagen });
    localStorage.setItem("carritoUrbanCops", JSON.stringify(carrito));
    actualizarContadorCarrito();
  };

  const actualizarContadorCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carritoUrbanCops")) || [];
    const contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = carrito.length;
  };

  useEffect(() => {
    actualizarContadorCarrito();
  }, []);

  return (
    <>
      {/* Navbar */}
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
                  <li><a className="dropdown-item" href="/falcons">Atlanta Falcons</a></li>
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
                  <li><a className="dropdown-item" href="/braves">Atlanta Braves</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link fw-bold" href="/personalizadas">Personalizadas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/pqrs">PQRS</a>
              </li>
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

      {/* Carrusel */}
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="../img/boston/logoboston2.jpg" className="d-block w-100" alt="Boston Celtics" />
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

      {/* Productos */}
      <section className="container my-5 text-center">
        <h2>Boston Celtics</h2>
        <p>
          Descubre nuestra colección exclusiva de gorras oficiales NBA. Explora
          modelos únicos y originales de tus equipos favoritos, con diseños
          bordados, ediciones especiales y la calidad premium de New Era.
        </p>

        <div className="row justify-content-center mt-4">
          {[
            { nombre: "Boston Celtics - Edición Especial Floral",        precio: 95000, imagen: "../img/boston/celtics+-removebg-preview.png",       desc: "Gorra New Era 59FIFTY" },
            { nombre: "Boston Celtics",                                   precio: 92000, imagen: "../img/boston/Adobe Express - file.png",              desc: "Gorra con logotipo bordado y diseño premium." },
            { nombre: "Boston Celtics (blanca con visera verde)",         precio: 98000, imagen: "../img/boston/celtics3-removebg-preview.png",         desc: "Modelo clásico con detalles bordados oficiales." },
            { nombre: "Boston Celtics - Edición Especial Floral (negra)", precio: 95000, imagen: "../img/boston/descarga1.png",                         desc: "Versión negra con logo verde y detalles florales." },
            { nombre: "Boston Celtics (negra con logo bordado)",          precio: 92000, imagen: "../img/boston/descarga.png",                          desc: "Estilo sobrio con logo bordado." },
            { nombre: "Boston Celtics (blanco con visera verde)",         precio: 98000, imagen: "../img/boston/celtics22.png",                         desc: "Modelo clásico en blanco y verde con logo oficial." },
            { nombre: "Boston Celtics - Edición Floral (blanco y verde)", precio: 95000, imagen: "../img/boston/celticsporksi-removebg-preview.png",    desc: "Estilo fresco con logo y flores bordadas." },
            { nombre: "Boston Celtics (verde con visera negra)",          precio: 92000, imagen: "../img/boston/celtics234.png",                        desc: "Diseño moderno en verde con visera negra." },
            { nombre: "Boston Celtics (negra)",                           precio: 98000, imagen: "../img/boston/Boston12.png",                          desc: "Modelo negro elegante con logo bordado." },
          ].map((producto, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="p-3 rounded text-dark-bg">
                <h3>{producto.nombre}</h3>
                <img
                  src={producto.imagen}
                  className="img-fluid my-2"
                  style={{ height: "100px", objectFit: "cover" }}
                  alt={producto.nombre}
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

          <div className="text-center small">
            &copy; 2025 UrbanCops. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

export default BostonCeltics;