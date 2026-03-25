import { useEffect, useState, useCallback } from "react";
import Sidebar from "../componente/sidebar";
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuarioService";
import "./usuarios.css";

const ITEMS_PER_PAGE = 8;

const FORM_INICIAL = {
  nombre: "",
  apellido: "",
  documento: "",
  correo: "",
  clave: "",
  id_rol: 3,
};

export default function Usuarios() {
  const [usuarios, setUsuarios]       = useState([]);
  const [filtrados, setFiltrados]     = useState([]);
  const [busqueda, setBusqueda]       = useState("");
  const [paginaActual, setPagina]     = useState(1);
  const [form, setForm]               = useState(FORM_INICIAL);
  const [editando, setEditando]       = useState(false);
  const [editId, setEditId]           = useState(null);
  const [mostrarModal, setModal]      = useState(false);
  const [confirmarId, setConfirmarId] = useState(null); // reemplaza window.confirm
  const [error, setError]             = useState("");
  const [exito, setExito]             = useState("");
  const [cargando, setCargando]       = useState(true);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch {
      setError("Error al cargar usuarios. Verifica tu sesión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarUsuarios(); }, [cargarUsuarios]);

  // ── Filtrado ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = busqueda.toLowerCase().trim();
    setFiltrados(
      q
        ? usuarios.filter(
            (u) =>
              u.nombre?.toLowerCase().includes(q) ||
              u.apellido?.toLowerCase().includes(q) ||
              String(u.id_usuario).includes(q)
          )
        : usuarios
    );
    setPagina(1);
  }, [busqueda, usuarios]);

  // ── Cerrar modal con Escape ─────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") resetForm(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(""), 3000);
  };

  const resetForm = () => {
    setForm(FORM_INICIAL);
    setEditando(false);
    setEditId(null);
    setModal(false);
    setError("");
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editando) {
        const { clave, ...datos } = form;
        await actualizarUsuario(editId, datos);
        setUsuarios((prev) =>
          prev.map((u) => (u.id_usuario === editId ? { ...u, ...datos } : u))
        );
        mostrarExito("Usuario actualizado exitosamente.");
      } else {
        await crearUsuario(form);
        await cargarUsuarios();
        mostrarExito("Usuario creado exitosamente.");
      }
      resetForm();
    } catch (err) {
      setError(err?.msg || "Error al procesar la solicitud.");
    }
  };

  // ── Eliminar (con modal de confirmación propio) ─────────────────────────────
  const confirmarEliminar = async () => {
    if (!confirmarId) return;
    try {
      await eliminarUsuario(confirmarId);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== confirmarId));
      mostrarExito("Usuario eliminado.");
    } catch (err) {
      setError(err?.msg || "Error al eliminar usuario.");
    } finally {
      setConfirmarId(null);
    }
  };

  const editar = (u) => {
    setForm({
      nombre: u.nombre,
      apellido: u.apellido,
      documento: u.documento,
      correo: u.correo,
      clave: "",
      id_rol: u.id_rol || 3,
    });
    setEditando(true);
    setEditId(u.id_usuario);
    setModal(true);
  };

  // ── Paginación ──────────────────────────────────────────────────────────────
  const totalPaginas     = Math.ceil(filtrados.length / ITEMS_PER_PAGE);
  const inicio           = (paginaActual - 1) * ITEMS_PER_PAGE;
  const usuariosPagina   = filtrados.slice(inicio, inicio + ITEMS_PER_PAGE);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="u-layout">
      <Sidebar />

      <div className="u-main">
        {/* HEADER */}
        <div className="u-header">
          <div>
            <h1 className="u-title">👥 Gestión de Usuarios</h1>
            <p className="u-subtitle">Administra los usuarios del sistema</p>
          </div>
          <button
            type="button"
            className="u-btn-primary"
            onClick={() => { resetForm(); setModal(true); }}
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* ALERTAS */}
        {error && <div className="u-alert u-alert-error" role="alert">❌ {error}</div>}
        {exito && <div className="u-alert u-alert-success" role="status">✅ {exito}</div>}

        {/* BUSCADOR */}
        <div className="u-toolbar">
          <div className="u-search">
            <span className="u-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Buscar por nombre, apellido o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar usuarios"
            />
          </div>
          <span className="u-badge">{filtrados.length} usuario{filtrados.length !== 1 ? "s" : ""}</span>
        </div>

        {/* TABLA */}
        <div className="u-card">
          {cargando ? (
            <div className="u-loading" aria-busy="true">
              <div className="u-spinner" role="status" aria-label="Cargando" />
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <div className="u-table-wrap">
              <table className="u-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPagina.length > 0
                    ? usuariosPagina.map((u, i) => (
                        <tr key={u.id_usuario} style={{ animationDelay: `${i * 40}ms` }}>
                          <td><span className="u-id">#{u.id_usuario}</span></td>
                          <td>{u.nombre}</td>
                          <td>{u.apellido}</td>
                          <td>{u.documento}</td>
                          <td>{u.correo}</td>
                          <td>
                            <div className="u-actions">
                              <button type="button" className="u-btn-edit" onClick={() => editar(u)}>
                                ✏️ Editar
                              </button>
                              <button type="button" className="u-btn-delete" onClick={() => setConfirmarId(u.id_usuario)}>
                                🗑️ Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : (
                      <tr>
                        <td colSpan={6} className="u-empty">
                          {busqueda ? `Sin resultados para "${busqueda}"` : "No hay usuarios registrados"}
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <nav className="u-pagination" aria-label="Paginación">
              <button
                type="button"
                className="u-page-btn"
                disabled={paginaActual === 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                ← Anterior
              </button>
              <div className="u-pages">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`u-page-num${paginaActual === p ? " active" : ""}`}
                    onClick={() => setPagina(p)}
                    aria-current={paginaActual === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="u-page-btn"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                Siguiente →
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* MODAL — CREAR / EDITAR */}
      {mostrarModal && (
        <div
          className="u-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <div className="u-modal">
            <div className="u-modal-header">
              <h2 id="modal-title" className="u-modal-title">
                {editando ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
              </h2>
              <button type="button" className="u-modal-close" onClick={resetForm} aria-label="Cerrar">✕</button>
            </div>

            {error && <div className="u-alert u-alert-error u-alert-modal" role="alert">❌ {error}</div>}

            <form onSubmit={handleSubmit} className="u-form" noValidate>
              <div className="u-form-grid">
                <div className="u-field">
                  <label htmlFor="f-nombre">Nombre</label>
                  <input id="f-nombre" type="text" name="nombre" value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required placeholder="Nombre" autoComplete="given-name" />
                </div>
                <div className="u-field">
                  <label htmlFor="f-apellido">Apellido</label>
                  <input id="f-apellido" type="text" name="apellido" value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    required placeholder="Apellido" autoComplete="family-name" />
                </div>
                <div className="u-field">
                  <label htmlFor="f-documento">Documento</label>
                  <input id="f-documento" type="text" name="documento" value={form.documento}
                    onChange={(e) => setForm({ ...form, documento: e.target.value })}
                    required placeholder="Documento" />
                </div>
                <div className="u-field">
                  <label htmlFor="f-correo">Correo</label>
                  <input id="f-correo" type="email" name="correo" value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    required placeholder="correo@ejemplo.com" autoComplete="email" />
                </div>
                {!editando && (
                  <div className="u-field">
                    <label htmlFor="f-clave">Contraseña</label>
                    <input id="f-clave" type="password" name="clave" value={form.clave}
                      onChange={(e) => setForm({ ...form, clave: e.target.value })}
                      required placeholder="••••••••" autoComplete="new-password" />
                  </div>
                )}
                <div className="u-field">
                  <label htmlFor="f-rol">Rol</label>
                  <select id="f-rol" name="id_rol" value={form.id_rol}
                    onChange={(e) => setForm({ ...form, id_rol: Number(e.target.value) })}>
                    <option value={1}>Super Admin</option>
                    <option value={2}>Admin</option>
                    <option value={3}>Cliente</option>
                  </select>
                </div>
              </div>
              <div className="u-form-actions">
                <button type="submit" className="u-btn-primary">
                  {editando ? "Actualizar" : "Crear Usuario"}
                </button>
                <button type="button" className="u-btn-ghost" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL — CONFIRMAR ELIMINACIÓN (reemplaza window.confirm) */}
      {confirmarId !== null && (
        <div
          className="u-modal-overlay"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="u-modal u-modal-sm">
            <div className="u-modal-header">
              <h2 id="confirm-title" className="u-modal-title">🗑️ Confirmar eliminación</h2>
            </div>
            <div className="u-confirm-body">
              <p>¿Estás seguro de que deseas eliminar al usuario <strong>#{confirmarId}</strong>? Esta acción no se puede deshacer.</p>
            </div>
            <div className="u-confirm-actions">
              <button type="button" className="u-btn-danger" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button type="button" className="u-btn-ghost" onClick={() => setConfirmarId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}