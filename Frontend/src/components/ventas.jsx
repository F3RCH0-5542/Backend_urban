import React, { useEffect, useState, useCallback } from "react";

const API = "http://localhost:3001/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

const ESTADO_PEDIDO = {
  pendiente: { color: "#fbbf24", bg: "rgba(251,191,36,.12)", label: "⏳ Pendiente" },
  pagado: { color: "#60a5fa", bg: "rgba(59,130,246,.12)", label: "💳 Pagado" },
  enviado: { color: "#a78bfa", bg: "rgba(167,139,250,.12)", label: "🚚 Enviado" },
  entregado: { color: "#34d399", bg: "rgba(16,185,129,.12)", label: "✅ Entregado" },
  cancelado: { color: "#f87171", bg: "rgba(239,68,68,.12)", label: "❌ Cancelado" }
};

function BarChart({ data, height = 120 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: "100%",
              background: `rgba(99,102,241,${0.3 + (d.value / max) * 0.7})`,
              borderRadius: "4px 4px 0 0",
              height: `${(d.value / max) * (height - 20)}px`,
              minHeight: 4,
              transition: "height .5s ease"
            }}
          />
          <div style={{ fontSize: 9, color: "#64748b" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Ventas() {
  const [pedidos, setPedidos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("resumen");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [detallePedido, setDetallePedido] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rPedidos, rVentas, rDetalles] = await Promise.all([
        fetch(`${API}/pedidos`, { headers: headers() }),
        fetch(`${API}/ventas`, { headers: headers() }),
        fetch(`${API}/detalle-pedidos`, { headers: headers() })
      ]);

      const [dPedidos, dVentas, dDetalles] = await Promise.all([
        rPedidos.json(),
        rVentas.json(),
        rDetalles.json()
      ]);

      setPedidos(Array.isArray(dPedidos) ? dPedidos : dPedidos.pedidos || []);
      setVentas(Array.isArray(dVentas) ? dVentas : dVentas.ventas || []);
      setDetalles(Array.isArray(dDetalles) ? dDetalles : dDetalles.detalles || []);
    } catch {
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const actualizarEstadoPedido = async (id, estado) => {
    try {
      const r = await fetch(`${API}/pedidos/${id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ estado })
      });

      if (!r.ok) {
        const e = await r.json();
        throw new Error(e.msg);
      }

      showToast("Estado actualizado");
      fetchAll();
    } catch (err) {
      showToast(err.message || "Error", "error");
    }
  };

  const totalIngresos = ventas.reduce((s, v) => s + Number(v.total || 0), 0);

  const ingresosPorMes = (() => {
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const acc = {};
    ventas.forEach(v => {
      const fecha = new Date(v.createdAt || v.fecha);
      const key = `${meses[fecha.getMonth()]}`;
      acc[key] = (acc[key] || 0) + Number(v.total || 0);
    });
    return Object.entries(acc).map(([label, value]) => ({ label, value }));
  })();

  const productosMasVendidos = (() => {
    const acc = {};
    detalles.forEach(d => {
      const nombre = d.Producto?.nombre || `Prod #${d.id_producto}`;
      if (!acc[nombre]) acc[nombre] = { nombre, cantidad: 0 };
      acc[nombre].cantidad += Number(d.cantidad || 1);
    });
    return Object.values(acc).sort((a, b) => b.cantidad - a.cantidad);
  })();

  const pedidosFiltrados = pedidos.filter(p => {
    const matchEstado = filtroEstado ? p.estado === filtroEstado : true;
    const matchBusq = busqueda
      ? (p.Usuario?.nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        String(p.id_pedido).includes(busqueda)
      : true;
    return matchEstado && matchBusq;
  });

  return (
    <div>
      <h1>Ventas</h1>

      <h2>Total: ${totalIngresos.toLocaleString()}</h2>

      <BarChart data={ingresosPorMes} />

      {pedidosFiltrados.map(p => (
        <div key={p.id_pedido}>
          #{p.id_pedido} - {p.Usuario?.nombre || `Cliente #${p.id_usuario}`}
        </div>
      ))}
    </div>
  );
}