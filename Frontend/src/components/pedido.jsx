import React, { useState, useEffect, useCallback } from 'react';
import { listPedidos, createPedido, updatePedido, deletePedido } from '../services/pedidoService';

/* ─── tokens ─────────────────────────────────────────────── */
const T = {
  bg:      "#0f172a",
  surface: "#1e293b",
  card:    "#334155",
  text:    "#f1f5f9",
  muted:   "#94a3b8",
  green:   "#10b981",
  blue:    "#3b82f6",
  red:     "#ef4444",
  amber:   "#f59e0b",
  purple:  "#6366f1",
  gray:    "#475569",
};

const ESTADO_COLOR = {
  Completado:   T.green,
  Pendiente:    T.amber,
  Cancelado:    T.red,
  "En Proceso": T.blue,
};

const ESTADO_ICON = {
  Completado:   "✅",
  Pendiente:    "⏳",
  Cancelado:    "❌",
  "En Proceso": "🔄",
};

const FORM_INIT = { id_usuario: "", estado: "Pendiente", total: "", fecha_entrega: "" };
const PER_PAGE  = 5;

/* ─── helpers ────────────────────────────────────────────── */
const formatCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" })
    : "Sin definir";

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  return Array.from(pages).sort((a, b) => a - b);
};

/* ─── estilos reutilizables ──────────────────────────────── */
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "2px solid #334155",
  borderRadius: "8px",
  fontSize: "14px",
  color: T.text,
  background: T.bg,
  outline: "none",
  boxSizing: "border-box",
};

const makeBtn = (bg, extra = {}) => ({
  padding: "9px 18px",
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  whiteSpace: "nowrap",
  ...extra,
});

