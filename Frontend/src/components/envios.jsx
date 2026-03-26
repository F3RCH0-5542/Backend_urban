import React, { useEffect, useState, useCallback } from "react";
import { listEnvios, createEnvio, updateEnvio, deleteEnvio } from "../services/envioService";

const ESTADO_CONFIG = {
  entregado: { label: "Entregado", color: "#10b981", border: "1px solid #10b981" },
  pendiente:  { label: "Pendiente", color: "#f59e0b", border: "1px solid #f59e0b" },
  enviado:    { label: "Enviado",   color: "#3b82f6", border: "1px solid #3b82f6" },
};

const FORM_INITIAL = { id_pedido: "", direccion: "", estado: "pendiente" };
const HEADERS      = ["ID", "PEDIDO", "DIRECCIÓN", "ESTADO", "FECHA", "ACCIONES"];
const PAGE_SIZE    = 8;

/* ─── shared tokens ─────────────────────────────────────── */
const TOKEN = {
  bg:       "#0f1117",
  surface:  "#151c2c",
  border:   "#1e2d45",
  muted:    "#475569",
  subtle:   "#64748b",
  text:     "#cbd5e1",
  bright:   "#e2e8f0",
  amber:    "#f59e0b",
  blue:     "#3b82f6",
  red:      "#ef4444",
  green:    "#10b981",
};

