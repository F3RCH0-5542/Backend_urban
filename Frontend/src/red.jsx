import { useEffect } from "react";

export default function Red() {
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

  const buscarGorra = (e) => {
    e.preventDefault();
    const busqueda = document.getElementById("barra-busqueda").value.toLowerCase().trim();
    const rutas = {
      bulls: "/chicago", celtics: "/boston", lakers: "/lakers",
      sox: "/white", vegas: "/vegas", braves: "/braves", redsox: "/red",
    };
    if (rutas[busqueda]) {
      window.location.href = rutas[busqueda];
    } else {
      alert("No se encontró la gorra. Intenta con: lakers, bulls, redsox...");
    }
  };

  useEffect(() => {
    actualizarContadorCarrito();
  }, []);

  const productos = [
    { nombre: "Boston Red Sox - Orgullo de Fenway",         descripcion: "Gorra New Era 59FIFTY de la colección NBA Classic.",  precio: 95000, imagen: "/img/Red/1-removebg-preview.png" },
    { nombre: "Boston Red Sox - Leyenda Americana",         descripcion: "Gorra con logotipo bordado y diseño premium.",         precio: 92000, imagen: "/img/Red/2-removebg-preview.png" },
    { nombre: "Boston Red Sox - Espíritu de Campeones",     descripcion: "Modelo clásico con detalles bordados oficiales.",      precio: 98000, imagen: "/img/Red/3-removebg-preview.png" },
    { nombre: "Boston Red Sox - Tradición Inquebrantable",  descripcion: "Gorra New Era multi color.",                          precio: 95000, imagen: "/img/Red/4-removebg-preview.png" },
    { nombre: "Boston Red Sox - Estilo Beisbolero",         descripcion: "Gorra con logotipo bordado y diseño premium.",         precio: 92000, imagen: "/img/Red/5-removebg-preview.png" },
    { nombre: "Boston Red Sox - Pasión Roja",               descripcion: "Modelo clásico con detalles bordados oficiales.",      precio: 98000, imagen: "/img/Red/6-removebg-preview.png" },
    { nombre: "Boston Red Sox - Poder y Gloria",            descripcion: "Gorra New Era de la colección NBA Classic.",           precio: 95000, imagen: "/img/Red/7-removebg-preview (1).png" },
    { nombre: "Boston Red Sox - Clásico de Boston",         descripcion: "Gorra con logotipo bordado y diseño premium.",         precio: 92000, imagen: "/img/Red/8-removebg-preview.png" },
    { nombre: "Boston Red Sox - Herencia Deportiva",        descripcion: "Modelo clásico con detalles bordados oficiales.",      precio: 98000, imagen: "/img/Red/9-removebg-preview.png" },
  ];

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
                  <li><a className="dropdown-item" href="/atlanta">Atlanta Falcons</a></li>
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
                <a className="nav-link fw-bold" href="/personalizacion">Personalizadas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/pqrs">PQRS</a>
              </li>
            </ul>

            <form className="d-flex me-3" onSubmit={buscarGorra}>
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

      {/* CARRUSEL */}
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/Red/Wall2.jpg" className="d-block w-100" alt="Slide 1" />
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

      {/* PRODUCTOS */}
      <section className="container my-5 text-center">
        <h2>Boston Red Sox</h2>
        <p>
          Boston Red Sox no solo representan un equipo, representan historia,
          pasión y estilo. Son símbolo de Boston, del béisbol real y del orgullo
          que nunca pasa de moda. Del estadio a la calle, la gorra se volvió leyenda.
        </p>

        <div className="row justify-content-center mt-4">
          {productos.map((p, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="p-3 rounded text-dark-bg">
                <h3>{p.nombre}</h3>
                <img
                  src={p.imagen}
                  className="img-fluid my-2"
                  style={{ height: "100px", objectFit: "cover" }}
                  alt={p.nombre}
                />
                <p>{p.descripcion}</p>
                <p className="fw-bold">${p.precio.toLocaleString()} COP</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => agregarAlCarrito(p.nombre, p.precio, p.imagen)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
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