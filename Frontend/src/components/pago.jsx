import React, { useEffect, useState, useCallback } from "react";
import { listPagos, createPago, updatePago, deletePago } from "../services/pagoService";

/* ─── constants ──────────────────────────────────────────── */
const METODO_CONFIG = {
  Efectivo:      { label: "Efectivo",      color: "#10b981", border: "1px solid #10b981", icon: "💵" },
  Tarjeta:       { label: "Tarjeta",       color: "#3b82f6", border: "1px solid #3b82f6", icon: "💳" },
  Transferencia: { label: "Transferencia", color: "#8b5cf6", border: "1px solid #8b5cf6", icon: "🏦" },
};

const FORM_INITIAL = { id_pedido: "", metodo_pago: "Efectivo", monto: "" };
const HEADERS      = ["ID", "PEDIDO", "MÉTODO", "MONTO", "FECHA", "ACCIONES"];
const PAGE_SIZE    = 8;

const formatCOP = (val) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(val);

/* ─── design tokens ──────────────────────────────────────── */
const T = {
  bg:      "#0f1117",
  surface: "#151c2c",
  border:  "#1e2d45",
  muted:   "#475569",
  subtle:  "#64748b",
  text:    "#cbd5e1",
  bright:  "#e2e8f0",
  amber:   "#f59e0b",
  red:     "#ef4444",
  blue:    "#3b82f6",
};

