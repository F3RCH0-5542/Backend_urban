import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ventas.css";

// ─── Config ──────────────────────────────────────────────────────────────────

const API = "http://localhost:3001/api";
const TOAST_DURATION = 3000;
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const ESTADO_PEDIDO = {
  pendiente:  { color: "#fbbf24", bg: "rgba(251,191,36,.15)",  label: "Pendiente",  icon: "⏳" },
  pagado:     { color: "#60a5fa", bg: "rgba(96,165,250,.15)",  label: "Pagado",     icon: "💳" },
  enviado:    { color: "#a78bfa", bg: "rgba(167,139,250,.15)", label: "Enviado",    icon: "🚚" },
  entregado:  { color: "#34d399", bg: "rgba(52,211,153,.15)",  label: "Entregado",  icon: "✅" },
  cancelado:  { color: "#f87171", bg: "rgba(248,113,113,.15)", label: "Cancelado",  icon: "❌" },
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─── Helpers de datos ─────────────────────────────────────────────────────────

function calcularIngresosPorMes(ventas) {
  const acc = {};
  ventas.forEach((v) => {
    const fecha = new Date(v.createdAt || v.fecha);
    const key = MESES[fecha.getMonth()];
    acc[key] = (acc[key] || 0) + Number(v.total || 0);
  });
  return Object.entries(acc).map(([label, value]) => ({ label, value }));
}

function calcularProductosMasVendidos(detalles) {
  const acc = {};
  detalles.forEach((d) => {
    const nombre = d.Producto?.nombre || `Prod #${d.id_producto}`;
    if (!acc[nombre]) acc[nombre] = { nombre, cantidad: 0 };
    acc[nombre].cantidad += Number(d.cantidad || 1);
  });
  return Object.values(acc).sort((a, b) => b.cantidad - a.cantidad);
}

function filtrarPedidos(pedidos, filtroEstado, busqueda) {
  return pedidos.filter((p) => {
    const matchEstado = filtroEstado ? p.estado === filtroEstado : true;
    const matchBusq = busqueda
      ? (p.Usuario?.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.id_pedido).includes(busqueda)
      : true;
    return matchEstado && matchBusq;
  });
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`v-toast v-toast--${toast.type}`} role="status" aria-live="polite">
      <span>{toast.type === "error" ? "❌" : "✅"}</span>
      <span>{toast.msg}</span>
    </div>
  );
}

function KpiCard({ icono, titulo, valor, subtitulo, color }) {
  return (
    <div className="v-kpi" style={{ "--kpi-accent": color }}>
      <div className="v-kpi__icon" aria-hidden="true">{icono}</div>
      <div className="v-kpi__body">
        <p className="v-kpi__label">{titulo}</p>
        <p className="v-kpi__value">{valor}</p>
        {subtitulo && <p className="v-kpi__sub">{subtitulo}</p>}
      </div>
    </div>
  );
}

