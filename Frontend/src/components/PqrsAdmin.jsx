import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { listPqrs, createPqrs, updatePqrs, deletePqrs } from "../services/PqrsService";

/* ─── constants ──────────────────────────────────────────── */
const TIPO_CONFIG = {
  Queja:      { icon: "🔴", color: "#ef4444", border: "1px solid #ef4444" },
  Reclamo:    { icon: "⚠️", color: "#f59e0b", border: "1px solid #f59e0b" },
  Sugerencia: { icon: "💡", color: "#8b5cf6", border: "1px solid #8b5cf6" },
};

const ESTADO_CONFIG = {
  Pendiente:   { color: "#f59e0b", border: "1px solid #f59e0b" },
  "En Proceso":{ color: "#3b82f6", border: "1px solid #3b82f6" },
  Resuelto:    { color: "#10b981", border: "1px solid #10b981" },
  Cerrado:     { color: "#64748b", border: "1px solid #64748b" },
};

const FORM_INITIAL = { nombre: "", correo: "", tipo: "", mensaje: "", estado: "Pendiente", respuesta: "" };
const PAGE_SIZE    = 8;

/* ─── tokens ─────────────────────────────────────────────── */
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
  green:   "#10b981",
};

/* ─── styles ─────────────────────────────────────────────── */
const s = {
  page: { backgroundColor: T.bg, minHeight: "100vh", color: T.text, fontFamily: "'Inter', sans-serif", boxSizing: "border-box" },

  /* topbar */
  topBar: {
    backgroundColor: T.surface,
    borderBottom: `1px solid ${T.border}`,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  topBarLeft:  { display: "flex", alignItems: "center", gap: "12px" },
  topBarTitle: { fontSize: "14px", fontWeight: "700", color: T.bright, letterSpacing: "0.04em" },
  btnBack: {
    backgroundColor: "transparent",
    border: `1px solid ${T.border}`,
    color: T.subtle,
    borderRadius: "6px",
    padding: "7px 14px",
    fontSize: "12px",
    cursor: "pointer",
  },
  btnPrimary: {
    backgroundColor: T.amber,
    color: T.bg,
    border: "none",
    borderRadius: "6px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnDanger: {
    backgroundColor: "transparent",
    border: `1px solid ${T.red}`,
    color: T.red,
    borderRadius: "6px",
    padding: "7px 14px",
    fontSize: "12px",
    cursor: "pointer",
  },

  /* body */
  body: { padding: "20px 16px", maxWidth: "1200px", margin: "0 auto" },

  /* stats */
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" },
  statCard: (color) => ({
    backgroundColor: T.surface,
    border: `1px solid ${T.border}`,
    borderLeft: `3px solid ${color}`,
    borderRadius: "10px",
    padding: "16px",
  }),
  statNum:   (color) => ({ fontSize: "26px", fontWeight: "800", color, lineHeight: 1, marginBottom: "4px" }),
  statLabel: { fontSize: "11px", color: T.subtle, fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase" },

  /* filters */
  filtersRow: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  filterInput: {
    flex: "1 1 160px",
    backgroundColor: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: "6px",
    padding: "9px 12px",
    fontSize: "13px",
    color: T.bright,
    outline: "none",
    minWidth: 0,
  },

  /* table */
  tableWrap: { overflowX: "auto", width: "100%" },
  table:     { width: "100%", borderCollapse: "collapse", minWidth: "700px" },
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
    padding: "15px 14px",
    fontSize: "13px",
    color: T.text,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
  },
  tdMuted: {
    padding: "15px 14px",
    fontSize: "12px",
    color: T.subtle,
    borderBottom: "1px solid #1a2030",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },

  /* row action btns */
  actionBtn: (color) => ({
    backgroundColor: "transparent",
    border: `1px solid ${color}`,
    color,
    borderRadius: "4px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),
  actionGroup: { display: "flex", gap: "6px", flexWrap: "wrap" },

  /* mobile card */
  card: { backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "16px", marginBottom: "12px" },
  cardTopRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "8px", flexWrap: "wrap" },
  cardLabel: { fontSize: "10px", fontWeight: "600", letterSpacing: "0.08em", color: T.subtle, textTransform: "uppercase", marginBottom: "3px" },
  cardValue: { fontSize: "13px", color: T.text },
  cardMsgWrap: { marginBottom: "10px" },
  cardMsg: { fontSize: "12px", color: T.subtle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" },
  cardActions: { display: "flex", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${T.border}` },
  cardActionBtn: (color) => ({
    flex: 1,
    backgroundColor: "transparent",
    border: `1px solid ${color}`,
    color,
    borderRadius: "6px",
    padding: "7px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "center",
  }),

  /* alert */
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

  /* empty */
  emptyState: { textAlign: "center", padding: "60px 0", color: T.muted, fontSize: "13px" },

  /* modal */
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
    padding: "16px", boxSizing: "border-box",
  },
  modal: { backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: "10px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeader: { padding: "16px 20px", borderBottom: `1px solid ${T.border}`, fontSize: "14px", fontWeight: "600", color: T.bright, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
  modalBody:   { padding: "20px", overflowY: "auto", flex: 1 },
  modalFooter: { padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", gap: "10px", flexWrap: "wrap", flexShrink: 0 },
  label: { display: "block", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", color: T.subtle, textTransform: "uppercase", marginBottom: "6px" },
  input: { width: "100%", backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: T.bright, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "10px 12px", fontSize: "13px", color: T.bright, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: "90px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" },
  formFull:  { gridColumn: "1 / -1" },
  btnCancel: { backgroundColor: "transparent", border: "1px solid #334155", color: "#94a3b8", borderRadius: "6px", padding: "9px 18px", fontSize: "13px", cursor: "pointer" },
  btnConfirm: { backgroundColor: T.amber, border: "none", color: T.bg, borderRadius: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
  btnConfirmDanger: { backgroundColor: T.red, border: "none", color: "#fff", borderRadius: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: "700", cursor: "pointer" },

  /* detail view */
  detailGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" },
  detailBox:   { backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 14px" },
  detailLabel: { fontSize: "10px", fontWeight: "600", letterSpacing: "0.08em", color: T.subtle, textTransform: "uppercase", marginBottom: "6px" },
  detailValue: { fontSize: "13px", color: T.bright },
  detailMsg:   { backgroundColor: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: T.text, lineHeight: "1.6" },
  detailResp:  { backgroundColor: "#0f2d1f", border: "1px solid #14532d", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#86efac", lineHeight: "1.6" },

  /* pagination */
  pagination: { display: "flex", gap: "6px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" },
  pageBtn: (active) => ({
    width: "34px", height: "34px", borderRadius: "6px",
    border: active ? "none" : `1px solid ${T.border}`,
    backgroundColor: active ? T.amber : "transparent",
    color: active ? T.bg : T.subtle,
    fontSize: "13px", fontWeight: active ? "700" : "400",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }),
};

/* ─── hooks ──────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

/* ─── small components ───────────────────────────────────── */
function TipoBadge({ tipo }) {
  const cfg = TIPO_CONFIG[tipo] ?? { icon: "📝", color: "#94a3b8", border: "1px solid #94a3b8" };
  return (
    <span style={{ color: cfg.color, border: cfg.border, borderRadius: "4px", padding: "3px 8px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
      {cfg.icon} {tipo ?? "—"}
    </span>
  );
}

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] ?? { color: "#94a3b8", border: "1px solid #94a3b8" };
  return (
    <span style={{ color: cfg.color, border: cfg.border, borderRadius: "4px", padding: "3px 8px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", display: "inline-block", whiteSpace: "nowrap" }}>
      {estado ?? "—"}
    </span>
  );
}

function Alert({ type, message, onClose }) {
  return (
    <div style={s.alertBox(type)}>
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold", flexShrink: 0 }}>✕</button>
      )}
    </div>
  );
}

/* ─── modals ─────────────────────────────────────────────── */
function FormModal({ show, mode, form, loading, onChange, onSubmit, onClose }) {
  if (!show) return null;
  const isEdit = mode === "edit";
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <span>{isEdit ? "Editar PQRS" : "Nueva PQRS"}</span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: T.subtle, cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <div style={s.modalBody}>
          <div style={s.formGrid}>
            <div>
              <label htmlFor="nombre" style={s.label}>Nombre *</label>
              <input id="nombre" type="text" name="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre completo" style={s.input} />
            </div>
            <div>
              <label htmlFor="correo" style={s.label}>Correo *</label>
              <input id="correo" type="email" name="correo" value={form.correo} onChange={onChange} placeholder="correo@ejemplo.com" style={s.input} />
            </div>
            <div>
              <label htmlFor="tipo" style={s.label}>Tipo *</label>
              <select id="tipo" name="tipo" value={form.tipo} onChange={onChange} style={s.input}>
                <option value="">Seleccionar</option>
                <option value="Queja">🔴 Queja</option>
                <option value="Reclamo">⚠️ Reclamo</option>
                <option value="Sugerencia">💡 Sugerencia</option>
              </select>
            </div>
            <div>
              <label htmlFor="estado" style={s.label}>Estado *</label>
              <select id="estado" name="estado" value={form.estado} onChange={onChange} style={s.input}>
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="En Proceso">🔄 En Proceso</option>
                <option value="Resuelto">✅ Resuelto</option>
                <option value="Cerrado">🔒 Cerrado</option>
              </select>
            </div>
            <div style={s.formFull}>
              <label htmlFor="mensaje" style={s.label}>Mensaje *</label>
              <textarea id="mensaje" name="mensaje" value={form.mensaje} onChange={onChange} placeholder="Descripción del PQRS..." style={s.textarea} />
            </div>
            <div style={s.formFull}>
              <label htmlFor="respuesta" style={s.label}>Respuesta (opcional)</label>
              <textarea id="respuesta" name="respuesta" value={form.respuesta} onChange={onChange} placeholder="Respuesta del administrador..." style={s.textarea} />
            </div>
          </div>
        </div>
        <div style={s.modalFooter}>
          <button type="button" onClick={onClose} style={s.btnCancel}>Cancelar</button>
          <button type="button" onClick={onSubmit} disabled={loading} style={{ ...s.btnConfirm, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Procesando..." : isEdit ? "Actualizar" : "Crear"}
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
      <div style={{ ...s.modal, maxWidth: "400px" }}>
        <div style={{ ...s.modalHeader, color: T.red }}>Eliminar PQRS</div>
        <div style={{ ...s.modalBody, color: "#94a3b8", fontSize: "13px" }}>
          ¿Estás seguro de que deseas eliminar esta PQRS? Esta acción no se puede deshacer.
        </div>
        <div style={s.modalFooter}>
          <button type="button" onClick={onCancel} style={s.btnCancel}>Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={loading} style={{ ...s.btnConfirmDanger, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ pqrs, onClose, onEdit }) {
  if (!pqrs) return null;
  const fecha = pqrs.fecha_solicitud ? new Date(pqrs.fecha_solicitud).toLocaleString("es-CO") : "—";
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <span>Detalles PQRS #{pqrs.id_pqrs}</span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: T.subtle, cursor: "pointer", fontSize: "16px" }}>✕</button>
        </div>
        <div style={s.modalBody}>
          <div style={s.detailGrid}>
            <div style={s.detailBox}>
              <div style={s.detailLabel}>Nombre</div>
              <div style={s.detailValue}>{pqrs.nombre}</div>
            </div>
            <div style={s.detailBox}>
              <div style={s.detailLabel}>Correo</div>
              <div style={s.detailValue}>{pqrs.correo}</div>
            </div>
            <div style={s.detailBox}>
              <div style={s.detailLabel}>Fecha</div>
              <div style={s.detailValue}>{fecha}</div>
            </div>
            <div style={s.detailBox}>
              <div style={s.detailLabel}>Tipo</div>
              <TipoBadge tipo={pqrs.tipo} />
            </div>
            <div style={{ ...s.detailBox, gridColumn: "1 / -1" }}>
              <div style={s.detailLabel}>Estado</div>
              <EstadoBadge estado={pqrs.estado} />
            </div>
          </div>
          <div style={{ marginTop: "14px" }}>
            <div style={{ ...s.detailLabel, marginBottom: "8px" }}>Mensaje</div>
            <div style={s.detailMsg}>{pqrs.descripcion}</div>
          </div>
          {pqrs.respuesta && (
            <div style={{ marginTop: "14px" }}>
              <div style={{ ...s.detailLabel, color: T.green, marginBottom: "8px" }}>Respuesta del administrador</div>
              <div style={s.detailResp}>{pqrs.respuesta}</div>
            </div>
          )}
        </div>
        <div style={s.modalFooter}>
          <button type="button" onClick={onClose} style={s.btnCancel}>Cerrar</button>
          <button type="button" onClick={() => { onClose(); onEdit(pqrs); }} style={s.btnConfirm}>Editar</button>
        </div>
      </div>
    </div>
  );
}

/* ─── table / card list ───────────────────────────────────── */
function MobileCards({ paginated, onView, onEdit, onDelete }) {
  return (
    <div>
      {paginated.map((p) => (
        <div key={p.id_pqrs} style={s.card}>
          <div style={s.cardTopRow}>
            <div>
              <div style={s.cardLabel}>Nombre</div>
              <div style={{ ...s.cardValue, fontWeight: "600" }}>{p.nombre}</div>
            </div>
            <TipoBadge tipo={p.tipo} />
          </div>
          <div style={{ display: "flex", gap: "16px", marginBottom: "8px", flexWrap: "wrap" }}>
            <div>
              <div style={s.cardLabel}>Estado</div>
              <EstadoBadge estado={p.estado} />
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <div style={s.cardLabel}>Correo</div>
              <div style={{ ...s.cardValue, fontSize: "12px", color: T.subtle, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.correo}</div>
            </div>
          </div>
          <div style={s.cardMsgWrap}>
            <div style={s.cardLabel}>Mensaje</div>
            <div style={s.cardMsg}>{p.descripcion}</div>
          </div>
          <div style={s.cardActions}>
            <button type="button" onClick={() => onView(p)} style={s.cardActionBtn(T.blue)}>Ver</button>
            <button type="button" onClick={() => onEdit(p)} style={s.cardActionBtn(T.amber)}>Editar</button>
            <button type="button" onClick={() => onDelete(p.id_pqrs)} style={s.cardActionBtn(T.red)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopTable({ paginated, onView, onEdit, onDelete }) {
  return (
    <div style={s.tableWrap}>
      <table style={s.table}>
        <thead>
          <tr>
            {["FECHA", "NOMBRE", "CORREO", "TIPO", "ESTADO", "MENSAJE", "ACCIONES"].map((h) => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <tr key={p.id_pqrs}>
              <td style={s.tdMuted}>{p.fecha_solicitud ? new Date(p.fecha_solicitud).toLocaleDateString("es-CO") : "—"}</td>
              <td style={{ ...s.td, fontWeight: "600" }}>{p.nombre}</td>
              <td style={{ ...s.td, color: T.subtle, fontSize: "12px" }}>{p.correo}</td>
              <td style={s.td}><TipoBadge tipo={p.tipo} /></td>
              <td style={s.td}><EstadoBadge estado={p.estado} /></td>
              <td style={{ ...s.td, maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: T.subtle, fontSize: "12px" }}>
                {p.descripcion}
              </td>
              <td style={s.td}>
                <div style={s.actionGroup}>
                  <button type="button" onClick={() => onView(p)} style={s.actionBtn(T.blue)}>Ver</button>
                  <button type="button" onClick={() => onEdit(p)} style={s.actionBtn(T.amber)}>Editar</button>
                  <button type="button" onClick={() => onDelete(p.id_pqrs)} style={s.actionBtn(T.red)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PqrsList({ filtered, onView, onEdit, onDelete }) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (filtered.length === 0) return <div style={s.emptyState}>No hay PQRS que coincidan con los filtros</div>;

  return (
    <>
      {isMobile
        ? <MobileCards paginated={paginated} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        : <DesktopTable paginated={paginated} onView={onView} onEdit={onEdit} onDelete={onDelete} />
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
export default function PqrsAdmin() {
  const navigate = useNavigate();

  const [pqrsList, setPqrsList]               = useState([]);
  const [form, setForm]                       = useState(FORM_INITIAL);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
  const [modalMode, setModalMode]             = useState("create");
  const [editingId, setEditingId]             = useState(null);
  const [showFormModal, setShowFormModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal]     = useState(false);
  const [deletingId, setDeletingId]           = useState(null);
  const [selectedPqrs, setSelectedPqrs]       = useState(null);
  const [searchTerm, setSearchTerm]           = useState("");
  const [filterTipo, setFilterTipo]           = useState("");
  const [filterEstado, setFilterEstado]       = useState("");

  const fetchPqrs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPqrs();
      setPqrsList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.msg ?? "Error al cargar PQRS");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPqrs(); }, [fetchPqrs]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(FORM_INITIAL);
    setEditingId(null);
    setShowFormModal(false);
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.correo.trim() || !form.tipo || !form.mensaje.trim()) {
      setError("Nombre, correo, tipo y mensaje son obligatorios");
      return;
    }
    const payload = {
      nombre:     form.nombre.trim(),
      correo:     form.correo.trim(),
      tipo_pqrs:  form.tipo,
      descripcion: form.mensaje.trim(),
      estado:     form.estado,
      respuesta:  form.respuesta.trim(),
    };
    try {
      setLoading(true);
      setError(null);
      if (modalMode === "edit") {
        await updatePqrs(editingId, payload);
      } else {
        await createPqrs(payload);
      }
      await fetchPqrs();
      resetForm();
    } catch (err) {
      setError(err.msg ?? "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => { setModalMode("create"); setForm(FORM_INITIAL); setEditingId(null); setShowFormModal(true); };

  const openEdit = (pqrs) => {
    setModalMode("edit");
    setEditingId(pqrs.id_pqrs);
    setForm({ nombre: pqrs.nombre ?? "", correo: pqrs.correo ?? "", tipo: pqrs.tipo ?? "", mensaje: pqrs.descripcion ?? "", estado: pqrs.estado ?? "Pendiente", respuesta: pqrs.respuesta ?? "" });
    setShowFormModal(true);
  };

  const openView   = (pqrs) => { setSelectedPqrs(pqrs); setShowViewModal(true); };
  const closeView  = () => { setShowViewModal(false); setSelectedPqrs(null); };

  const openDelete  = (id) => { setDeletingId(id); setShowDeleteModal(true); };
  const closeDelete = () => { setShowDeleteModal(false); setDeletingId(null); };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      await deletePqrs(deletingId);
      await fetchPqrs();
    } catch (err) {
      setError(err.msg ?? "Error al eliminar PQRS");
    } finally {
      setLoading(false);
      closeDelete();
    }
  };

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };

  const filtered = pqrsList.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || p.nombre?.toLowerCase().includes(q) || p.correo?.toLowerCase().includes(q);
    const matchTipo   = !filterTipo   || p.tipo   === filterTipo;
    const matchEstado = !filterEstado || p.estado === filterEstado;
    return matchSearch && matchTipo && matchEstado;
  });

  const stats = {
    total:      pqrsList.length,
    pendientes: pqrsList.filter((p) => p.estado === "Pendiente").length,
    proceso:    pqrsList.filter((p) => p.estado === "En Proceso").length,
    resueltos:  pqrsList.filter((p) => p.estado === "Resuelto").length,
  };

  return (
    <div style={s.page}>
      {/* topbar */}
      <div style={s.topBar}>
        <div style={s.topBarLeft}>
          <button type="button" onClick={() => navigate("/Admin")} style={s.btnBack}>← Volver</button>
          <span style={s.topBarTitle}>Gestión de PQRS</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={openCreate} style={s.btnPrimary}>+ Nueva PQRS</button>
          <button type="button" onClick={handleLogout} style={s.btnDanger}>Salir</button>
        </div>
      </div>

      <div style={s.body}>
        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

        {/* stats */}
        <div style={s.statsGrid}>
          {[
            { label: "Total",      value: stats.total,      color: T.blue  },
            { label: "Pendientes", value: stats.pendientes, color: T.amber },
            { label: "En Proceso", value: stats.proceso,    color: T.blue  },
            { label: "Resueltos",  value: stats.resueltos,  color: T.green },
          ].map((st) => (
            <div key={st.label} style={s.statCard(st.color)}>
              <div style={s.statNum(st.color)}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* filters */}
        <div style={s.filtersRow}>
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={s.filterInput}
          />
          <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} style={s.filterInput}>
            <option value="">📋 Todos los tipos</option>
            <option value="Queja">🔴 Queja</option>
            <option value="Reclamo">⚠️ Reclamo</option>
            <option value="Sugerencia">💡 Sugerencia</option>
          </select>
          <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} style={s.filterInput}>
            <option value="">📊 Todos los estados</option>
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="En Proceso">🔄 En Proceso</option>
            <option value="Resuelto">✅ Resuelto</option>
            <option value="Cerrado">🔒 Cerrado</option>
          </select>
        </div>

        {/* list */}
        {loading && !showFormModal && !showDeleteModal ? (
          <div style={s.emptyState}>Cargando PQRS...</div>
        ) : (
          <PqrsList filtered={filtered} onView={openView} onEdit={openEdit} onDelete={openDelete} />
        )}
      </div>

      <FormModal show={showFormModal} mode={modalMode} form={form} loading={loading}
        onChange={handleChange} onSubmit={handleSubmit} onClose={resetForm} />
      <DeleteModal show={showDeleteModal} loading={loading} onConfirm={handleDelete} onCancel={closeDelete} />
      {showViewModal && <ViewModal pqrs={selectedPqrs} onClose={closeView} onEdit={openEdit} />}
    </div>
  );
}