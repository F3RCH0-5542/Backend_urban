import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { href: "/usuarios", icon: "fa-solid fa-users", label: "Usuarios" },
  ];

  return (
    <div className="sidebar">
      <h4 className="sidebar-title">Menú</h4>

      <ul className="sidebar-menu">
        {links.map(({ href, icon, label }) => (
          <li key={href}>
            <a
              href={href}
              className={location.pathname === href ? "active" : ""}
            >
              <i className={`${icon} me-2`}></i>
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button className="sidebar-admin-btn" onClick={() => navigate("/admin")}>
          <i className="fa-solid fa-gauge me-2"></i>
          Panel Admin
        </button>
      </div>
    </div>
  );
}