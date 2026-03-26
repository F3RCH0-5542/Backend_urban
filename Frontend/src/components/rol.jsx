import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { listRoles, createRol, updateRol, deleteRol } from "../services/rolService";

/* ─── Estilos ─────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rol-root {
    min-height: 100vh;
    background: #0a0a0a;
    font-family: 'DM Sans', sans-serif;
    color: #e8e8e8;
  }

  /* Nav */
  .rol-nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 40px;
    border-bottom: 1px solid #1c1c1c;
    position: sticky; top: 0; z-index: 10;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(12px);
  }
  .rol-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 18px; letter-spacing: 3px;
    color: #fff; text-decoration: none;
  }
  .rol-back {
    font-size: 12px; font-weight: 500; letter-spacing: 1.5px;
    color: #666; text-decoration: none;
    padding: 8px 16px; border: 1px solid #222; border-radius: 6px;
    transition: all .2s;
  }
  .rol-back:hover { color: #fff; border-color: #444; }

  /* Layout */
  .rol-page {
    max-width: 680px; margin: 0 auto;
    padding: 56px 24px;
  }

  /* Header */
  .rol-heading {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800;
    letter-spacing: -1px; margin-bottom: 6px;
  }
  .rol-sub {
    color: #555; font-size: 14px; margin-bottom: 40px;
  }

  /* Toast */
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;
    font-size: 14px; font-weight: 500;
    animation: fadeSlide .25s ease;
  }
  .toast-err { background: #1a0a0a; border: 1px solid #3d1212; color: #f87171; }
  .toast-ok  { background: #091a13; border: 1px solid #0d3a22; color: #34d399; }
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Create form */
  .create-box {
    background: #111; border: 1px solid #1e1e1e; border-radius: 12px;
    padding: 24px; margin-bottom: 32px;
  }
  .create-box h3 {
    font-family: 'Syne', sans-serif;
    font-size: 11px; letter-spacing: 2px; font-weight: 700;
    color: #444; text-transform: uppercase; margin-bottom: 16px;
  }
  .rol-input, .rol-textarea {
    width: 100%; background: #0a0a0a;
    border: 1px solid #1e1e1e; border-radius: 8px;
    padding: 11px 14px; color: #e8e8e8;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color .2s;
    margin-bottom: 10px;
  }
  .rol-textarea { resize: vertical; min-height: 70px; }
  .rol-input:focus, .rol-textarea:focus { border-color: #3b82f6; }
  .rol-input::placeholder, .rol-textarea::placeholder { color: #333; }

  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 700; letter-spacing: 1px;
    transition: all .18s;
  }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .btn-primary { background: #2563eb; color: #fff; }
  .btn-primary:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  .btn-success { background: #059669; color: #fff; }
  .btn-success:hover:not(:disabled) { background: #047857; }
  .btn-danger  { background: #dc2626; color: #fff; }
  .btn-danger:hover:not(:disabled)  { background: #b91c1c; }
  .btn-ghost   { background: #1c1c1c; color: #aaa; border: 1px solid #2a2a2a; }
  .btn-ghost:hover:not(:disabled)   { background: #252525; color: #fff; }

  /* Roles list */
  .roles-list { display: flex; flex-direction: column; gap: 10px; }

  .role-card {
    display: flex; align-items: center; gap: 16px;
    background: #111; border: 1px solid #1e1e1e; border-radius: 12px;
    padding: 16px 18px;
    transition: border-color .2s, transform .18s;
  }
  .role-card:hover { border-color: #2a2a2a; transform: translateX(3px); }

  .role-badge {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .badge-0 { background: linear-gradient(135deg,#7c3aed,#a855f7); }
  .badge-1 { background: linear-gradient(135deg,#059669,#10b981); }
  .badge-n { background: linear-gradient(135deg,#1d4ed8,#3b82f6); }

  .role-info { flex: 1; min-width: 0; }
  .role-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .role-desc { font-size: 13px; color: #555; margin-top: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .role-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .icon-btn {
    width: 32px; height: 32px; border-radius: 7px;
    background: #0a0a0a; border: 1px solid #1e1e1e;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .icon-btn:hover { background: #1a1a1a; border-color: #333; transform: scale(1.1); }

  /* Empty / loader */
  .empty { text-align: center; padding: 48px 0; color: #444; }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid #1e1e1e; border-top-color: #3b82f6;
    animation: spin .7s linear infinite; margin: 32px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Modal */
  .overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,.75); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeSlide .2s ease;
  }
  .modal {
    background: #111; border: 1px solid #222; border-radius: 16px;
    padding: 28px; width: 100%; max-width: 420px;
  }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 800; letter-spacing: .5px;
    margin-bottom: 20px; color: #fff;
  }
  .modal-label {
    display: block; font-size: 11px; letter-spacing: 1.5px;
    color: #555; text-transform: uppercase; font-weight: 600;
    margin-bottom: 6px;
  }
  .modal-warn { color: #888; font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
  .modal-warn strong { color: #fff; }
  .modal-btns { display: flex; gap: 10px; justify-content: flex-end; }
`;

/* ─── Badge helper ────────────────────────────────────────────────────── */
const Badge = ({ index }) => {
  const cls = index === 0 ? "badge-0" : index === 1 ? "badge-1" : "badge-n";
  const icon = index === 0 ? "👑" : index === 1 ? "🛡️" : "👤";
  return <div className={`role-badge ${cls}`}>{icon}</div>;
};

/* ─── Component ───────────────────────────────────────────────────────── */
const Rol = ({ token: propToken }) => {
  const token = propToken || localStorage.getItem("token");

  const [roles, setRoles]           = useState([]);
  const [newRol, setNewRol]         = useState({ nombre_rol: "", descripcion: "" });
  const [editingRol, setEditingRol] = useState(null);
  const [deletingRol, setDeletingRol] = useState(null);
  const [msg, setMsg]               = useState({ text: "", type: "" });
  const [loading, setLoading]       = useState(false);

  const notify = (text, type = "ok") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try { setLoading(true); setRoles(await listRoles(token)); }
      catch { notify("No se pudieron cargar los roles", "err"); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const handleCreate = async () => {
    if (!newRol.nombre_rol.trim()) return notify("Ingresa un nombre para el rol", "err");
    try {
      setLoading(true);
      const data = await createRol({
        nombre_rol: newRol.nombre_rol.trim(),
        descripcion: newRol.descripcion.trim() || "Sin descripción",
      }, token);
      setRoles(r => [...r, data.rol || data]);
      setNewRol({ nombre_rol: "", descripcion: "" });
      notify("Rol creado exitosamente");
    } catch (e) { notify(e.response?.data?.msg || "No se pudo crear el rol", "err"); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    if (!editingRol.nombre_rol.trim()) return notify("El nombre no puede estar vacío", "err");
    try {
      setLoading(true);
      await updateRol(editingRol.id_rol, {
        nombre_rol: editingRol.nombre_rol.trim(),
        descripcion: editingRol.descripcion.trim() || "Sin descripción",
      }, token);
      setRoles(r => r.map(x => x.id_rol === editingRol.id_rol ? editingRol : x));
      setEditingRol(null);
      notify("Rol actualizado exitosamente");
    } catch (e) { notify(e.response?.data?.msg || "No se pudo actualizar el rol", "err"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteRol(deletingRol.id_rol, token);
      setRoles(r => r.filter(x => x.id_rol !== deletingRol.id_rol));
      setDeletingRol(null);
      notify("Rol eliminado");
    } catch (e) { notify(e.response?.data?.msg || "No se pudo eliminar el rol", "err"); }
    finally { setLoading(false); }
  };

  const closeOnOverlay = (fn) => (e) => { if (e.target === e.currentTarget) fn(); };

  return (
    <div className="rol-root">
      <style>{css}</style>

      {/* Nav */}
      <nav className="rol-nav">
        <a href="/home" className="rol-logo">URBAN CAPS</a>
        <a href="/Admin" className="rol-back">← VOLVER</a>
      </nav>

      <div className="rol-page">
        <h1 className="rol-heading">Gestión de Roles</h1>
        <p className="rol-sub">Crea, edita y elimina roles del sistema</p>

        {/* Toast */}
        {msg.text && (
          <div className={`toast ${msg.type === "err" ? "toast-err" : "toast-ok"}`}>
            {msg.type === "err" ? "⚠️" : "✅"} {msg.text}
          </div>
        )}

        {/* Create form */}
        <div className="create-box">
          <h3>Nuevo rol</h3>
          <input
            className="rol-input"
            placeholder="Nombre del rol..."
            value={newRol.nombre_rol}
            onChange={e => setNewRol(r => ({ ...r, nombre_rol: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            disabled={loading}
          />
          <textarea
            className="rol-textarea"
            placeholder="Descripción (opcional)..."
            value={newRol.descripcion}
            onChange={e => setNewRol(r => ({ ...r, descripcion: e.target.value }))}
            disabled={loading}
          />
          <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? "⏳" : "+"} {loading ? "CREANDO..." : "CREAR ROL"}
          </button>
        </div>

        {/* List */}
        {loading && !roles.length
          ? <div className="spinner" />
          : !roles.length
          ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <p>No hay roles registrados aún</p>
            </div>
          ) : (
            <div className="roles-list">
              {roles.map((rol, i) => (
                <div className="role-card" key={rol.id_rol}>
                  <Badge index={i} />
                  <div className="role-info">
                    <div className="role-name">{rol.nombre_rol}</div>
                    <div className="role-desc">{rol.descripcion || "Sin descripción"}</div>
                  </div>
                  <div className="role-actions">
                    <button className="icon-btn" onClick={() => setEditingRol({ ...rol })} title="Editar">✏️</button>
                    <button className="icon-btn" onClick={() => setDeletingRol(rol)} title="Eliminar">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* Modal Editar */}
      {editingRol && (
        <div className="overlay" onClick={closeOnOverlay(() => setEditingRol(null))}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-title">✏️ Editar Rol</div>
            <label className="modal-label">Nombre</label>
            <input
              className="rol-input"
              value={editingRol.nombre_rol}
              onChange={e => setEditingRol(r => ({ ...r, nombre_rol: e.target.value }))}
              disabled={loading}
            />
            <label className="modal-label">Descripción</label>
            <textarea
              className="rol-textarea"
              value={editingRol.descripcion}
              onChange={e => setEditingRol(r => ({ ...r, descripcion: e.target.value }))}
              disabled={loading}
            />
            <div className="modal-btns">
              <button className="btn btn-ghost" onClick={() => setEditingRol(null)}>Cancelar</button>
              <button className="btn btn-success" onClick={handleUpdate} disabled={loading}>
                {loading ? "Guardando..." : "💾 Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deletingRol && (
        <div className="overlay" onClick={closeOnOverlay(() => setDeletingRol(null))}>
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-title">⚠️ Confirmar eliminación</div>
            <p className="modal-warn">
              ¿Eliminar el rol <strong>"{deletingRol.nombre_rol}"</strong>?
              <br />Esta acción no se puede deshacer.
            </p>
            <div className="modal-btns">
              <button className="btn btn-ghost" onClick={() => setDeletingRol(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
                {loading ? "Eliminando..." : "🗑️ Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Rol.propTypes = { token: PropTypes.string };
Rol.defaultProps = { token: "" };

export default Rol;