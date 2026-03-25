import { useState, useEffect, useCallback, useRef } from "react";
import api from "./services/api";

/* ─── Paleta (igual que el resto del proyecto) ───────────────────────────── */
const C = {
  bg:     "#000000",
  card:   "#111111",
  card2:  "#1a1a1a",
  border: "#242424",
  border2:"#2a2a2a",
  purple: "#8B5CF6",
  red:    "#EF4444",
  green:  "#10B981",
  white:  "#ffffff",
  dim:    "rgba(255,255,255,0.5)",
  dim2:   "rgba(255,255,255,0.25)",
  dim3:   "rgba(255,255,255,0.08)",
};

const PAGE_SIZES = [5, 10, 20, 50];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmt$ = (v) =>
  "$" + Number(v ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg, tipo, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position:     "fixed",
      bottom:       28,
      right:        28,
      zIndex:       9999,
      background:   tipo === "error" ? C.red : C.green,
      color:        "#fff",
      borderRadius: 10,
      padding:      "12px 20px",
      fontSize:     14,
      fontWeight:   600,
      boxShadow:    "0 8px 24px rgba(0,0,0,0.5)",
      display:      "flex",
      alignItems:   "center",
      gap:          10,
      animation:    "slideUp .25s ease",
      maxWidth:     340,
    }}>
      <span>{tipo === "error" ? "✕" : "✓"}</span>
      {msg}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────── */
function Modal({ title, icon, onClose, children, footer }) {
  // cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         1000,
        background:     "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        20,
      }}
    >
      <div style={{
        background:   C.card2,
        borderRadius: 16,
        border:       `1px solid ${C.border2}`,
        width:        "100%",
        maxWidth:     520,
        maxHeight:    "90vh",
        overflowY:    "auto",
        animation:    "fadeIn .2s ease",
        boxShadow:    "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ color:C.white, fontSize:18, fontWeight:700 }}>{title}</span>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", fontSize:20, lineHeight:1, padding:4 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 24px" }}>{children}</div>

        {/* Footer */}
        {footer && <div style={{ padding:"0 24px 22px", display:"flex", gap:12 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ─── Campo de formulario ────────────────────────────────────────────────── */
function Campo({ label, value, onChange, type = "text", rows, required, placeholder }) {
  const [focused, setFocused] = useState(false);
  const isArea = rows > 1;
  const Tag    = isArea ? "textarea" : "input";

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display:"block", color:C.dim, fontSize:12, fontWeight:600, marginBottom:5, letterSpacing:0.4 }}>
        {label} {required && <span style={{ color:C.red }}>*</span>}
      </label>
      <Tag
        type={isArea ? undefined : type}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:        "100%",
          background:   "#0a0a0a",
          border:       `1px solid ${focused ? C.purple : C.border2}`,
          borderRadius: 10,
          color:        C.white,
          fontSize:     14,
          padding:      "10px 14px",
          outline:      "none",
          resize:       isArea ? "vertical" : undefined,
          fontFamily:   "inherit",
          boxSizing:    "border-box",
          transition:   "border-color .2s",
          minHeight:    isArea ? 80 : undefined,
        }}
      />
    </div>
  );
}

/* ─── Chip de categoría ──────────────────────────────────────────────────── */
function CatChip({ label, count, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          6,
        padding:      "5px 12px",
        borderRadius: 20,
        border:       `1px solid ${selected ? C.purple : C.border2}`,
        background:   selected ? `${C.purple}20` : C.card2,
        color:        selected ? C.purple : C.dim2,
        cursor:       "pointer",
        fontSize:     12,
        fontWeight:   selected ? 700 : 400,
        whiteSpace:   "nowrap",
        transition:   "all .15s",
        flexShrink:   0,
      }}
    >
      {label}
      <span style={{
        background:   selected ? `${C.purple}40` : C.dim3,
        color:        selected ? C.purple : C.dim2,
        borderRadius: 10,
        padding:      "1px 6px",
        fontSize:     10,
        fontWeight:   700,
      }}>
        {count}
      </span>
    </button>
  );
}

