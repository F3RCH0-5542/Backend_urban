// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// Auth Context Provider
import { AuthProvider } from "./context/AuthContext";

// Estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./global.css";
import "./index.css";

// Páginas principales
import App from "./app.jsx";
import Login from "./login.jsx";
import Registrar from "./registrar.jsx";
import Carrito from "./carrito.jsx";
import MiCuenta from "./micuenta.jsx";
import AdminHome from "./home.jsx";

// Secciones deportivas (TIENDA PÚBLICA)
import Lakers from "./lakers.jsx";
import Chicago from "./chicago.jsx";
import Boston from "./boston.jsx";
import White from "./white.jsx";
import Vegas from "./vegas.jsx";
import Atlanta from "./atlanta.jsx";
import Red from "./red.jsx";
import Arizona from "./arizona.jsx";
import Falcon from "./falcon.jsx";

// Módulos del sistema (SOLO ADMIN)
import Usuarios from "./pages/usuarios.jsx";
import Inventario from "./components/inventario.jsx";
import Pago from "./components/pago.jsx";
import Envios from "./components/envios.jsx";
import Registros from "./components/registros.jsx";
import Ventas from "./components/ventas.jsx";
import RolesComponent from "./components/rol.jsx";
import PqrsAdmin from "./components/PqrsAdmin.jsx";
import PersonalizacionAdmin from "./components/personalizacion.jsx";       // ← CRUD admin
import PersonalizacionUsuario from "./personalizacionUsuario.jsx";            // ← Diseñador usuario
import Pedido from "./components/pedido.jsx";
import Categorias from "./components/Categorias.jsx";

// PQRS para usuarios públicos
import PQRS from "./pqrs.jsx";

// ─── Guards ───────────────────────────────────────────────────────────────────

const PqrsRedirect = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin'
    ? <Navigate to="/pqrs-admin" replace />
    : <Navigate to="/pqrs-publico" replace />;
};

const ProtectedAdminRoute = ({ children }) => {
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  if (!token)               return <Navigate to="/login" replace />;
  if (userRole !== 'admin') return <Navigate to="/" replace />;
  return children;
};
ProtectedAdminRoute.propTypes = { children: PropTypes.node.isRequired };

const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
ProtectedUserRoute.propTypes = { children: PropTypes.node.isRequired };

// ─── Render ───────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── PÚBLICAS ── */}
          <Route path="/"     element={<App />} />
          <Route path="/home" element={<App />} />

          <Route path="/lakers"   element={<Lakers />} />
          <Route path="/chicago"  element={<Chicago />} />
          <Route path="/boston"   element={<Boston />} />
          <Route path="/white"    element={<White />} />
          <Route path="/vegas"    element={<Vegas />} />
          <Route path="/atlanta"  element={<Atlanta />} />
          <Route path="/red"      element={<Red />} />
          <Route path="/arizona"  element={<Arizona />} />
          <Route path="/falcon"   element={<Falcon />} />

          <Route path="/categorias" element={<Categorias />} />
          <Route path="/carrito"    element={<Carrito />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/registrar"  element={<Registrar />} />

          {/* ✅ /personalizacion → diseñador visual para USUARIOS */}
          <Route path="/personalizacion" element={<PersonalizacionUsuario />} />

          <Route path="/mi-cuenta" element={<ProtectedUserRoute><MiCuenta /></ProtectedUserRoute>} />

          {/* ── PQRS ── */}
          <Route path="/pqrs"         element={<PqrsRedirect />} />
          <Route path="/pqrs-publico" element={<PQRS />} />
          <Route path="/pqrs-admin"   element={<ProtectedAdminRoute><PqrsAdmin /></ProtectedAdminRoute>} />

          {/* ── ADMIN ── */}
          <Route path="/admin"      element={<ProtectedAdminRoute><AdminHome /></ProtectedAdminRoute>} />
          <Route path="/usuarios"   element={<ProtectedAdminRoute><Usuarios /></ProtectedAdminRoute>} />
          <Route path="/roles"      element={<ProtectedAdminRoute><RolesComponent /></ProtectedAdminRoute>} />
          <Route path="/inventario" element={<ProtectedAdminRoute><Inventario /></ProtectedAdminRoute>} />
          <Route path="/pago"       element={<ProtectedAdminRoute><Pago /></ProtectedAdminRoute>} />
          <Route path="/envios"     element={<ProtectedAdminRoute><Envios /></ProtectedAdminRoute>} />
          <Route path="/registros"  element={<ProtectedAdminRoute><Registros /></ProtectedAdminRoute>} />
          <Route path="/ventas"     element={<ProtectedAdminRoute><Ventas /></ProtectedAdminRoute>} />
          <Route path="/pedido"     element={<ProtectedAdminRoute><Pedido /></ProtectedAdminRoute>} />

          {/* ✅ /admin/personalizaciones → CRUD admin de personalizaciones */}
          <Route path="/admin/personalizaciones" element={<ProtectedAdminRoute><PersonalizacionAdmin /></ProtectedAdminRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);