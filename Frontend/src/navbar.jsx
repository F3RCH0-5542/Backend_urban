import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carritoUrbanCops")) || [];
    const cantidadTotal = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);
    setContador(cantidadTotal);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/img/logo12.png" alt="UrbanCops" width="40" />
        </Link>

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

            {/* ✅ NBA - Fix: <a href="#"> reemplazado por <button> */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle fw-bold btn btn-link"
                data-bs-toggle="dropdown"
              >
                NBA
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/chicago">Chicago Bulls</Link></li>
                <li><Link className="dropdown-item" to="/boston">Boston Celtics</Link></li>
                <li><Link className="dropdown-item" to="/lakers">Los Angeles Lakers</Link></li>
              </ul>
            </li>

            {/* ✅ NFL - Fix: <a href="#"> reemplazado por <button> */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle fw-bold btn btn-link"
                data-bs-toggle="dropdown"
              >
                NFL
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/atlanta">Atlanta Falcons</Link></li>
                <li><Link className="dropdown-item" to="/arizona">Arizona Cardinals</Link></li>
                <li><Link className="dropdown-item" to="/vegas">Las Vegas Raiders</Link></li>
              </ul>
            </li>

            {/* ✅ MLB - Fix: <a href="#"> reemplazado por <button> */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle fw-bold btn btn-link"
                data-bs-toggle="dropdown"
              >
                MLB
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/red">Boston Red Sox</Link></li>
                <li><Link className="dropdown-item" to="/white">Chicago White Sox</Link></li>
                <li><Link className="dropdown-item" to="/falcon">Atlanta Braves</Link></li>
              </ul>
            </li>

            <li className="nav-item"><Link className="nav-link fw-bold" to="/personalizacion">Personalizadas</Link></li>
            <li className="nav-item"><Link className="nav-link fw-bold" to="/pqrs">PQRS</Link></li>
          </ul>

          {/* Buscador */}
          <form className="d-flex me-3" onSubmit={(e) => e.preventDefault()}>
            <input
              id="barra-busqueda"
              className="form-control"
              type="search"
              placeholder="Buscar gorras..."
              aria-label="Buscar"
            />
          </form>

          {/* Login */}
          <Link to="/login" className="btn text-white">
            <i className="bi bi-person"></i>
          </Link>

          {/* Carrito */}
          <Link to="/carrito" className="btn text-white position-relative">
            <i className="bi bi-cart"></i>
            <span
              id="contador-carrito"
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            >
              {contador}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;