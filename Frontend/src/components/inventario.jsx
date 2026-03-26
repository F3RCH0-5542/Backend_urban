import React, { useEffect, useState, useCallback } from "react";

const API      = "http://localhost:3001/api";
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const FORM_INIT = { id_producto: "", tipo: "entrada", cantidad: "", stock_minimo: "", motivo: "" };

const TD = { padding: "12px 16px", fontSize: 13, color: "#e2e8f0" };

const TIPO_CLASS = { entrada: "tipo-entrada", salida: "tipo-salida", ajuste: "tipo-ajuste" };
const TIPO_ICON  = { entrada: "📥", salida: "📤", ajuste: "🔧" };

const css = `
  .inv-card{background:#13162b;border:1px solid #1e2340;border-radius:14px;transition:all .25s}
  .inv-card:hover{border-color:#3b82f6;transform:translateY(-2px);box-shadow:0 8px 24px rgba(59,130,246,.12)}
  .inv-input{background:#0c0e1a;border:1px solid #1e2340;border-radius:8px;padding:10px 14px;color:#e2e8f0;width:100%;outline:none;font-size:14px;box-sizing:border-box}
  .inv-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
  .inv-btn{background:linear-gradient(135deg,#3b82f6,#6366f1);border:none;border-radius:10px;color:#fff;padding:10px 20px;font-weight:700;cursor:pointer;transition:opacity .2s;white-space:nowrap}
  .inv-btn:hover{opacity:.85} .inv-btn:disabled{opacity:.5;cursor:not-allowed}
  .inv-btn-back{background:rgba(71,85,105,.4);border:1px solid #334155;border-radius:10px;color:#94a3b8;padding:10px 18px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
  .inv-btn-back:hover{background:rgba(71,85,105,.7);color:#e2e8f0}
  .inv-btn-danger{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);border-radius:8px;color:#f87171;padding:6px 12px;cursor:pointer;font-size:13px;transition:all .2s}
  .inv-btn-danger:hover{background:rgba(239,68,68,.25)}
  .inv-tab{padding:10px 20px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:600;border-bottom:2px solid transparent;color:#64748b;transition:all .2s}
  .inv-tab.active{color:#3b82f6;border-bottom-color:#3b82f6}
  .toast{position:fixed;bottom:28px;right:28px;padding:14px 22px;border-radius:12px;font-weight:600;font-size:14px;z-index:9999;animation:slideIn .3s ease;max-width:360px}
  .toast.success{background:#065f46;border:1px solid #059669;color:#6ee7b7}
  .toast.error{background:#7f1d1d;border:1px solid #dc2626;color:#fca5a5}
  .toast.warning{background:#78350f;border:1px solid #d97706;color:#fde68a}
  @keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .tipo-entrada{background:rgba(16,185,129,.15);color:#10b981}
  .tipo-salida{background:rgba(239,68,68,.15);color:#ef4444}
  .tipo-ajuste{background:rgba(251,191,36,.15);color:#f59e0b}
  tr:hover td{background:rgba(59,130,246,.04)}
  .inv-label{font-size:12px;color:#94a3b8;margin-bottom:6px;display:block;font-weight:600}
  .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
`;