function BarChart({ data, height = 140 }) {
  if (!data || data.length === 0) {
    return <p className="v-chart__empty">Sin datos por mes</p>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="v-chart" style={{ height }} aria-label="Ingresos por mes">
      {data.map((d, i) => (
        <div key={d.label} className="v-chart__col" style={{ animationDelay: `${i * 60}ms` }}>
          <span className="v-chart__val">
            {d.value >= 1000 ? `${(d.value / 1000).toFixed(0)}k` : d.value}
          </span>
          <div
            className="v-chart__bar"
            style={{ height: `${(d.value / max) * (height - 36)}px` }}
            title={`${d.label}: $${d.value.toLocaleString()}`}
          />
          <span className="v-chart__lbl">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function BadgeEstado({ estado }) {
  const cfg = ESTADO_PEDIDO[estado] || { color: "#94a3b8", bg: "rgba(148,163,184,.15)", label: estado, icon: "•" };
  return (
    <span
      className="v-badge-estado"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

function FilaPedido({ pedido, onVerDetalle, onCambiarEstado }) {
  const fecha = new Date(pedido.createdAt || pedido.fecha);
  const fechaStr = Number.isNaN(fecha.getTime())
    ? "—"
    : fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <tr className="v-tr">
      <td><span className="v-id">#{pedido.id_pedido}</span></td>
      <td>{pedido.Usuario?.nombre || `Cliente #${pedido.id_usuario}`}</td>
      <td>{fechaStr}</td>
      <td>
        <strong className="v-total">
          ${Number(pedido.total || 0).toLocaleString("es-CO")}
        </strong>
      </td>
      <td><BadgeEstado estado={pedido.estado} /></td>
      <td>
        <div className="v-acciones">
          <button
            type="button"
            className="v-btn-ver"
            onClick={() => onVerDetalle(pedido)}
            aria-label={`Ver detalles del pedido ${pedido.id_pedido}`}
          >
            👁 Ver
          </button>
          <select
            className="v-select-estado"
            value={pedido.estado}
            onChange={(e) => onCambiarEstado(pedido.id_pedido, e.target.value)}
            aria-label={`Cambiar estado del pedido ${pedido.id_pedido}`}
          >
            {Object.entries(ESTADO_PEDIDO).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
}

function ModalDetalle({ pedido, detalles, onCerrar }) {
  if (!pedido) return null;

  const detallesPedido = detalles.filter(
    (d) => d.id_pedido === pedido.id_pedido
  );

  return (
    <div
      className="v-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detalle-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className="v-modal">
        <div className="v-modal__header">
          <h2 id="modal-detalle-title" className="v-modal__title">
            Pedido <span className="v-modal__id">#{pedido.id_pedido}</span>
          </h2>
          <button
            type="button"
            className="v-modal__close"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
          >
            ✕
          </button>
        </div>

        <div className="v-modal__meta">
          <div className="v-modal__meta-item">
            <span>Cliente</span>
            <strong>{pedido.Usuario?.nombre || `#${pedido.id_usuario}`}</strong>
          </div>
          <div className="v-modal__meta-item">
            <span>Estado</span>
            <BadgeEstado estado={pedido.estado} />
          </div>
          <div className="v-modal__meta-item">
            <span>Total</span>
            <strong className="v-modal__total">
              ${Number(pedido.total || 0).toLocaleString("es-CO")}
            </strong>
          </div>
        </div>

        {detallesPedido.length > 0 ? (
          <table className="v-modal__table">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Precio unit.</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detallesPedido.map((d) => (
                <tr key={d.id_detalle}>
                  <td>{d.Producto?.nombre || `Prod #${d.id_producto}`}</td>
                  <td>{d.cantidad}</td>
                  <td>${Number(d.precio_unitario || 0).toLocaleString("es-CO")}</td>
                  <td>
                    <strong>
                      ${(Number(d.cantidad) * Number(d.precio_unitario || 0)).toLocaleString("es-CO")}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="v-modal__empty">Sin ítems registrados para este pedido.</p>
        )}
      </div>
    </div>
  );
}

function ProductosTop({ productos }) {
  if (productos.length === 0) {
    return <p className="v-empty-msg">Sin datos de productos.</p>;
  }
  const max = productos[0]?.cantidad || 1;

  return (
    <ul className="v-top-list" aria-label="Productos más vendidos">
      {productos.slice(0, 5).map((p, i) => (
        <li key={p.nombre} className="v-top-item" style={{ animationDelay: `${i * 80}ms` }}>
          <span className="v-top-rank">#{i + 1}</span>
          <div className="v-top-info">
            <span className="v-top-nombre">{p.nombre}</span>
            <div className="v-top-bar-wrap">
              <div
                className="v-top-bar"
                style={{ width: `${(p.cantidad / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="v-top-qty">{p.cantidad} uds.</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Ventas() {
  const [pedidos, setPedidos]           = useState([]);
  const [ventas, setVentas]             = useState([]);
  const [detalles, setDetalles]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [tab, setTab]                   = useState("resumen");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda]         = useState("");
  const [detallePedido, setDetallePedido] = useState(null);
  const [toast, setToast]               = useState(null);

  // ── Toast ────────────────────────────────────────────────────────────────────

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), TOAST_DURATION);
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rPedidos, rVentas, rDetalles] = await Promise.all([
        fetch(`${API}/pedidos`,        { headers: getHeaders() }),
        fetch(`${API}/ventas`,         { headers: getHeaders() }),
        fetch(`${API}/detalle-pedidos`,{ headers: getHeaders() }),
      ]);

      const [dPedidos, dVentas, dDetalles] = await Promise.all([
        rPedidos.json(),
        rVentas.json(),
        rDetalles.json(),
      ]);

      setPedidos( Array.isArray(dPedidos)  ? dPedidos  : (dPedidos.pedidos   || []));
      setVentas(  Array.isArray(dVentas)   ? dVentas   : (dVentas.ventas     || []));
      setDetalles(Array.isArray(dDetalles) ? dDetalles : (dDetalles.detalles || []));
    } catch {
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Acciones ─────────────────────────────────────────────────────────────────

  const actualizarEstadoPedido = useCallback(async (id, estado) => {
    try {
      const r = await fetch(`${API}/pedidos/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ estado }),
      });
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.msg || "Error al actualizar");
      }
      showToast("Estado actualizado correctamente");
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error inesperado", "error");
    }
  }, [showToast, fetchAll]);

  // ── Datos derivados ───────────────────────────────────────────────────────────

  const totalIngresos        = ventas.reduce((s, v) => s + Number(v.total || 0), 0);
  const ingresosPorMes       = calcularIngresosPorMes(ventas);
  const productosMasVendidos = calcularProductosMasVendidos(detalles);
  const pedidosFiltrados     = filtrarPedidos(pedidos, filtroEstado, busqueda);

  const conteoEstados = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  // ── Render ────────────────────────────────────────────────────────────────────

  const navigate = useNavigate();

  return (
    <div className="v-page">
      <div className="v-main">
        {/* HEADER */}
        <header className="v-header">
          <div>
            <h1 className="v-title">💰 Ventas y Pedidos</h1>
            <p className="v-subtitle">Panel de control de ventas</p>
          </div>
          <div className="v-header-actions">
            <button
              type="button"
              className="v-btn-admin"
              onClick={() => navigate("/Admin")}
              aria-label="Ir al Panel Admin"
            >
              🛡️ Panel Admin
            </button>
            <button
              type="button"
              className="v-btn-refresh"
              onClick={fetchAll}
              disabled={loading}
              aria-label="Actualizar datos"
            >
              {loading ? "⟳ Cargando…" : "⟳ Actualizar"}
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section className="v-kpis" aria-label="Indicadores principales">
          <KpiCard
            icono="💵"
            titulo="Ingresos totales"
            valor={`$${totalIngresos.toLocaleString("es-CO")}`}
            subtitulo={`${ventas.length} ventas`}
            color="#34d399"
          />
          <KpiCard
            icono="📦"
            titulo="Total pedidos"
            valor={pedidos.length}
            subtitulo={`${conteoEstados.pendiente || 0} pendientes`}
            color="#60a5fa"
          />
          <KpiCard
            icono="✅"
            titulo="Entregados"
            valor={conteoEstados.entregado || 0}
            subtitulo="Completados"
            color="#34d399"
          />
          <KpiCard
            icono="❌"
            titulo="Cancelados"
            valor={conteoEstados.cancelado || 0}
            subtitulo="Este período"
            color="#f87171"
          />
        </section>

        {/* TABS */}
        <div className="v-tabs" role="tablist" aria-label="Secciones de ventas">
          {[
            { key: "resumen",  label: "📊 Resumen"  },
            { key: "pedidos",  label: "📦 Pedidos"  },
            { key: "productos",label: "🏆 Productos" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`v-tab${tab === key ? " v-tab--active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TAB: RESUMEN */}
        {tab === "resumen" && (
          <section className="v-section" aria-label="Resumen de ingresos">
            <div className="v-card">
              <h2 className="v-card__title">Ingresos por mes</h2>
              {loading
                ? <div className="v-loading"><div className="v-spinner" /></div>
                : <BarChart data={ingresosPorMes} height={160} />
              }
            </div>

            <div className="v-card">
              <h2 className="v-card__title">Estado de pedidos</h2>
              <ul className="v-estado-list" aria-label="Conteo por estado">
                {Object.entries(ESTADO_PEDIDO).map(([key, { icon, label, color, bg }]) => (
                  <li key={key} className="v-estado-item" style={{ "--est-color": color, "--est-bg": bg }}>
                    <span className="v-estado-icon" aria-hidden="true">{icon}</span>
                    <span className="v-estado-label">{label}</span>
                    <span className="v-estado-count">{conteoEstados[key] || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* TAB: PEDIDOS */}
        {tab === "pedidos" && (
          <section aria-label="Lista de pedidos">
            <div className="v-toolbar">
              <div className="v-search">
                <span aria-hidden="true">🔍</span>
                <input
                  type="search"
                  placeholder="Buscar por cliente o ID…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar pedidos"
                />
              </div>
              <select
                className="v-filter-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar por estado"
              >
                <option value="">Todos los estados</option>
                {Object.entries(ESTADO_PEDIDO).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <span className="v-count-badge">
                {pedidosFiltrados.length} pedido{pedidosFiltrados.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="v-card v-card--table">
              {loading ? (
                <div className="v-loading"><div className="v-spinner" /></div>
              ) : (
                <div className="v-table-wrap">
                  <table className="v-table">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Total</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosFiltrados.length > 0
                        ? pedidosFiltrados.map((p, i) => (
                            <FilaPedido
                              key={p.id_pedido}
                              pedido={p}
                              indice={i}
                              onVerDetalle={setDetallePedido}
                              onCambiarEstado={actualizarEstadoPedido}
                            />
                          ))
                        : (
                          <tr>
                            <td colSpan={6} className="v-empty-td">
                              {busqueda || filtroEstado
                                ? "Sin resultados para los filtros aplicados"
                                : "No hay pedidos registrados"}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* TAB: PRODUCTOS */}
        {tab === "productos" && (
          <section aria-label="Productos más vendidos">
            <div className="v-card">
              <h2 className="v-card__title">🏆 Top 5 productos más vendidos</h2>
              {loading
                ? <div className="v-loading"><div className="v-spinner" /></div>
                : <ProductosTop productos={productosMasVendidos} />
              }
            </div>
          </section>
        )}
      </div>

      {/* MODAL DETALLE */}
      <ModalDetalle
        pedido={detallePedido}
        detalles={detalles}
        onCerrar={() => setDetallePedido(null)}
      />

      {/* TOAST */}
      <Toast toast={toast} />
    </div>
  );
}