import { useEffect } from "react";

export default function Lakers() {
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
    <div>
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
                  <li><a className="dropdown-item" href="/whitesox">Chicago White Sox</a></li>
                  <li><a className="dropdown-item" href="/braves">Atlanta Braves</a></li>
                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link fw-bold" href="/personalizacion">Personalizadas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/pqrs">PQRS</a>
              </li>
            </ul>

            <form className="d-flex me-3" onSubmit={(e) => e.preventDefault()}>
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

      {/* Carousel */}
      <div id="carouselExampleControls" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="../img/lakers13.webp" className="d-block w-100" alt="Lakers" />
          </div>
        </div>
      </div>

      {/* Productos */}
      <section className="container my-5 text-center">
        <h2>Los Angeles Lakers</h2>
        <p>
          Los Angeles Lakers son uno de los equipos más icónicos de toda la NBA.
          Tienen millones de fans en el mundo por su historia llena de títulos,
          leyendas como Kobe Bryant, Magic Johnson y ahora LeBron James. Por eso
          hay tantas gorras de los Lakers: no solo son parte del deporte, también
          son moda, cultura y actitud. Llevar una gorra de los Lakers es llevar
          la vibra de Los Ángeles.
        </p>

        <div className="row justify-content-center mt-4">
          {[
            { nombre: "Lakers Classic",   precio: 95000, imagen: "../img/Lakers/2-removebg-preview.png", desc: "Gorra New Era 59FIFTY de la colección NBA Classic de Los Angeles Lakers." },
            { nombre: "Lakers Black",     precio: 92000, imagen: "../img/Lakers/1-removebg-preview.png", desc: "Gorra de los Lakers en color negro con logotipo bordado premium." },
            { nombre: "Lakers Logo",      precio: 98000, imagen: "../img/Lakers/3-removebg-preview.png", desc: "Modelo oficial de los Lakers con detalles clásicos y bordado icónico." },
            { nombre: "Lakers Edition 1", precio: 95000, imagen: "../img/Lakers/4-removebg-preview.png", desc: "Gorra oficial de Los Angeles Lakers con diseño clásico New Era." },
            { nombre: "Lakers Edition 2", precio: 92000, imagen: "../img/Lakers/5-removebg-preview.png", desc: "Gorra New Era de los Lakers con bordado premium." },
            { nombre: "Lakers Edition 3", precio: 98000, imagen: "../img/Lakers/6-removebg-preview.png", desc: "Modelo clásico de Los Angeles Lakers con detalles bordados oficiales." },
            { nombre: "Lakers Edition 4", precio: 95000, imagen: "../img/Lakers/7-removebg-preview.png", desc: "Gorra New Era oficial de la colección NBA Classic de Los Angeles Lakers." },
            { nombre: "Lakers Edition 5", precio: 92000, imagen: "../img/Lakers/8-removebg-preview.png", desc: "Gorra premium de Los Angeles Lakers con acabado de alta calidad." },
            { nombre: "Lakers Edition 6", precio: 98000, imagen: "../img/Lakers/9-removebg-preview.png", desc: "Modelo exclusivo de los Lakers con detalles bordados icónicos." },
          ].map((item, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="p-3 rounded text-dark-bg">
                <h3>{item.nombre}</h3>
                <img
                  src={item.imagen}
                  className="img-fluid my-2"
                  style={{ height: "100px", objectFit: "cover" }}
                  alt={item.nombre}
                />
                <p>{item.desc}</p>
                <p className="fw-bold">${item.precio.toLocaleString()} COP</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => agregarAlCarrito(item.nombre, item.precio, item.imagen)}
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
    </div>
  );
}