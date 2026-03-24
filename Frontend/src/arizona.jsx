import { useEffect } from "react";

export default function Arizona() {
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

            <form className="d-flex me-3">
              <input
                id="barra-busqueda"
                className="form-control"
                type="search"
                placeholder="Buscar gorras..."
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

    
      <div id="carouselArizona" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/img/arizona/d54dc35d84f4c397be604f2a0d118c39.jpg"
              className="d-block w-100"
              alt="Arizona Cardinals"
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselArizona"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselArizona"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

    
      <section className="container my-5 text-center">
        <h2>Arizona Cardinals</h2>
        <p>
          El equipo de los Arizona Cardinals es uno de los más antiguos de la NFL,
          con una historia de lucha y pasión. Su emblema, el cardenal, representa la fortaleza
          y la velocidad en el campo. Las gorras de los Cardinals son un símbolo de identidad
          y resistencia.
        </p>

        <div className="row justify-content-center mt-4">
          {[
            { nombre: "Arizona Cardinals", precio: 95000, img: "/img/arizona/images-removebg-preview.png", desc: "Estilo clásico con logo bordado." },
            { nombre: "Arizona Cardinals", precio: 92000, img: "/img/arizona/negrayroja-removebg-preview.png", desc: "Diseño moderno con logo en relieve." },
            { nombre: "Arizona Cardinals", precio: 98000, img: "/img/arizona/blancaroja-removebg-preview.png", desc: "Premium con detalles bordados." },
            { nombre: "Arizona Cardinals", precio: 95000, img: "/img/arizona/negra..-removebg-preview.png", desc: "Colección exclusiva, ajuste cómodo." },
            { nombre: "Arizona Cardinals", precio: 92000, img: "/img/arizona/tricolor-removebg-preview.png", desc: "Diseño moderno estilo casual." },
            { nombre: "Arizona Cardinals", precio: 98000, img: "/img/arizona/blanca_..-removebg-preview.png", desc: "Logo principal en diseño destacado." },
            { nombre: "Arizona Cardinals", precio: 95000, img: "/img/arizona/totalroja-removebg-preview.png", desc: "Visera plana con cardenal bordado." },
            { nombre: "Arizona Cardinals", precio: 92000, img: "/img/arizona/gris-removebg-preview.png", desc: "Estilo deportivo para uso diario." },
            { nombre: "Arizona Cardinals", precio: 98000, img: "/img/arizona/negralinda-removebg-preview.png", desc: "Alta calidad para fanáticos reales." },
          ].map((p, i) => (
            <div className="col-md-4 mb-4" key={i}>
              <div className="p-3 rounded text-dark-bg">
                <h3>{p.nombre}</h3>
                <img
                  src={p.img}
                  alt={p.nombre}
                  className="img-fluid my-2"
                  style={{ height: "100px", objectFit: "cover" }}
                />
                <p>{p.desc}</p>
                <p className="fw-bold">${p.precio.toLocaleString()} COP</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => agregarAlCarrito(p.nombre, p.precio, p.img)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <footer className="bg-black text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">UrbanCops</h5>
              <p>
                Gorras urbanas exclusivas con estilo auténtico. Representa tu equipo, tu barrio y tu esencia.
              </p>
            
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