/* ─── Tarjeta de producto ────────────────────────────────────────────────── */
function ProductCard({ p, onEdit, onDelete }) {
  const stock    = p.stock_disponible ?? 0;
  const precio   = parseFloat(p.precio_base ?? 0);
  const stockBajo = stock <= 5;
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   C.card2,
        borderRadius: 12,
        border:       `1px solid ${stockBajo ? `${C.red}55` : hov ? `${C.purple}55` : C.border2}`,
        padding:      14,
        display:      "flex",
        alignItems:   "center",
        gap:          12,
        transition:   "border-color .2s, box-shadow .2s",
        boxShadow:    hov ? `0 4px 20px rgba(139,92,246,0.12)` : "none",
        marginBottom: 10,
      }}
    >
      {/* Ícono */}
      <div style={{
        width:        48,
        height:       48,
        borderRadius: 12,
        background:   `${C.purple}18`,
        border:       `1px solid ${C.purple}30`,
        display:      "flex",
        alignItems:   "center",
        justifyContent:"center",
        fontSize:     22,
        flexShrink:   0,
      }}>
        🛍️
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Fila 1: ID + nombre */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <span style={{ background:`${C.purple}18`, color:C.purple, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:5 }}>
            #{p.id_producto}
          </span>
          <span style={{ color:C.white, fontWeight:600, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {p.nombre_producto ?? "—"}
          </span>
        </div>

        {/* Descripción */}
        {p.descripcion && (
          <div style={{ color:C.dim2, fontSize:11, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {p.descripcion}
          </div>
        )}

        {/* Chips */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {p.categoria && (
            <span style={{ background:C.dim3, color:C.dim, fontSize:10, padding:"2px 7px", borderRadius:5 }}>
              {p.categoria}
            </span>
          )}
          <span style={{
            background: stockBajo ? `${C.red}18`   : `${C.green}18`,
            color:      stockBajo ? C.red           : C.green,
            fontSize:   10,
            fontWeight: 700,
            padding:    "2px 7px",
            borderRadius: 5,
          }}>
            Stock: {stock}{stockBajo ? " ⚠️" : ""}
          </span>
        </div>
      </div>

      {/* Precio + acciones */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
        <span style={{ color:C.purple, fontSize:16, fontWeight:700 }}>{fmt$(precio)}</span>
        <div style={{ display:"flex", gap:6 }}>
          <IconBtn icon="✏️" color="rgba(255,255,255,0.55)" title="Editar"     onClick={() => onEdit(p)} />
          <IconBtn icon="🗑️" color={C.red}                  title="Desactivar" onClick={() => onDelete(p)} />
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon, color, title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:        32,
        height:       32,
        borderRadius: 8,
        border:       `1px solid ${hov ? color : color + "44"}`,
        background:   hov ? color + "22" : color + "11",
        color,
        cursor:       "pointer",
        fontSize:     14,
        display:      "flex",
        alignItems:   "center",
        justifyContent:"center",
        transition:   "all .15s",
      }}
    >
      {icon}
    </button>
  );
}

/* ─── Paginación ─────────────────────────────────────────────────────────── */
function Paginacion({ page, total, pageSize, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      justifyContent:"space-between",
      padding:      "12px 16px",
      borderTop:    `1px solid ${C.border}`,
      background:   "#0a0a0a",
      borderRadius: "0 0 12px 12px",
      flexWrap:     "wrap",
      gap:          8,
    }}>
      {/* Selector de tamaño */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ color:C.dim2, fontSize:12 }}>Mostrar</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          style={{
            background:   C.card2,
            border:       `1px solid ${C.border2}`,
            borderRadius: 8,
            color:        C.white,
            padding:      "4px 10px",
            fontSize:     12,
            cursor:       "pointer",
          }}
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / pág</option>)}
        </select>
      </div>

      {/* Página actual */}
      <span style={{ color:C.dim2, fontSize:12 }}>
        Pág. <strong style={{ color:C.white }}>{page + 1}</strong> / {totalPages}
        <span style={{ marginLeft:8, color:C.dim2 }}>({total} total)</span>
      </span>

      {/* Botones prev / next */}
      <div style={{ display:"flex", gap:6 }}>
        <PagBtn label="‹ Ant" enabled={page > 0}              onClick={() => onPage(page - 1)} />
        <PagBtn label="Sig ›" enabled={page < totalPages - 1} onClick={() => onPage(page + 1)} />
      </div>
    </div>
  );
}