/* ─── componente principal ───────────────────────────────── */
export default function Pedido() {
  const [pedidos, setPedidos]                 = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [success, setSuccess]                 = useState(null);
  const [form, setForm]                       = useState(FORM_INIT);
  const [editingId, setEditingId]             = useState(null);
  const [deletingId, setDeletingId]           = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage]         = useState(1);

  const token = localStorage.getItem("token");

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg ?? "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchPedidos();
  }, [token, fetchPedidos]);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_usuario || !form.total) {
      setError("ID Usuario y Total son obligatorios");
      return;
    }
    const payload = {
      id_usuario:    Number.parseInt(form.id_usuario, 10),
      estado:        form.estado,
      total:         Number.parseFloat(form.total),
      fecha_entrega: form.fecha_entrega || null,
      fecha_pedido:  new Date().toISOString().split("T")[0],
    };
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        await updatePedido(editingId, payload);
        flash("¡Pedido actualizado exitosamente!");
      } else {
        await createPedido(payload);
        flash("¡Pedido creado exitosamente!");
      }
      await fetchPedidos();
      resetForm();
    } catch (err) {
      setError(err.msg ?? "Error al gestionar pedido");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id_pedido);
    setForm({
      id_usuario:    String(p.id_usuario),
      estado:        p.estado,
      total:         String(p.total),
      fecha_entrega: p.fecha_entrega?.split("T")[0] ?? "",
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const openDelete  = (id) => { setDeletingId(id); setShowDeleteModal(true); };
  const closeDelete = ()    => { setShowDeleteModal(false); setDeletingId(null); };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deletePedido(deletingId);
      flash("¡Pedido eliminado exitosamente!");
      await fetchPedidos();
    } catch (err) {
      setError(err.msg ?? "Error al eliminar pedido");
    } finally {
      setLoading(false);
      closeDelete();
    }
  };

  const resetForm = () => { setForm(FORM_INIT); setEditingId(null); };

  const totalPages = Math.ceil(pedidos.length / PER_PAGE);
  const paginated  = pedidos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const pageNums   = getPageNumbers(currentPage, totalPages);

  /* ── sin token ── */
  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg, padding: "20px" }}>
        <div style={{ background: T.surface, borderRadius: "16px", padding: "40px", textAlign: "center", maxWidth: "360px", width: "100%" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔒</div>
          <p style={{ color: T.muted, marginBottom: "24px", fontSize: "15px" }}>
            Debes iniciar sesión para acceder.
          </p>
          <button
            type="button"
            onClick={() => { window.location.href = "/login"; }}
            style={makeBtn(T.purple, { width: "100%", padding: "13px" })}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, padding: "24px 16px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{
          background: T.surface,
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: T.text }}>
              📦 Gestión de Pedidos
            </h1>
            <p style={{ margin: "4px 0 0", color: T.muted, fontSize: "13px" }}>
              Administra y registra todos tus pedidos
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => { window.location.href = "http://localhost:5173/admin"; }}
              style={makeBtn(T.gray)}
            >
              ← Admin
            </button>
            <button
              type="button"
              onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
              style={makeBtn(T.red)}
            >
              🚪 Salir
            </button>
          </div>
        </div>

        {/* ── Alertas ── */}
        {error && (
          <div style={{ background: "#7f1d1d", border: "1px solid #991b1b", borderRadius: "10px", padding: "13px 18px", marginBottom: "18px", color: "#fecaca", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#064e3b", border: "1px solid #065f46", borderRadius: "10px", padding: "13px 18px", marginBottom: "18px", color: "#6ee7b7", fontSize: "14px" }}>
            ✅ {success}
          </div>
        )}

        {/* ── Lista ── */}
        <div style={{ background: T.surface, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 18px", fontSize: "18px", fontWeight: "600", color: T.text }}>
            📋 Pedidos Registrados
          </h2>

          {loading && pedidos.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: T.muted }}>⏳ Cargando...</div>
          ) : paginated.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: T.muted }}>📭 No hay pedidos registrados</div>
          ) : (
            <>
              <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
                {paginated.map((p) => {
                  const estadoColor = ESTADO_COLOR[p.estado] ?? T.purple;
                  const estadoIcon  = ESTADO_ICON[p.estado]  ?? "📦";
                  return (
                    <div
                      key={p.id_pedido}
                      style={{ background: T.card, borderRadius: "10px", padding: "16px", borderLeft: `4px solid ${estadoColor}` }}
                    >
                      {/* fila superior */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "20px" }}>{estadoIcon}</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: "700", color: T.text, fontSize: "15px" }}>
                              Pedido #{p.id_pedido}
                            </p>
                            <p style={{ margin: 0, fontSize: "12px", color: T.muted }}>
                              Usuario #{p.id_usuario}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: estadoColor, color: "#fff", padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                            {p.estado}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            style={makeBtn(T.blue, { fontSize: "13px", padding: "7px 14px" })}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(p.id_pedido)}
                            style={makeBtn(T.red, { fontSize: "13px", padding: "7px 14px" })}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>

                      {/* datos */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", background: T.bg, borderRadius: "8px", padding: "12px" }}>
                        <div>
                          <p style={{ margin: "0 0 2px", fontSize: "10px", color: T.muted, fontWeight: "600", letterSpacing: "0.06em" }}>TOTAL</p>
                          <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: T.green }}>{formatCOP(p.total)}</p>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 2px", fontSize: "10px", color: T.muted, fontWeight: "600", letterSpacing: "0.06em" }}>FECHA PEDIDO</p>
                          <p style={{ margin: 0, fontSize: "13px", color: T.text }}>📅 {formatDate(p.fecha_pedido)}</p>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 2px", fontSize: "10px", color: T.muted, fontWeight: "600", letterSpacing: "0.06em" }}>FECHA ENTREGA</p>
                          <p style={{ margin: 0, fontSize: "13px", color: T.text }}>🚚 {formatDate(p.fecha_entrega)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Paginación inteligente ── */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={makeBtn(T.gray, { opacity: currentPage === 1 ? 0.45 : 1, padding: "8px 14px", fontSize: "13px" })}
                  >
                    ← Anterior
                  </button>

                  {pageNums.map((n, i) => {
                    const prev = pageNums[i - 1];
                    return (
                      <React.Fragment key={n}>
                        {prev && n - prev > 1 && (
                          <span style={{ color: T.muted, padding: "0 2px" }}>…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(n)}
                          style={makeBtn(currentPage === n ? T.purple : "#2d3f55", { minWidth: "36px", padding: "8px 10px", fontSize: "13px" })}
                        >
                          {n}
                        </button>
                      </React.Fragment>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={makeBtn(T.gray, { opacity: currentPage === totalPages ? 0.45 : 1, padding: "8px 14px", fontSize: "13px" })}
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Formulario ── */}
        <div style={{ background: T.surface, borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: T.text }}>
              {editingId ? "✏️ Editar Pedido" : "➕ Crear Nuevo Pedido"}
            </h2>
            {editingId && (
              <button type="button" onClick={resetForm} style={makeBtn(T.gray, { fontSize: "13px" })}>
                ❌ Cancelar
              </button>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "18px" }}>
            <div>
              <label htmlFor="id_usuario" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                ID Usuario *
              </label>
              <input
                id="id_usuario"
                name="id_usuario"
                type="number"
                value={form.id_usuario}
                onChange={handleChange}
                placeholder="Ej: 1001"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="estado" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handleChange}
                disabled={loading}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="En Proceso">🔄 En Proceso</option>
                <option value="Completado">✅ Completado</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>
            </div>

            <div>
              <label htmlFor="total" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                Total *
              </label>
              <input
                id="total"
                name="total"
                type="number"
                step="0.01"
                min="0"
                value={form.total}
                onChange={handleChange}
                placeholder="0.00"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div>
              <label htmlFor="fecha_entrega" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#cbd5e1" }}>
                Fecha de Entrega
              </label>
              <input
                id="fecha_entrega"
                name="fecha_entrega"
                type="date"
                value={form.fecha_entrega}
                onChange={handleChange}
                disabled={loading}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={makeBtn(loading ? T.gray : (editingId ? T.blue : T.green), { width: "100%", padding: "14px", fontSize: "15px" })}
          >
            {loading ? "⏳ Procesando..." : editingId ? "💾 Actualizar Pedido" : "✅ Crear Pedido"}
          </button>
        </div>

      </div>

      {/* ── Modal eliminar ── */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: T.surface, borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>⚠️</div>
            <h3 style={{ margin: "0 0 10px", color: T.text, fontSize: "20px" }}>¿Confirmar eliminación?</h3>
            <p style={{ color: T.muted, marginBottom: "24px", fontSize: "14px" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={closeDelete} style={makeBtn(T.gray, { flex: 1 })}>
                Cancelar
              </button>
              <button type="button" onClick={handleDelete} disabled={loading} style={makeBtn(T.red, { flex: 1 })}>
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}