/* ─── styles ─────────────────────────────────────────────── */
const s = {
  page: {
    backgroundColor: T.bg,
    minHeight: "100vh",
    color: T.text,
    fontFamily: "'Inter', sans-serif",
    padding: "24px 16px",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: {
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    color: T.subtle,
    textTransform: "uppercase",
  },
  btnPrimary: {
    backgroundColor: T.amber,
    color: T.bg,
    border: "none",
    borderRadius: "6px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnBack: {
    backgroundColor: "transparent",
    border: `1px solid #1e2d45`,
    color: "#64748b",
    borderRadius: "6px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  alertBox: (type) => ({
    backgroundColor: type === "danger" ? "#2d1515" : "#0f2d1f",
    border: `1px solid ${type === "danger" ? "#7f1d1d" : "#14532d"}`,
    color: type === "danger" ? "#fca5a5" : "#86efac",
    borderRadius: "6px",
    padding: "12px 16px",
    marginBottom: "16px",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  }),
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    color: T.muted,
    fontSize: "13px",
  },

  /* ── table ── */
  tableWrap: { overflowX: "auto", width: "100%" },
  table:     { width: "100%", borderCollapse: "collapse", minWidth: "580px" },
  th: {
    padding: "10px 14px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    color: T.muted,
    textAlign: "left",
    borderBottom: `1px solid ${T.border}`,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 14px",
    fontSize: "13px",
    color: T.text,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
  },
  tdMuted: {
    padding: "16px 14px",
    fontSize: "13px",
    color: T.subtle,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
  },
  pedidoBadge: {
    backgroundColor: "#1e3a5f",
    color: T.blue,
    borderRadius: "4px",
    padding: "3px 9px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  montoText: {
    color: T.amber,
    fontWeight: "700",
    fontSize: "13px",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.02em",
  },
  btnEdit: {
    backgroundColor: "transparent",
    color: T.blue,
    border: `1px solid ${T.blue}`,
    borderRadius: "4px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "6px",
    display: "block",
    width: "76px",
    textAlign: "center",
  },
  btnDeleteRow: {
    backgroundColor: "transparent",
    color: T.red,
    border: `1px solid ${T.red}`,
    borderRadius: "4px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    width: "76px",
    textAlign: "center",
  },

  /* ── mobile card ── */
  card: {
    backgroundColor: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "8px",
    flexWrap: "wrap",
  },
  cardLabel: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: T.subtle,
    textTransform: "uppercase",
    marginBottom: "3px",
  },
  cardValue: { fontSize: "13px", color: T.text },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: `1px solid ${T.border}`,
  },
  btnEditInline: {
    flex: 1,
    backgroundColor: "transparent",
    color: T.blue,
    border: `1px solid ${T.blue}`,
    borderRadius: "6px",
    padding: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
  },
  btnDeleteInline: {
    flex: 1,
    backgroundColor: "transparent",
    color: T.red,
    border: `1px solid ${T.red}`,
    borderRadius: "6px",
    padding: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
  },

  /* ── modal ── */
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    boxSizing: "border-box",
  },
  modal: {
    backgroundColor: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "10px",
    width: "100%",
    maxWidth: "420px",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "16px 20px",
    borderBottom: `1px solid ${T.border}`,
    fontSize: "14px",
    fontWeight: "600",
    color: T.bright,
  },
  modalBody:   { padding: "20px" },
  modalFooter: {
    padding: "14px 20px",
    borderTop: `1px solid ${T.border}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: T.subtle,
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    backgroundColor: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "13px",
    color: T.bright,
    outline: "none",
    boxSizing: "border-box",
  },
  btnCancel: {
    backgroundColor: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: "6px",
    padding: "9px 18px",
    fontSize: "13px",
    cursor: "pointer",
  },
  btnConfirm: {
    backgroundColor: T.amber,
    border: "none",
    color: T.bg,
    borderRadius: "6px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  btnConfirmDanger: {
    backgroundColor: T.red,
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  /* ── pagination ── */
  pagination: {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
    marginTop: "28px",
    flexWrap: "wrap",
  },
  pageBtn: (active) => ({
    width: "34px",
    height: "34px",
    borderRadius: "6px",
    border: active ? "none" : `1px solid ${T.border}`,
    backgroundColor: active ? T.amber : "transparent",
    color: active ? T.bg : T.subtle,
    fontSize: "13px",
    fontWeight: active ? "700" : "400",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
};

/* ─── hook ───────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

/* ─── sub-components ─────────────────────────────────────── */
function MetodoBadge({ metodo }) {
  const cfg = METODO_CONFIG[metodo] ?? { label: metodo ?? "—", color: "#94a3b8", border: "1px solid #94a3b8", icon: "💰" };
  return (
    <span style={{
      color: cfg.color,
      border: cfg.border,
      borderRadius: "4px",
      padding: "3px 9px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      whiteSpace: "nowrap",
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function Alert({ type, message, onClose }) {
  return (
    <div style={s.alertBox(type)}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose}
          style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold", flexShrink: 0 }}>
          ✕
        </button>
      )}
    </div>
  );
}

function FormModal({ show, editingId, form, loading, onChange, onSubmit, onClose }) {
  if (!show) return null;
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>{editingId ? "Editar Pago" : "Nuevo Pago"}</div>
        <div style={s.modalBody}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="id_pedido" style={s.label}>ID Pedido *</label>
            <input id="id_pedido" type="number" name="id_pedido" value={form.id_pedido}
              onChange={onChange} disabled={!!editingId} placeholder="Ej: 1"
              style={{ ...s.input, opacity: editingId ? 0.5 : 1 }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="metodo_pago" style={s.label}>Método de Pago *</label>
            <select id="metodo_pago" name="metodo_pago" value={form.metodo_pago} onChange={onChange} style={s.input}>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <label htmlFor="monto" style={s.label}>Monto *</label>
            <input id="monto" type="number" step="0.01" name="monto" value={form.monto}
              onChange={onChange} placeholder="Ej: 50000" style={s.input} />
          </div>
        </div>
        <div style={s.modalFooter}>
          <button type="button" onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button type="button" onClick={onSubmit} disabled={loading}
            style={{ ...s.btnConfirm, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Procesando..." : editingId ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ show, loading, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={{ ...s.modalHeader, color: T.red }}>Eliminar Pago</div>
        <div style={{ ...s.modalBody, color: "#94a3b8", fontSize: "13px" }}>
          ¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.
        </div>
        <div style={s.modalFooter}>
          <button type="button" onClick={onCancel} style={s.btnCancel}>Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={loading}
            style={{ ...s.btnConfirmDanger, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CardList({ paginated, editingId, onEdit, onDelete }) {
  return (
    <div>
      {paginated.map((pago) => {
        const dis = !!editingId;
        return (
          <div key={pago.id_pago} style={s.card}>
            <div style={s.cardTopRow}>
              <div>
                <div style={s.cardLabel}>ID</div>
                <div style={{ ...s.cardValue, color: T.subtle }}>#{pago.id_pago}</div>
              </div>
              <div>
                <div style={s.cardLabel}>Pedido</div>
                <span style={s.pedidoBadge}>#{pago.id_pedido}</span>
              </div>
              <div>
                <div style={s.cardLabel}>Método</div>
                <MetodoBadge metodo={pago.metodo_pago} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div style={s.cardLabel}>Monto</div>
                <div style={s.montoText}>{formatCOP(pago.monto)}</div>
              </div>
              <div>
                <div style={s.cardLabel}>Fecha</div>
                <div style={{ ...s.cardValue, color: T.muted }}>{pago.fecha_pago ?? "—"}</div>
              </div>
            </div>
            <div style={s.cardActions}>
              <button type="button" onClick={() => onEdit(pago)} disabled={dis}
                style={{ ...s.btnEditInline, opacity: dis ? 0.4 : 1 }}>Editar</button>
              <button type="button" onClick={() => onDelete(pago.id_pago)} disabled={dis}
                style={{ ...s.btnDeleteInline, opacity: dis ? 0.4 : 1 }}>Eliminar</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DesktopTable({ paginated, editingId, onEdit, onDelete }) {
  return (
    <div style={s.tableWrap}>
      <table style={s.table}>
        <thead>
          <tr>{HEADERS.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {paginated.map((pago) => {
            const dis = editingId ? { opacity: 0.4 } : {};
            return (
              <tr key={pago.id_pago}>
                <td style={s.tdMuted}>#{pago.id_pago}</td>
                <td style={s.td}><span style={s.pedidoBadge}>#{pago.id_pedido}</span></td>
                <td style={s.td}><MetodoBadge metodo={pago.metodo_pago} /></td>
                <td style={s.td}><span style={s.montoText}>{formatCOP(pago.monto)}</span></td>
                <td style={{ ...s.td, color: T.muted }}>{pago.fecha_pago ?? "—"}</td>
                <td style={s.td}>
                  <button type="button" onClick={() => onEdit(pago)} disabled={!!editingId} style={{ ...s.btnEdit, ...dis }}>Editar</button>
                  <button type="button" onClick={() => onDelete(pago.id_pago)} disabled={!!editingId} style={{ ...s.btnDeleteRow, ...dis }}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PagosTable({ pagos, editingId, onEdit, onDelete }) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(pagos.length / PAGE_SIZE));
  const paginated  = pagos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (pagos.length === 0) {
    return <div style={s.emptyState}>No hay pagos registrados</div>;
  }

  return (
    <>
      {isMobile
        ? <CardList paginated={paginated} editingId={editingId} onEdit={onEdit} onDelete={onDelete} />
        : <DesktopTable paginated={paginated} editingId={editingId} onEdit={onEdit} onDelete={onDelete} />
      }
      {totalPages > 1 && (
        <div style={s.pagination}>
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} style={s.pageBtn(false)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => setPage(n)} style={s.pageBtn(page === n)}>{n}</button>
          ))}
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={s.pageBtn(false)}>›</button>
        </div>
      )}
    </>
  );
}

/* ─── main component ─────────────────────────────────────── */
export default function Pago() {
  const [pagos, setPagos]                     = useState([]);
  const [form, setForm]                       = useState(FORM_INITIAL);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [success, setSuccess]                 = useState(null);
  const [editingId, setEditingId]             = useState(null);
  const [showFormModal, setShowFormModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId]           = useState(null);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const fetchPagos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPagos();
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg ?? "Error al obtener pagos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPagos();
  }, [isAuthenticated, fetchPagos]);

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const resetForm = () => {
    setForm(FORM_INITIAL);
    setEditingId(null);
    setShowFormModal(false);
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.id_pedido || !form.metodo_pago || !form.monto) {
      setError("Todos los campos son obligatorios");
      return;
    }
    const pagoData = {
      id_pedido:   Number.parseInt(form.id_pedido, 10),
      metodo_pago: form.metodo_pago,
      monto:       Number.parseFloat(form.monto),
      fecha_pago:  new Date().toISOString().split("T")[0],
    };
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        await updatePago(editingId, pagoData);
        showSuccessMessage("¡Pago actualizado exitosamente!");
      } else {
        await createPago(pagoData);
        showSuccessMessage("¡Pago creado exitosamente!");
      }
      await fetchPagos();
      resetForm();
    } catch (err) {
      setError(err.msg ?? "Error al gestionar pago");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pago) => {
    setEditingId(pago.id_pago);
    setForm({ id_pedido: String(pago.id_pedido), metodo_pago: pago.metodo_pago, monto: String(pago.monto) });
    setShowFormModal(true);
  };

  const openDeleteModal = (id) => { setDeletingId(id); setShowDeleteModal(true); };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deletePago(deletingId);
      showSuccessMessage("¡Pago eliminado exitosamente!");
      await fetchPagos();
    } catch (err) {
      setError(err.msg ?? "Error al eliminar pago");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: "#1a1200", border: "1px solid #854d0e", color: "#fbbf24", borderRadius: "8px", padding: "20px 28px", fontSize: "13px" }}>
          ⚠️ Debes iniciar sesión para ver los pagos
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <span style={s.title}>Pagos</span>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => window.location.href = "/Admin"}
            style={s.btnBack}
          >
            ← Admin
          </button>
          <button
            type="button"
            onClick={() => setShowFormModal(true)}
            disabled={!!editingId}
            style={{ ...s.btnPrimary, opacity: editingId ? 0.5 : 1 }}
          >
            + Nuevo Pago
          </button>
        </div>
      </div>

      {error   && <Alert type="danger"  message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {loading && !showFormModal && !showDeleteModal ? (
        <div style={s.emptyState}>Cargando pagos...</div>
      ) : (
        <PagosTable pagos={pagos} editingId={editingId} onEdit={handleEdit} onDelete={openDeleteModal} />
      )}

      <FormModal show={showFormModal} editingId={editingId} form={form} loading={loading}
        onChange={handleChange} onSubmit={handleSubmit} onClose={resetForm} />
      <DeleteModal show={showDeleteModal} loading={loading} onConfirm={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setDeletingId(null); }} />
    </div>
  );
}