function PagBtn({ label, enabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={enabled ? onClick : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={!enabled}
      style={{
        background:   enabled && hov ? `${C.purple}22` : C.card2,
        border:       `1px solid ${enabled ? (hov ? C.purple : C.border2) : "transparent"}`,
        borderRadius: 8,
        color:        enabled ? (hov ? C.purple : C.dim) : C.dim3,
        padding:      "5px 14px",
        cursor:       enabled ? "pointer" : "default",
        fontSize:     12,
        fontWeight:   600,
        transition:   "all .15s",
      }}
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════════ */
export default function ProductosAdmin() {
  const [productos,  setProductos]  = useState([]);
  const [filtrados,  setFiltrados]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [busqueda,   setBusqueda]   = useState("");
  const [catFiltro,  setCatFiltro]  = useState("todas");
  const [page,       setPage]       = useState(0);
  const [pageSize,   setPageSize]   = useState(10);
  const [toast,      setToast]      = useState(null);
  const [modal,      setModal]      = useState(null); // null | "crear" | "editar" | "confirmar"
  const [productoSel,setProductoSel]= useState(null);
  const [guardando,  setGuardando]  = useState(false);

  // Form state
  const emptyForm = { nombre_producto:"", descripcion:"", precio_base:"", stock_disponible:"0", categoria:"" };
  const [form, setForm] = useState(emptyForm);

  /* ── API helpers ─────────────────────────────────────────────────────── */
  const snack = useCallback((msg, tipo = "ok") => setToast({ msg, tipo }), []);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res  = await api.get("/productos");
      const data = res.data?.data ?? res.data ?? [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      snack(err.response?.data?.message ?? "Error al cargar productos", "error");
    } finally {
      setCargando(false);
    }
  }, [snack]);

  useEffect(() => { cargar(); }, [cargar]);

  /* ── Filtro ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const q = busqueda.toLowerCase();
    setFiltrados(
      productos.filter(p => {
        const okQ = !q ||
          (p.nombre_producto ?? "").toLowerCase().includes(q) ||
          (p.descripcion     ?? "").toLowerCase().includes(q) ||
          String(p.id_producto).includes(q);
        const okCat = catFiltro === "todas" || p.categoria === catFiltro;
        return okQ && okCat;
      })
    );
    setPage(0);
  }, [busqueda, catFiltro, productos]);

  /* ── Paginados ───────────────────────────────────────────────────────── */
  const paginados = filtrados.slice(page * pageSize, (page + 1) * pageSize);

  /* ── Categorías ──────────────────────────────────────────────────────── */
  const categorias = [
    "todas",
    ...Array.from(
      new Set(productos.map(p => p.categoria).filter(Boolean))
    ).sort(),
  ];

  const countCat = (cat) =>
    cat === "todas"
      ? productos.length
      : productos.filter(p => p.categoria === cat).length;

  /* ── Crear / Editar ──────────────────────────────────────────────────── */
  const abrirCrear = () => {
    setForm(emptyForm);
    setProductoSel(null);
    setModal("form");
  };

  const abrirEditar = (p) => {
    setForm({
      nombre_producto:  p.nombre_producto   ?? "",
      descripcion:      p.descripcion       ?? "",
      precio_base:      String(p.precio_base ?? ""),
      stock_disponible: String(p.stock_disponible ?? 0),
      categoria:        p.categoria         ?? "",
    });
    setProductoSel(p);
    setModal("form");
  };

  const validar = () => {
    if (!form.nombre_producto.trim()) { snack("El nombre es obligatorio", "error"); return false; }
    if (!form.precio_base.trim() || Number(form.precio_base) <= 0) { snack("Precio inválido", "error"); return false; }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    const body = {
      nombre_producto:  form.nombre_producto.trim(),
      descripcion:      form.descripcion.trim() || null,
      precio_base:      parseFloat(form.precio_base),
      stock_disponible: parseInt(form.stock_disponible) || 0,
      categoria:        form.categoria.trim() || null,
    };
    try {
      if (productoSel) {
        await api.put(`/productos/${productoSel.id_producto}`, body);
        snack("Producto actualizado exitosamente");
      } else {
        await api.post("/productos", body);
        snack("Producto creado exitosamente");
      }
      setModal(null);
      await cargar();
    } catch (err) {
      snack(err.response?.data?.message ?? "Error al guardar", "error");
    } finally {
      setGuardando(false);
    }
  };

  /* ── Eliminar ────────────────────────────────────────────────────────── */
  const abrirEliminar = (p) => { setProductoSel(p); setModal("confirmar"); };

  const confirmarEliminar = async () => {
    if (!productoSel) return;
    setGuardando(true);
    try {
      await api.delete(`/productos/${productoSel.id_producto}`);
      snack("Producto desactivado exitosamente");
      setModal(null);
      await cargar();
    } catch (err) {
      snack(err.response?.data?.message ?? "Error al desactivar", "error");
    } finally {
      setGuardando(false);
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.white, fontFamily:"'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes slideUp  { from { transform:translateY(16px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes fadeIn   { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0a0a; }
        ::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:3px; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.2); }
        select option { background:#1a1a1a; }
      `}</style>

      {/* ── AppBar ───────────────────────────────────────────────────────── */}
      <div style={{ background:"#0a0a0a", borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:60, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <a href="/admin" style={{ color:C.dim2, textDecoration:"none", fontSize:20, lineHeight:1 }}>←</a>
          <span style={{ color:C.white, fontWeight:700, fontSize:17 }}>Productos</span>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <ActionBtn icon="🔄" label="Actualizar" color={C.purple} onClick={cargar} />
          <ActionBtn icon="＋" label="Nuevo producto" color={C.purple} filled onClick={abrirCrear} />
        </div>
      </div>

      {/* ── Contenido ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"24px 20px" }}>

        {/* Buscador */}
        <div style={{ position:"relative", marginBottom:12 }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.dim2, fontSize:16 }}>🔍</span>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, descripción o ID..."
            style={{
              width:        "100%",
              background:   C.card2,
              border:       `1px solid ${C.border2}`,
              borderRadius: 12,
              color:        C.white,
              fontSize:     14,
              padding:      "11px 40px 11px 42px",
              outline:      "none",
            }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.dim2, cursor:"pointer", fontSize:16 }}>✕</button>
          )}
        </div>

        {/* Chips de categoría */}
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:8 }}>
          {categorias.map(cat => (
            <CatChip
              key={cat}
              label={cat === "todas" ? "Todas" : cat}
              count={countCat(cat)}
              selected={catFiltro === cat}
              onClick={() => setCatFiltro(cat)}
            />
          ))}
        </div>

        {/* Contador */}
        <div style={{ color:C.dim2, fontSize:12, marginBottom:16 }}>
          {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
          {busqueda || catFiltro !== "todas" ? " encontrados" : " en total"}
        </div>

        {/* Lista */}
        <div style={{ background:C.card, borderRadius:12, border:`1px solid ${C.border}`, overflow:"hidden" }}>
          {cargando ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:14 }}>
              <div style={{ width:40, height:40, border:`3px solid ${C.purple}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
              <span style={{ color:C.dim2 }}>Cargando productos...</span>
              <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
            </div>
          ) : paginados.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:240, gap:16 }}>
              <span style={{ fontSize:56, opacity:0.3 }}>📦</span>
              <span style={{ color:C.dim2, fontSize:15 }}>Sin productos</span>
              <button onClick={abrirCrear} style={{ background:C.purple, border:"none", borderRadius:8, color:C.white, padding:"10px 20px", cursor:"pointer", fontWeight:600, fontSize:13 }}>
                ＋ Crear producto
              </button>
            </div>
          ) : (
            <div style={{ padding:"12px 12px 0" }}>
              {paginados.map(p => (
                <ProductCard key={p.id_producto} p={p} onEdit={abrirEditar} onDelete={abrirEliminar} />
              ))}
            </div>
          )}

          {/* Paginación */}
          {!cargando && filtrados.length > 0 && (
            <Paginacion
              page={page}
              total={filtrados.length}
              pageSize={pageSize}
              onPage={setPage}
              onPageSize={(s) => { setPageSize(s); setPage(0); }}
            />
          )}
        </div>
      </div>

      {/* ── Modal Crear / Editar ──────────────────────────────────────────── */}
      {modal === "form" && (
        <Modal
          title={productoSel ? "Editar producto" : "Nuevo producto"}
          icon={productoSel ? "✏️" : "➕"}
          onClose={() => setModal(null)}
          footer={
            <>
              <button onClick={() => setModal(null)} style={{ flex:1, background:"none", border:`1px solid ${C.border2}`, borderRadius:10, color:C.dim, padding:"12px 0", cursor:"pointer", fontSize:14 }}>
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                style={{ flex:1, background:guardando ? `${C.purple}80` : C.purple, border:"none", borderRadius:10, color:C.white, padding:"12px 0", cursor:guardando?"not-allowed":"pointer", fontWeight:700, fontSize:14 }}
              >
                {guardando ? "Guardando…" : productoSel ? "Guardar cambios" : "Crear producto"}
              </button>
            </>
          }
        >
          <Campo label="Nombre del producto" required value={form.nombre_producto} onChange={v => setForm(f=>({...f, nombre_producto:v}))} placeholder="Ej: Camiseta Urban Classic" />
          <Campo label="Descripción" value={form.descripcion} onChange={v => setForm(f=>({...f, descripcion:v}))} rows={3} placeholder="Describe el producto..." />
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}>
              <Campo label="Precio base" required type="number" value={form.precio_base} onChange={v => setForm(f=>({...f, precio_base:v}))} placeholder="0" />
            </div>
            <div style={{ flex:1 }}>
              <Campo label="Stock disponible" type="number" value={form.stock_disponible} onChange={v => setForm(f=>({...f, stock_disponible:v}))} placeholder="0" />
            </div>
          </div>
          <Campo label="Categoría" value={form.categoria} onChange={v => setForm(f=>({...f, categoria:v}))} placeholder="Ej: Camisetas, Gorras..." />
        </Modal>
      )}

      {/* ── Modal Confirmar eliminar ──────────────────────────────────────── */}
      {modal === "confirmar" && productoSel && (
        <Modal
          title="Desactivar producto"
          icon="⚠️"
          onClose={() => setModal(null)}
          footer={
            <>
              <button onClick={() => setModal(null)} style={{ flex:1, background:"none", border:`1px solid ${C.border2}`, borderRadius:10, color:C.dim, padding:"12px 0", cursor:"pointer", fontSize:14 }}>
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                disabled={guardando}
                style={{ flex:1, background:guardando ? `${C.red}80` : C.red, border:"none", borderRadius:10, color:C.white, padding:"12px 0", cursor:guardando?"not-allowed":"pointer", fontWeight:700, fontSize:14 }}
              >
                {guardando ? "Desactivando…" : "Sí, desactivar"}
              </button>
            </>
          }
        >
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14, lineHeight:1.6 }}>
            ¿Desactivar el producto <strong style={{ color:C.white }}>"{productoSel.nombre_producto}"</strong>?
            <br />
            <span style={{ color:C.dim2, fontSize:13 }}>No se eliminará de la base de datos, solo quedará inactivo.</span>
          </div>
        </Modal>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
    </div>
  );
}

/* ─── Botón de acción en AppBar ──────────────────────────────────────────── */
function ActionBtn({ icon, label, color, filled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          6,
        padding:      "7px 14px",
        borderRadius: 8,
        border:       `1px solid ${color}`,
        background:   filled ? (hov ? color + "cc" : color) : (hov ? color + "22" : "transparent"),
        color:        filled ? C.white : (hov ? color : C.dim),
        cursor:       "pointer",
        fontSize:     13,
        fontWeight:   600,
        transition:   "all .15s",
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}