import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h4 className="sidebar-title">Menú</h4>
      <ul className="sidebar-menu">
        <li><a href="/usuarios"><i className="fa-solid fa-users me-2"></i>Usuarios</a></li>
        <li><a href="/registrar"><i className="fa-solid fa-user-plus me-2"></i>Registrar</a></li>
        <li><a href="/carrito"><i className="fa-solid fa-cart-shopping me-2"></i>Carrito</a></li>
      </ul>
    </div>
  );
}