/* ─── componente ─────────────────────────────────────────── */
export default function Inventario() {
  const [productos, setProductos]     = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [stockBajo, setStockBajo]     = useState([]);
  const [tab, setTab]                 = useState("productos");
  const [loading, setLoading]         = useState(false);
  const [showMovForm, setShowMovForm] = useState(false);
  const [busqueda, setBusqueda]       = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [toast, setToast]             = useState(null);
  const [formMov, setFormMov]         = useState(FORM_INIT);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/inventario/productos-lista`, { headers: authHeaders() });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setProductos(Array.isArray(data) ? data : (data.productos ?? []));
    } catch (err) {
      showToast(`Error al cargar productos: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/inventario`, { headers: authHeaders() });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setMovimientos(Array.isArray(data) ? data : (data.movimientos ?? []));
    } catch (err) {
      showToast(`Error al cargar movimientos: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchStockBajo = useCallback(async () => {
    try {
      const r = await fetch(`${API}/inventario/stock-bajo`, { headers: authHeaders() });
      if (!r.ok) return;
      const data = await r.json();
      setStockBajo(Array.isArray(data) ? data : (data.productos ?? []));
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    fetchProductos();
    fetchMovimientos();
    fetchStockBajo();
  }, [fetchProductos, fetchMovimientos, fetchStockBajo]);

  const handleMovSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        id_producto: Number(formMov.id_producto),
        tipo:        formMov.tipo,
        cantidad:    Number(formMov.cantidad),
        motivo:      formMov.motivo || undefined,
        ...(formMov.stock_minimo ? { stock_minimo: Number(formMov.stock_minimo) } : {}),
      };
      const r = await fetch(`${API}/inventario/movimiento`, {
        method: "POST", headers: authHeaders(), body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.msg ?? "Error al registrar");
      showToast(`✅ Movimiento registrado. Stock actual: ${data.stock_actual}`);
      if (data.alerta) showToast(data.alerta, "warning");
      setShowMovForm(false);
      setFormMov(FORM_INIT);
      fetchProductos();
      fetchMovimientos();
      fetchStockBajo();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMovimiento = async (id) => {
    if (!window.confirm(`¿Eliminar movimiento #${id}?\n⚠️ El stock NO se revertirá automáticamente.`)) return;
    try {
      const r = await fetch(`${API}/inventario/${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await r.json();
      if (!r.ok) throw new Error(data.msg ?? "Error al eliminar");
      showToast("Movimiento eliminado");
      fetchMovimientos();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const setField = (field) => (e) => setFormMov((f) => ({ ...f, [field]: e.target.value }));

  const abrirMovimiento = (idProducto) => {
    setFormMov((f) => ({ ...f, id_producto: idProducto, tipo: "entrada" }));
    setShowMovForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categorias         = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const totalStock         = productos.reduce((s, p) => s + Number(p.stock_disponible ?? 0), 0);
  const productosFiltrados = productos.filter((p) => {
    const matchQ   = (p.nombre_producto ?? "").toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = filtroCategoria ? p.categoria === filtroCategoria : true;
    return matchQ && matchCat;
  });

  const STATS = [
    { label: "Productos",   value: productos.length,            icon: "🏷️", color: "#3b82f6" },
    { label: "Stock Total", value: totalStock.toLocaleString(), icon: "📦", color: "#10b981" },
    { label: "Movimientos", value: movimientos.length,          icon: "↕️", color: "#6366f1" },
    { label: "Stock Bajo",  value: stockBajo.length,            icon: "⚠️", color: stockBajo.length > 0 ? "#ef4444" : "#64748b" },
  ];

  const TABS = [
    { id: "productos",   label: "🏷️ Productos" },
    { id: "movimientos", label: "↕ Movimientos" },
    { id: "stock-bajo",  label: "⚠️ Stock Bajo" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0c0e1a", color: "#e2e8f0", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{css}</style>
      {toast && <div className={`toast ${toast.type}`} role="alert">{toast.msg}</div>}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(135deg,#3b82f6,#6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              📦 Inventario
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: 14 }}>Gestión de productos y movimientos de stock</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="inv-btn-back" onClick={() => { window.location.href = "http://localhost:5173/admin"; }}>
              ← Admin
            </button>
            <button type="button" className="inv-btn" onClick={() => setShowMovForm((v) => !v)}>
              {showMovForm ? "✕ Cancelar" : "↕ Movimiento"}
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 28 }}>
          {STATS.map((s) => (
            <div key={s.label} className="inv-card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Formulario Movimiento ── */}
        {showMovForm && (
          <div className="inv-card" style={{ padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>↕ Registrar Movimiento de Stock</h3>
            <form onSubmit={handleMovSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>

                <div>
                  <label htmlFor="mov-producto" className="inv-label">Producto *</label>
                  <select id="mov-producto" className="inv-input" value={formMov.id_producto} onChange={setField("id_producto")} required>
                    <option value="">Seleccionar...</option>
                    {productos.map((p) => (
                      <option key={p.id_producto} value={p.id_producto}>
                        {p.nombre_producto} (stock: {p.stock_disponible})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="mov-tipo" className="inv-label">Tipo *</label>
                  <select id="mov-tipo" className="inv-input" value={formMov.tipo} onChange={setField("tipo")}>
                    <option value="entrada">📥 Entrada (suma stock)</option>
                    <option value="salida">📤 Salida (resta stock)</option>
                    <option value="ajuste">🔧 Ajuste (sobreescribe stock)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mov-cantidad" className="inv-label">
                    {formMov.tipo === "ajuste" ? "Nuevo stock total *" : "Cantidad *"}
                  </label>
                  <input
                    id="mov-cantidad" className="inv-input" type="number" min="1"
                    placeholder={formMov.tipo === "ajuste" ? "Stock final" : "10"}
                    value={formMov.cantidad} onChange={setField("cantidad")} required
                  />
                </div>

                <div>
                  <label htmlFor="mov-stock-min" className="inv-label">Stock mínimo (opcional)</label>
                  <input id="mov-stock-min" className="inv-input" type="number" min="0" placeholder="5" value={formMov.stock_minimo} onChange={setField("stock_minimo")} />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="mov-motivo" className="inv-label">Motivo (opcional)</label>
                  <input id="mov-motivo" className="inv-input" placeholder="Ej: Reposición proveedor..." value={formMov.motivo} onChange={setField("motivo")} />
                </div>
              </div>

              <button type="submit" className="inv-btn" style={{ marginTop: 16, width: "100%", padding: 12 }} disabled={loading}>
                {loading ? "Registrando..." : "Registrar Movimiento"}
              </button>
            </form>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: "flex", borderBottom: "1px solid #1e2340", marginBottom: 24, gap: 4, flexWrap: "wrap" }}>
          {TABS.map(({ id, label }) => (
            <button key={id} type="button" className={`inv-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              {label}
              {id === "stock-bajo" && stockBajo.length > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", padding: "1px 6px", fontSize: 10, marginLeft: 4 }}>
                  {stockBajo.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Productos ── */}
        {tab === "productos" && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <label htmlFor="busqueda-producto" className="sr-only">Buscar productos</label>
              <input id="busqueda-producto" className="inv-input" style={{ maxWidth: 280 }} placeholder="🔍 Buscar productos..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

              <label htmlFor="filtro-categoria" className="sr-only">Filtrar por categoría</label>
              <select id="filtro-categoria" className="inv-input" style={{ maxWidth: 180 }} value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                <option value="">Todas las categorías</option>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Cargando productos...</div>
            ) : productosFiltrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
                <div style={{ fontSize: 48 }}>📦</div>
                <p>No hay productos disponibles.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
                {productosFiltrados.map((p) => {
                  const ok = Number(p.stock_disponible) > 0;
                  return (
                    <div key={p.id_producto} className="inv-card" style={{ padding: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "rgba(99,102,241,.15)", color: "#a5b4fc" }}>
                          {p.categoria ?? "Sin categoría"}
                        </span>
                        <span style={{ fontSize: 11, color: ok ? "#10b981" : "#ef4444", fontWeight: 700, background: ok ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", padding: "2px 8px", borderRadius: 20 }}>
                          {ok ? "✓ En stock" : "⚠ Sin stock"}
                        </span>
                      </div>

                      {p.imagen && (
                        <img src={p.imagen} alt={p.nombre_producto} style={{ width: "100%", height: 100, objectFit: "contain", marginBottom: 10, borderRadius: 8, background: "#0c0e1a" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      )}

                      <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>{p.nombre_producto}</h4>

                      <div style={{ display: "flex", gap: 8, background: "#0c0e1a", borderRadius: 8, padding: "10px 14px", justifyContent: "space-between", marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>Stock disponible</div>
                          <div style={{ fontWeight: 800, fontSize: 20, color: ok ? "#e2e8f0" : "#ef4444" }}>
                            {p.stock_disponible}
                            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>uds</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#64748b" }}>ID</div>
                          <div style={{ fontWeight: 700, color: "#64748b", fontSize: 14 }}>#{p.id_producto}</div>
                        </div>
                      </div>

                      <button type="button" className="inv-btn" style={{ width: "100%", padding: "8px 12px", fontSize: 13 }} onClick={() => abrirMovimiento(p.id_producto)}>
                        ↕ Registrar movimiento
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Tab: Movimientos ── */}
        {tab === "movimientos" && (
          <div className="inv-card" style={{ overflow: "hidden" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Cargando movimientos...</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0c0e1a" }}>
                      {["#", "Producto", "Tipo", "Cantidad", "Stock Resultante", "Motivo", "Fecha", ""].map((h) => (
                        <th key={h} scope="col" style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #1e2340", whiteSpace: "nowrap" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#64748b" }}>No hay movimientos registrados</td>
                      </tr>
                    ) : movimientos.map((m) => (
                      <tr key={m.id_inventario} style={{ borderBottom: "1px solid #1e2340" }}>
                        <td style={TD}>#{m.id_inventario}</td>
                        <td style={{ ...TD, fontWeight: 600 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {m.imagen && <img src={m.imagen} alt="" style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6, background: "#0c0e1a" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />}
                            {m.nombre_producto ?? `Producto #${m.id_producto}`}
                          </div>
                        </td>
                        <td style={TD}>
                          <span className={TIPO_CLASS[m.tipo]} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                            {TIPO_ICON[m.tipo]} {m.tipo}
                          </span>
                        </td>
                        <td style={{ ...TD, fontWeight: 700 }}>{m.cantidad}</td>
                        <td style={{ ...TD, color: "#10b981", fontWeight: 700 }}>{m.stock_resultante ?? "—"}</td>
                        <td style={{ ...TD, color: "#94a3b8", fontSize: 13 }}>{m.motivo ?? "—"}</td>
                        <td style={{ ...TD, color: "#64748b", fontSize: 12, whiteSpace: "nowrap" }}>
                          {m.fecha_movimiento ? new Date(m.fecha_movimiento).toLocaleString("es-CO") : "—"}
                        </td>
                        <td style={TD}>
                          <button
                            type="button"
                            className="inv-btn-danger"
                            onClick={() => handleEliminarMovimiento(m.id_inventario)}
                            title="Eliminar movimiento"
                            aria-label={`Eliminar movimiento #${m.id_inventario}`}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Stock Bajo ── */}
        {tab === "stock-bajo" && (
          stockBajo.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#10b981" }}>
              <div style={{ fontSize: 48 }}>✅</div>
              <p>Todo el stock está en niveles normales</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {stockBajo.map((p) => (
                <div key={p.id_producto} className="inv-card" style={{ padding: 18, borderColor: "rgba(239,68,68,.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>⚠️ Stock Bajo</span>
                    <span style={{ color: "#64748b", fontSize: 12 }}>#{p.id_producto}</span>
                  </div>
                  {p.imagen && (
                    <img src={p.imagen} alt={p.nombre_producto} style={{ width: "100%", height: 80, objectFit: "contain", borderRadius: 8, background: "#0c0e1a", marginBottom: 10 }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  )}
                  <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>{p.nombre_producto}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Stock actual</div>
                      <div style={{ fontWeight: 800, color: "#ef4444", fontSize: 22 }}>{p.stock_actual}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Mínimo</div>
                      <div style={{ fontWeight: 800, color: "#94a3b8", fontSize: 22 }}>{p.stock_minimo}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inv-btn"
                    style={{ width: "100%", padding: 10, fontSize: 13 }}
                    onClick={() => { abrirMovimiento(p.id_producto); setTab("productos"); }}
                  >
                    📥 Registrar Entrada
                  </button>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}