/* ─── static styles ─────────────────────────────────────── */
const s = {
  page: {
    backgroundColor: TOKEN.bg,
    minHeight: "100vh",
    color: TOKEN.text,
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
    color: TOKEN.subtle,
    textTransform: "uppercase",
  },
  btnPrimary: {
    backgroundColor: TOKEN.amber,
    color: TOKEN.bg,
    border: "none",
    borderRadius: "6px",
    padding: "10px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  /* table */
  tableWrap: { overflowX: "auto", width: "100%" },
  table:     { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  th: {
    padding: "10px 14px",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.1em",
    color: TOKEN.muted,
    textAlign: "left",
    borderBottom: `1px solid ${TOKEN.border}`,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 14px",
    fontSize: "13px",
    color: TOKEN.text,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
  },
  tdMuted: {
    padding: "16px 14px",
    fontSize: "13px",
    color: TOKEN.subtle,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
  },
  pedidoBadge: {
    backgroundColor: "#1e3a5f",
    color: TOKEN.blue,
    borderRadius: "4px",
    padding: "3px 9px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  btnEdit: {
    backgroundColor: "transparent",
    color: TOKEN.blue,
    border: `1px solid ${TOKEN.blue}`,
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
    color: TOKEN.red,
    border: `1px solid ${TOKEN.red}`,
    borderRadius: "4px",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    width: "76px",
    textAlign: "center",
  },

  /* mobile card */
  card: {
    backgroundColor: TOKEN.surface,
    border: `1px solid ${TOKEN.border}`,
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "12px",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
    gap: "8px",
  },
  cardLabel: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    color: TOKEN.subtle,
    textTransform: "uppercase",
    marginBottom: "3px",
  },
  cardValue: { fontSize: "13px", color: TOKEN.text },
  cardActions: { display: "flex", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${TOKEN.border}` },
  btnEditInline: {
    flex: 1,
    backgroundColor: "transparent",
    color: TOKEN.blue,
    border: `1px solid ${TOKEN.blue}`,
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
    color: TOKEN.red,
    border: `1px solid ${TOKEN.red}`,
    borderRadius: "6px",
    padding: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
  },

  /* misc */
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
    color: TOKEN.muted,
    fontSize: "13px",
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
  }),

  /* modals */
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
    backgroundColor: TOKEN.surface,
    border: `1px solid ${TOKEN.border}`,
    borderRadius: "10px",
    width: "100%",
    maxWidth: "420px",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "16px 20px",
    borderBottom: `1px solid ${TOKEN.border}`,
    fontSize: "14px",
    fontWeight: "600",
    color: TOKEN.bright,
  },
  modalBody:   { padding: "20px" },
  modalFooter: {
    padding: "14px 20px",
    borderTop: `1px solid ${TOKEN.border}`,
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
    color: TOKEN.subtle,
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    backgroundColor: TOKEN.bg,
    border: `1px solid ${TOKEN.border}`,
    borderRadius: "6px",
    padding: "10px 12px",
    fontSize: "13px",
    color: TOKEN.bright,
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
    backgroundColor: TOKEN.amber,
    border: "none",
    color: TOKEN.bg,
    borderRadius: "6px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
  btnConfirmDanger: {
    backgroundColor: TOKEN.red,
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  /* pagination */
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
    border: active ? "none" : `1px solid ${TOKEN.border}`,
    backgroundColor: active ? TOKEN.amber : "transparent",
    color: active ? TOKEN.bg : TOKEN.subtle,
    fontSize: "13px",
    fontWeight: active ? "700" : "400",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
};

/* ─── helpers ───────────────────────────────────────────── */
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
function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado ?? "Sin estado", color: "#94a3b8", border: "1px solid #94a3b8" };
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
      display: "inline-block",
      whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
}

function Alert({ type, message, onClose }) {
  return (
    <div style={s.alertBox(type)}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold", marginLeft: "12px", flexShrink: 0 }}>✕</button>
      )}
    </div>
  );
}

function FormModal({ show, editingId, form, loading, onChange, onSubmit, onClose }) {
  if (!show) return null;
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>{editingId ? "Editar Envío" : "Nuevo Envío"}</div>
        <div style={s.modalBody}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="id_pedido" style={s.label}>ID Pedido *</label>
            <input id="id_pedido" type="number" name="id_pedido" value={form.id_pedido} onChange={onChange}
              disabled={!!editingId} placeholder="Ej: 1"
              style={{ ...s.input, opacity: editingId ? 0.5 : 1 }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="direccion" style={s.label}>Dirección *</label>
            <input id="direccion" type="text" name="direccion" value={form.direccion} onChange={onChange}
              placeholder="Dirección de entrega" style={s.input} />
          </div>
          <div>
            <label htmlFor="estado" style={s.label}>Estado</label>
            <select id="estado" name="estado" value={form.estado} onChange={onChange} style={s.input}>
              <option value="pendiente">Pendiente</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
            </select>
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
        <div style={{ ...s.modalHeader, color: TOKEN.red }}>Eliminar Envío</div>
        <div style={{ ...s.modalBody, color: "#94a3b8", fontSize: "13px" }}>
          ¿Estás seguro de que deseas eliminar este envío? Esta acción no se puede deshacer.
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

/* mobile card list */
function CardList({ paginated, editingId, onEdit, onDelete }) {
  return (
    <div>
      {paginated.map((ev) => {
        const id  = ev.id ?? ev.id_envio;
        const dis = !!editingId;
        return (
          <div key={id} style={s.card}>
            <div style={s.cardRow}>
              <div>
                <div style={s.cardLabel}>ID</div>
                <div style={{ ...s.cardValue, color: TOKEN.subtle }}>#{id}</div>
              </div>
              <div>
                <div style={s.cardLabel}>Pedido</div>
                <span style={s.pedidoBadge}>#{ev.id_pedido}</span>
              </div>
              <div>
                <div style={s.cardLabel}>Estado</div>
                <EstadoBadge estado={ev.estado} />
              </div>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <div style={s.cardLabel}>Dirección</div>
              <div style={{ ...s.cardValue, wordBreak: "break-word" }}>{ev.direccion}</div>
            </div>
            <div style={{ marginBottom: "4px" }}>
              <div style={s.cardLabel}>Fecha</div>
              <div style={{ ...s.cardValue, color: TOKEN.muted }}>{ev.fechaEnvio ?? ev.fecha_envio ?? "—"}</div>
            </div>
            <div style={s.cardActions}>
              <button type="button" onClick={() => onEdit(ev)} disabled={dis}
                style={{ ...s.btnEditInline, opacity: dis ? 0.4 : 1 }}>
                Editar
              </button>
              <button type="button" onClick={() => onDelete(id)} disabled={dis}
                style={{ ...s.btnDeleteInline, opacity: dis ? 0.4 : 1 }}>
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* desktop table */
function DesktopTable({ paginated, editingId, onEdit, onDelete }) {
  return (
    <div style={s.tableWrap}>
      <table style={s.table}>
        <thead>
          <tr>{HEADERS.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {paginated.map((ev) => {
            const id  = ev.id ?? ev.id_envio;
            const dis = editingId ? { opacity: 0.4 } : {};
            return (
              <tr key={id}>
                <td style={s.tdMuted}>#{id}</td>
                <td style={s.td}><span style={s.pedidoBadge}>#{ev.id_pedido}</span></td>
                <td style={{ ...s.td, maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ev.direccion}
                </td>
                <td style={s.td}><EstadoBadge estado={ev.estado} /></td>
                <td style={{ ...s.td, color: TOKEN.muted }}>{ev.fechaEnvio ?? ev.fecha_envio ?? "—"}</td>
                <td style={s.td}>
                  <button type="button" onClick={() => onEdit(ev)} disabled={!!editingId} style={{ ...s.btnEdit, ...dis }}>Editar</button>
                  <button type="button" onClick={() => onDelete(id)} disabled={!!editingId} style={{ ...s.btnDeleteRow, ...dis }}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EnviosTable({ envios, editingId, onEdit, onDelete }) {
  const isMobile  = useIsMobile();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(envios.length / PAGE_SIZE));
  const paginated  = envios.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (envios.length === 0) {
    return <div style={s.emptyState}>No hay envíos registrados</div>;
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
export default function Envios() {
  const [envios, setEnvios]                   = useState([]);
  const [form, setForm]                       = useState(FORM_INITIAL);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [success, setSuccess]                 = useState(null);
  const [editingId, setEditingId]             = useState(null);
  const [showFormModal, setShowFormModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId]           = useState(null);

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const fetchEnvios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listEnvios();
      setEnvios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg ?? "Error al obtener envíos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchEnvios();
  }, [isAuthenticated, fetchEnvios]);

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
    if (!form.id_pedido || !form.direccion) {
      setError("Pedido y dirección son requeridos");
      return;
    }
    const envioData = {
      id_pedido: Number(form.id_pedido),
      direccion: form.direccion,
      estado: form.estado,
    };
    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        await updateEnvio(editingId, envioData);
        showSuccessMessage("¡Envío actualizado exitosamente!");
      } else {
        await createEnvio(envioData);
        showSuccessMessage("¡Envío creado exitosamente!");
      }
      await fetchEnvios();
      resetForm();
    } catch (err) {
      setError(err.msg ?? "Error al gestionar envío");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (envio) => {
    setEditingId(envio.id ?? envio.id_envio);
    setForm({ id_pedido: String(envio.id_pedido), direccion: envio.direccion, estado: envio.estado });
    setShowFormModal(true);
  };

  const openDeleteModal = (id) => { setDeletingId(id); setShowDeleteModal(true); };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteEnvio(deletingId);
      showSuccessMessage("¡Envío eliminado exitosamente!");
      await fetchEnvios();
    } catch (err) {
      setError(err.msg ?? "Error al eliminar envío");
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
          ⚠️ Debes iniciar sesión para ver los envíos
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
            + Nuevo Envio
          </button>
        </div>
      </div>
      {error   && <Alert type="danger"  message={error}   onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {loading && !showFormModal && !showDeleteModal ? (
        <div style={s.emptyState}>Cargando envíos...</div>
      ) : (
        <EnviosTable envios={envios} editingId={editingId} onEdit={handleEdit} onDelete={openDeleteModal} />
      )}

      <FormModal show={showFormModal} editingId={editingId} form={form} loading={loading}
        onChange={handleChange} onSubmit={handleSubmit} onClose={resetForm} />
      <DeleteModal show={showDeleteModal} loading={loading} onConfirm={handleDelete}
        onCancel={() => { setShowDeleteModal(false); setDeletingId(null); }} />
    </div>
  );
}