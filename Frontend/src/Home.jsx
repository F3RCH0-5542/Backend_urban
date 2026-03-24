import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const styles = {
  container: {
    minHeight: '100vh',
    background: '#000000',
    fontFamily: 'Arial, sans-serif',
    color: '#ffffff'
  },
  nav: {
    background: '#000000',
    borderBottom: '1px solid #222222',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
  },
  navContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '1px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  logoutBtn: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  welcomeCard: {
    background: '#111111',
    borderRadius: '12px',
    border: '1px solid #222222',
    padding: '40px',
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderLeft: '4px solid #10b981',
    paddingLeft: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  moduleCard: {
    background: '#111111',
    border: '1px solid #222222',
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block'
  },
  moduleIcon: {
    fontSize: '40px',
    marginBottom: '16px'
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  moduleDesc: {
    color: '#999999',
    fontSize: '13px',
    lineHeight: '1.5'
  },
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Error:", err);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    globalThis.location.href = "/login";
  };

  const getRoleText = (roleId) => {
    const roles = { 1: "Super Admin", 2: "Admin", 3: "Usuario" };
    return roles[roleId] || "Usuario";
  };

  const getRoleIcon = (roleText) => {
    if (roleText.includes("Super")) return "👑";
    if (roleText.includes("Admin")) return "🛡️";
    return "👤";
  };

  const superAdminModules = [
    { icon: "👥", title: "Usuarios",         desc: "Gestión completa de usuarios del sistema", path: "/usuarios",                color: "#10b981" },
    { icon: "🎭", title: "Roles",             desc: "Administrar roles y permisos",             path: "/roles",                   color: "#3b82f6" },
    { icon: "📦", title: "Inventario",        desc: "Control de productos y stock",             path: "/inventario",              color: "#8b5cf6" },
    { icon: "🛒", title: "Ventas",            desc: "Gestión de ventas y pedidos",              path: "/ventas",                  color: "#f59e0b" },
    { icon: "📋", title: "Pedidos",           desc: "Administrar pedidos de clientes",          path: "/pedido",                  color: "#ef4444" },
    { icon: "🎨", title: "Personalizaciones", desc: "Gestión de personalizaciones",             path: "/admin/personalizaciones", color: "#ec4899" },
    { icon: "🚚", title: "Envíos",            desc: "Control de envíos y entregas",             path: "/envios",                  color: "#06b6d4" },
    { icon: "💳", title: "Pagos",             desc: "Administración de pagos",                  path: "/pago",                    color: "#14b8a6" },
    { icon: "📝", title: "PQRS",              desc: "Peticiones, quejas y reclamos",            path: "/pqrs",                    color: "#f97316" },
    { icon: "📊", title: "Registro",          desc: "Historial y logs del sistema",             path: "/registros",               color: "#6366f1" },
  ];

  const adminModules = [
    { icon: "👥", title: "Usuarios",   desc: "Ver usuarios del sistema",    path: "/usuarios",                color: "#10b981" },
    { icon: "📦", title: "Inventario", desc: "Control de productos y stock", path: "/inventario",              color: "#8b5cf6" },
    { icon: "🛒", title: "Ventas",     desc: "Gestión de ventas",            path: "/ventas",                  color: "#f59e0b" },
    { icon: "📋", title: "Pedidos",    desc: "Administrar pedidos",          path: "/pedido",                  color: "#ef4444" },
    { icon: "🎨", title: "Personalizaciones", desc: "Gestión de personalizaciones", path: "/admin/personalizaciones", color: "#ec4899" },
    { icon: "📝", title: "PQRS",       desc: "Atender PQRS",                path: "/pqrs",                    color: "#f97316" },
  ];

  const userModules = [
    { icon: "🛒", title: "Mis Compras",  desc: "Ver historial de compras",     path: "/mis-compras",    color: "#10b981" },
    { icon: "📋", title: "Mis Pedidos",  desc: "Seguimiento de pedidos",       path: "/mis-pedidos",    color: "#3b82f6" },
    { icon: "🎨", title: "Personalizar", desc: "Crear diseños personalizados", path: "/personalizacion",color: "#ec4899" },
    { icon: "📝", title: "Soporte",      desc: "Crear ticket de soporte",      path: "/soporte",        color: "#f59e0b" },
  ];

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            border: '4px solid #222222',
            borderTop: '4px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#999999', marginTop: '20px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          background: '#111111', border: '1px solid #222222',
          borderRadius: '12px', padding: '48px', maxWidth: '450px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🔒</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', marginBottom: '12px' }}>
            No has iniciado sesión
          </h2>
          <p style={{ color: '#999999', marginBottom: '32px' }}>
            Por favor inicia sesión para acceder
          </p>
          <a href="/login" style={{
            display: 'inline-block', width: '100%',
            background: '#ffffff', color: '#000000',
            padding: '16px 32px', borderRadius: '6px',
            textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase'
          }}>
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  const role = getRoleText(user.rol);
  const roleIcon = getRoleIcon(role);

  let modules = userModules;
  if (user.rol === 1) modules = superAdminModules;
  else if (user.rol === 2) modules = adminModules;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .module-hover:hover {
          transform: translateY(-4px);
          border-color: #444444 !important;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        .logout-hover:hover {
          background: #b91c1c !important;
          transform: scale(1.05);
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <span style={styles.logo}>URBAN COPS</span>
          <div style={styles.userInfo}>
            <span style={{ color: '#999999', fontSize: '14px' }}>
              {roleIcon} {role} | Usuario #{user.id}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn} className="logout-hover">
              CERRAR SESIÓN
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '8px' }}>
            BIENVENIDO, {role.toUpperCase()}
          </h1>
          <p style={{ color: '#999999', fontSize: '16px' }}>
            Panel de administración y control del sistema
          </p>
        </div>

        <h2 style={styles.sectionTitle}>Módulos del Sistema</h2>

        <div style={styles.grid}>
          {modules.map((module, index) => (
            <a key={index} href={module.path} style={styles.moduleCard} className="module-hover">
              <div style={styles.moduleIcon}>{module.icon}</div>
              <h3 style={styles.moduleTitle}>{module.title}</h3>
              <p style={styles.moduleDesc}>{module.desc}</p>
              <div style={{ marginTop: '16px', width: '40px', height: '3px', background: module.color, borderRadius: '2px' }}></div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}