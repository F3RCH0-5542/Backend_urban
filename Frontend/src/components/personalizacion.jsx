import React, { useState, useEffect } from 'react';
import { listPersonalizaciones, createPersonalizacion, updatePersonalizacion, deletePersonalizacion } from '../services/personalizacionService';

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  .adm-root {
    min-height: 100vh;
    background: #080808;
    font-family: 'DM Sans', sans-serif;
    color: #d4d4d4;
  }

  /* ── Top bar ── */
  .adm-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 32px;
    background: #0f0f0f;
    border-bottom: 1px solid #1a1a1a;
    position: sticky; top: 0; z-index: 50;
  }
  .adm-topbar-left { display: flex; align-items: center; gap: 12px; }
  .adm-badge-admin {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 1px;
    color: #ef4444; background: rgba(239,68,68,.1);
    border: 1px solid rgba(239,68,68,.25);
    padding: 3px 10px; border-radius: 4px;
    text-transform: uppercase;
  }
  .adm-title {
    font-family: 'Syne', sans-serif;
    font-size: 17px; font-weight: 800;
    color: #fff; letter-spacing: -.3px;
  }
  .adm-back {
    font-size: 12px; letter-spacing: 1px; font-weight: 500;
    color: #555; text-decoration: none;
    padding: 7px 14px; border: 1px solid #1e1e1e; border-radius: 6px;
    transition: all .2s;
  }
  .adm-back:hover { color: #fff; border-color: #333; }

  /* ── Page layout ── */
  .adm-page { max-width: 1200px; margin: 0 auto; padding: 40px 24px 80px; }

  /* ── Stats row ── */
  .adm-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 32px;
  }
  .adm-stat {
    background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 10px;
    padding: 18px 20px;
  }
  .adm-stat-label {
    font-size: 10px; letter-spacing: 1.5px; font-weight: 600;
    color: #444; text-transform: uppercase; margin-bottom: 6px;
  }
  .adm-stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 800; color: #fff;
  }
  .adm-stat-value.accent { color: #d4a017; }

  /* ── Section card ── */
  .adm-card {
    background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 14px;
    padding: 28px; margin-bottom: 24px;
  }
  .adm-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 2px;
    color: #444; text-transform: uppercase; margin-bottom: 20px;
  }

  /* ── Toast ── */
  .adm-toast {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;
    font-size: 14px; font-weight: 500;
    animation: fadeUp .25s ease;
  }
  .adm-toast.err { background: #1a0808; border: 1px solid #3d1212; color: #f87171; }
  .adm-toast.ok  { background: #081a10; border: 1px solid #0d3a1e; color: #34d399; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Table ── */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table {
    width: 100%; border-collapse: collapse;
    font-size: 13.5px;
  }
  .adm-table th {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; font-weight: 500;
    color: #444; text-transform: uppercase;
    padding: 10px 16px; text-align: left;
    border-bottom: 1px solid #1a1a1a;
  }
  .adm-table td {
    padding: 14px 16px; border-bottom: 1px solid #141414;
    color: #bbb; vertical-align: middle;
  }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #111; }

  .adm-id {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; color: #555;
  }
  .adm-tipo {
    font-weight: 600; color: #e0e0e0; text-transform: capitalize;
  }
  .adm-desc {
    max-width: 240px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
    color: #777;
  }
  .adm-costo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; color: #d4a017; font-weight: 600;
  }
  .adm-pedido-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: #3b82f6;
    background: rgba(59,130,246,.08);
    border: 1px solid rgba(59,130,246,.2);
    padding: 2px 8px; border-radius: 4px;
  }

  /* ── Botones tabla ── */
  .adm-btn-edit, .adm-btn-del {
    padding: 5px 12px; border-radius: 5px; border: 1px solid;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all .15s; margin-right: 6px;
  }
  .adm-btn-edit {
    background: rgba(59,130,246,.08); border-color: rgba(59,130,246,.2);
    color: #3b82f6;
  }
  .adm-btn-edit:hover { background: rgba(59,130,246,.18); }
  .adm-btn-del {
    background: rgba(239,68,68,.08); border-color: rgba(239,68,68,.2);
    color: #ef4444;
  }
  .adm-btn-del:hover { background: rgba(239,68,68,.18); }

  /* ── Form ── */
  .adm-form-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px; margin-bottom: 16px;
  }
  .adm-label {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 1.5px; color: #555; text-transform: uppercase;
    margin-bottom: 6px;
  }
  .adm-input, .adm-textarea, .adm-select {
    width: 100%; background: #080808;
    border: 1px solid #1e1e1e; border-radius: 7px;
    padding: 10px 13px; color: #e0e0e0;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color .2s;
    box-sizing: border-box;
  }
  .adm-textarea { resize: vertical; min-height: 80px; }
  .adm-input:focus, .adm-textarea:focus, .adm-select:focus { border-color: #d4a017; }
  .adm-input::placeholder, .adm-textarea::placeholder { color: #2a2a2a; }

  /* ── Buttons ── */
  .adm-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 20px; border-radius: 7px; border: none;
    font-family: 'Syne', sans-serif; font-size: 12px;
    font-weight: 700; letter-spacing: .8px; cursor: pointer;
    transition: all .18s;
  }
  .adm-btn:disabled { opacity: .4; cursor: not-allowed; }
  .adm-btn-primary { background: #d4a017; color: #000; }
  .adm-btn-primary:hover:not(:disabled) { background: #e6b020; transform: translateY(-1px); }
  .adm-btn-success { background: #059669; color: #fff; }
  .adm-btn-success:hover:not(:disabled) { background: #047857; }
  .adm-btn-danger  { background: #dc2626; color: #fff; }
  .adm-btn-danger:hover:not(:disabled)  { background: #b91c1c; }
  .adm-btn-ghost   { background: #1a1a1a; color: #888; border: 1px solid #222; }
  .adm-btn-ghost:hover:not(:disabled)   { background: #222; color: #fff; }

  /* ── Paginación ── */
  .adm-pagination { display: flex; align-items: center; gap: 6px; margin-top: 20px; }
  .adm-page-btn {
    width: 32px; height: 32px; border-radius: 6px;
    background: #141414; border: 1px solid #1e1e1e;
    color: #777; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .adm-page-btn:hover { background: #1e1e1e; color: #fff; }
  .adm-page-btn.active { background: #d4a017; border-color: #d4a017; color: #000; font-weight: 700; }
  .adm-page-btn:disabled { opacity: .3; cursor: not-allowed; }

  /* ── Empty ── */
  .adm-empty { text-align: center; padding: 48px; color: #333; }
  .adm-empty-icon { font-size: 36px; margin-bottom: 10px; }
  .adm-spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid #1e1e1e; border-top-color: #d4a017;
    animation: spin .7s linear infinite; margin: 40px auto;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Modal ── */
  .adm-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.8); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px; animation: fadeUp .2s ease;
  }
  .adm-modal {
    background: #0f0f0f; border: 1px solid #222; border-radius: 14px;
    padding: 28px; width: 100%; max-width: 560px;
    max-height: 90vh; overflow-y: auto;
  }
  .adm-modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 800; color: #fff;
    margin-bottom: 24px; letter-spacing: .3px;
  }
  .adm-modal-warn { color: #777; font-size: 14px; line-height: 1.7; margin-bottom: 24px; }
  .adm-modal-warn strong { color: #fff; }
  .adm-modal-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  @media (max-width: 768px) {
    .adm-stats { grid-template-columns: repeat(2, 1fr); }
    .adm-form-grid { grid-template-columns: 1fr; }
    .adm-topbar { padding: 14px 16px; }
    .adm-page { padding: 24px 16px; }
  }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v || 0);

// ✅ CORREGIDO: tipos en minúscula para coincidir con el backend
const TIPOS = ['bordado', 'estampado', 'parche', 'tie-dye', 'otro'];

const emptyForm = { id_pedido: '', tipo_personalizacion: '', descripcion: '', costo_adicional: '' };

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function PersonalizacionAdmin() {

  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [msg, setMsg]               = useState({ text: '', type: '' });
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage]             = useState(1);
  const PER_PAGE = 8;

  const notify = (text, type = 'ok') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await listPersonalizaciones();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      notify(e.msg || 'Error al cargar personalizaciones', 'err');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tipo_personalizacion || !form.descripcion)
      return notify('Tipo y descripción son obligatorios', 'err');

    // ✅ CORREGIDO: nombres de campos que espera el backend
    const payload = {
      id_pedido:                   form.id_pedido ? parseInt(form.id_pedido) : null,
      tipo_personalizacion:        form.tipo_personalizacion,
      descripcion_personalizacion: form.descripcion.trim(),
      precio_adicional:            form.costo_adicional ? parseFloat(form.costo_adicional) : 0,
    };

    try {
      setLoading(true);
      if (editingId) {
        await updatePersonalizacion(editingId, payload);
        notify('Personalización actualizada');
      } else {
        await createPersonalizacion(payload);
        notify('Personalización creada');
      }
      await fetchAll();
      resetForm();
    } catch (e) {
      notify(e.msg || 'Error al guardar', 'err');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePersonalizacion(deletingItem.id_personalizacion);
      notify('Personalización eliminada');
      await fetchAll();
      setShowDeleteModal(false);
      setDeletingItem(null);
    } catch (e) {
      notify(e.msg || 'Error al eliminar', 'err');
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (item) => {
    setEditingId(item.id_personalizacion);
    // ✅ CORREGIDO: leer los campos correctos que devuelve el backend
    setForm({
      id_pedido:            item.id_pedido?.toString() || '',
      tipo_personalizacion: item.tipo_personalizacion || '',
      descripcion:          item.descripcion_personalizacion || '',
      costo_adicional:      item.precio_adicional?.toString() || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowEditModal(false);
  };

  // Paginación
  const total = items.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paged = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  // ✅ CORREGIDO: usar precio_adicional en vez de costo_adicional
  const totalCosto = items.reduce((s, i) => s + (parseFloat(i.precio_adicional) || 0), 0);

  const closeOnOverlay = (fn) => (e) => { if (e.target === e.currentTarget) fn(); };

  return (
    <div className="adm-root">
      <style>{css}</style>

      {/* Top bar */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <span className="adm-badge-admin">Admin</span>
          <span className="adm-title">Panel de Personalizaciones</span>
        </div>
        <a href="/Admin" className="adm-back">← Panel Admin</a>
      </div>

      <div className="adm-page">

        {/* Toast */}
        {msg.text && (
          <div className={`adm-toast ${msg.type}`}>
            {msg.type === 'err' ? '⚠️' : '✅'} {msg.text}
          </div>
        )}

        {/* Stats */}
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-label">Total</div>
            <div className="adm-stat-value">{total}</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Ingresos adicionales</div>
            <div className="adm-stat-value accent">{fmt(totalCosto)}</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Tipos distintos</div>
            <div className="adm-stat-value">{new Set(items.map(i => i.tipo_personalizacion)).size}</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Con pedido</div>
            <div className="adm-stat-value">{items.filter(i => i.id_pedido).length}</div>
          </div>
        </div>

        {/* Tabla */}
        <div className="adm-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="adm-card-title" style={{ marginBottom: 0 }}>Registros</div>
            <button className="adm-btn adm-btn-primary" onClick={() => { resetForm(); setShowEditModal(true); }}>
              + Nueva personalización
            </button>
          </div>

          {loading && !items.length
            ? <div className="adm-spinner" />
            : !items.length
            ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">🎨</div>
                <p>No hay personalizaciones registradas</p>
              </div>
            ) : (
              <>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Pedido</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Precio adicional</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map(item => (
                        <tr key={item.id_personalizacion}>
                          <td><span className="adm-id">#{item.id_personalizacion}</span></td>
                          <td>
                            {item.id_pedido
                              ? <span className="adm-pedido-tag">#{item.id_pedido}</span>
                              : <span style={{ color: '#333' }}>—</span>}
                          </td>
                          <td><span className="adm-tipo">{item.tipo_personalizacion}</span></td>
                          {/* ✅ CORREGIDO: campo correcto del backend */}
                          <td><span className="adm-desc">{item.descripcion_personalizacion}</span></td>
                          {/* ✅ CORREGIDO: campo correcto del backend */}
                          <td><span className="adm-costo">{fmt(item.precio_adicional)}</span></td>
                          <td>
                            <button className="adm-btn-edit" onClick={() => openEdit(item)}>Editar</button>
                            <button className="adm-btn-del" onClick={() => { setDeletingItem(item); setShowDeleteModal(true); }}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="adm-pagination">
                    <button className="adm-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} className={`adm-page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    ))}
                    <button className="adm-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                  </div>
                )}
              </>
            )
          }
        </div>
      </div>

      {/* ── Modal crear / editar ── */}
      {showEditModal && (
        <div className="adm-overlay" onClick={closeOnOverlay(resetForm)}>
          <div className="adm-modal" role="dialog" aria-modal="true">
            <div className="adm-modal-title">
              {editingId ? `✏️ Editar personalización #${editingId}` : '➕ Nueva personalización'}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="adm-form-grid">
                <div>
                  <label className="adm-label">ID Pedido</label>
                  <input className="adm-input" type="number" placeholder="Nº de pedido"
                    value={form.id_pedido} onChange={e => setF('id_pedido', e.target.value)} disabled={loading} />
                </div>
                <div>
                  <label className="adm-label">Tipo *</label>
                  {/* ✅ CORREGIDO: tipos en minúscula como espera el backend */}
                  <select className="adm-select" value={form.tipo_personalizacion}
                    onChange={e => setF('tipo_personalizacion', e.target.value)} disabled={loading} required>
                    <option value="">Seleccionar...</option>
                    {TIPOS.map(t => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="adm-label">Precio adicional</label>
                  <input className="adm-input" type="number" step="0.01" min="0" placeholder="0"
                    value={form.costo_adicional} onChange={e => setF('costo_adicional', e.target.value)} disabled={loading} />
                </div>
              </div>
              <div style={{ marginBottom: 0 }}>
                <label className="adm-label">Descripción *</label>
                <textarea className="adm-textarea" placeholder="Describe los detalles de la personalización..."
                  value={form.descripcion} onChange={e => setF('descripcion', e.target.value)}
                  disabled={loading} required />
              </div>
              <div className="adm-modal-btns">
                <button type="button" className="adm-btn adm-btn-ghost" onClick={resetForm}>Cancelar</button>
                <button type="submit" className="adm-btn adm-btn-success" disabled={loading}>
                  {loading ? '⏳ Guardando...' : editingId ? '💾 Actualizar' : '✅ Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal eliminar ── */}
      {showDeleteModal && deletingItem && (
        <div className="adm-overlay" onClick={closeOnOverlay(() => { setShowDeleteModal(false); setDeletingItem(null); })}>
          <div className="adm-modal" style={{ maxWidth: 420 }} role="dialog" aria-modal="true">
            <div className="adm-modal-title">⚠️ Confirmar eliminación</div>
            <p className="adm-modal-warn">
              ¿Eliminar la personalización <strong>#{deletingItem.id_personalizacion} — {deletingItem.tipo_personalizacion}</strong>?
              <br />Esta acción no se puede deshacer.
            </p>
            <div className="adm-modal-btns">
              <button className="adm-btn adm-btn-ghost" onClick={() => { setShowDeleteModal(false); setDeletingItem(null); }}>Cancelar</button>
              <button className="adm-btn adm-btn-danger" onClick={handleDelete} disabled={loading}>
                {loading ? 'Eliminando...' : '🗑️ Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}