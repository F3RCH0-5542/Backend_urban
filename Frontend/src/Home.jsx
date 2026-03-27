import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

/* ─── Paleta ─────────────────────────────────────────────────────────────── */
const C = {
  bg:"#000",card:"#111",card2:"#181818",border:"#242424",
  accent:"#667eea",cyan:"#45F3FF",green:"#10B981",red:"#EF4444",
  orange:"#F59E0B",purple:"#8B5CF6",pink:"#EC4899",blue:"#3B82F6",
  indigo:"#7C3AED",ember:"#F97316",teal:"#14B8A6",
};
const BASE = "http://localhost:3001/api";

const MODULES = [
  { icon:"👥", title:"USUARIOS",    subtitle:"Gestión de usuarios",      color:C.green,  grad:["#064e3b","#065f46"], path:"/usuarios" },
  { icon:"🎭", title:"ROLES",       subtitle:"Roles y permisos",          color:C.blue,   grad:["#1e3a8a","#1d4ed8"], path:"/roles" },
  { icon:"📦", title:"INVENTARIO",  subtitle:"Productos y stock",         color:C.purple, grad:["#3b0764","#6d28d9"], path:"/inventario" },
  { icon:"🛒", title:"VENTAS",      subtitle:"Ventas y pedidos",          color:C.orange, grad:["#78350f","#d97706"], path:"/ventas" },
  { icon:"🧾", title:"PEDIDOS",     subtitle:"Pedidos de clientes",       color:C.red,    grad:["#7f1d1d","#dc2626"], path:"/pedido" },
  { icon:"🎨", title:"PERSONALIZ.", subtitle:"Personalizaciones",         color:C.pink,   grad:["#831843","#db2777"], path:"/admin/personalizaciones" },
  { icon:"🚚", title:"ENVÍOS",      subtitle:"Envíos y entregas",         color:C.ember,  grad:["#7c2d12","#ea580c"], path:"/envios" },
  { icon:"💳", title:"PAGOS",       subtitle:"Administración de pagos",   color:C.teal,   grad:["#134e4a","#0d9488"], path:"/pago" },
  { icon:"📋", title:"PQRS",        subtitle:"Quejas y reclamos",         color:C.cyan,   grad:["#164e63","#0891b2"], path:"/pqrs" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmt$ = v => "$" + Number(v??0).toFixed(0).replaceAll(/\B(?=(\d{3})+(?!\d))/g,",") + " COP";
const fmtD = r => { try { const d=new Date(r); return r?`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`:"—"; } catch { return String(r); }};
const parseList  = (b,keys) => Array.isArray(b)?b:(keys.find(k=>b[k])&&b[keys.find(k=>b[k])])||[];
const byEstado   = (items,f) => items.reduce((m,i)=>{ const e=i[f]??"pendiente"; m[e]=(m[e]??0)+1; return m; },{});
const sumar      = items => items.reduce((s,v)=>s+(Number.parseFloat(v.total??0)||0),0);
const stockBajo  = inv => inv.filter(i=>Number.parseInt(i.stock_resultante??i.stock_disponible??i.cantidad??99)<=Number.parseInt(i.stock_minimo??5));
const delMes     = vs => { const n=new Date(); return vs.filter(v=>{ try{ const f=new Date(v.fecha??v.createdAt); return f.getMonth()===n.getMonth()&&f.getFullYear()===n.getFullYear(); }catch{return false;}}); };
const ventasDia  = vs => { const now=new Date(),map={}; for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);map[`${d.getDate()}/${d.getMonth()+1}`]=0;} vs.forEach(v=>{try{const f=new Date(v.fecha??v.createdAt),k=`${f.getDate()}/${f.getMonth()+1}`;if(k in map)map[k]+=Number.parseFloat(v.total??0)||0;}catch{}}); return map; };
const colorPqrs  = e=>({Pendiente:C.red,"En Proceso":C.orange,Resuelto:C.green}[e]??"rgba(255,255,255,0.35)");
const colorPed   = e=>({pendiente:C.orange,completado:C.green,cancelado:C.red}[e]??C.accent);

/* ─── CSS responsivo ─────────────────────────────────────────────────────── */
const CSS = `
  @keyframes spin{to{transform:rotate(360deg)}}
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}
  .mod-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
  .kpi-wrap{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:32px}
  .est-wrap{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:32px}
  @media(max-width:1024px){.mod-grid{grid-template-columns:repeat(4,1fr)}}
  @media(max-width:768px){.mod-grid{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:520px){.mod-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:600px){.kpi-wrap{flex-direction:column}.est-wrap{flex-direction:column}}
`;

/* ─── Componentes UI ─────────────────────────────────────────────────────── */
function ModuleCard({ mod }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={mod.path} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      aria-label={mod.title}
      style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textDecoration:"none",
        borderRadius:16, padding:"28px 16px", cursor:"pointer", position:"relative", overflow:"hidden",
        transition:"transform .2s,box-shadow .2s", aspectRatio:"1",
        transform:hov?"translateY(-6px) scale(1.02)":"translateY(0) scale(1)",
        boxShadow:hov?`0 16px 40px ${mod.color}40`:"0 2px 8px rgba(0,0,0,0.4)",
        background:hov?`linear-gradient(145deg,${mod.grad[0]},${mod.grad[1]})`:C.card,
        border:`1px solid ${hov?mod.color+"99":mod.color+"33"}`,
      }}>
      <div style={{ position:"absolute", width:80, height:80, borderRadius:"50%", background:mod.color, opacity:hov?.15:.07, filter:"blur(24px)", top:"20%", transition:"opacity .3s" }} />
      <div style={{ width:64, height:64, borderRadius:"50%", background:`linear-gradient(135deg,${mod.grad[0]},${mod.grad[1]})`,
        border:`2px solid ${mod.color}55`, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, marginBottom:14, boxShadow:`0 4px 16px ${mod.color}30`, transition:"transform .2s", transform:hov?"scale(1.1)":"scale(1)" }}>
        <span aria-hidden="true">{mod.icon}</span>
      </div>
      <span style={{ fontSize:13, fontWeight:800, color:hov?"#fff":"rgba(255,255,255,0.9)", textAlign:"center", letterSpacing:.8, marginBottom:5 }}>{mod.title}</span>
      <span style={{ fontSize:11, color:hov?"rgba(255,255,255,0.75)":"rgba(255,255,255,0.45)", textAlign:"center", lineHeight:1.4 }}>{mod.subtitle}</span>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${mod.color},transparent)`, opacity:hov?1:.4, transition:"opacity .3s" }} />
    </a>
  );
}

ModuleCard.propTypes = {
  mod: PropTypes.shape({
    icon:     PropTypes.string.isRequired,
    title:    PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    color:    PropTypes.string.isRequired,
    grad:     PropTypes.arrayOf(PropTypes.string).isRequired,
    path:     PropTypes.string.isRequired,
  }).isRequired,
};

function KpiCard({ label, value, icon, color }) {
  return (
    <div style={{ flex:1, minWidth:140, background:C.card, borderRadius:14, border:`1px solid ${color}33`, padding:"18px 16px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-10, right:-10, width:60, height:60, borderRadius:"50%", background:color, opacity:.1, filter:"blur(20px)" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <span aria-hidden="true" style={{ fontSize:22 }}>{icon}</span>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color, marginTop:4 }} />
      </div>
      <div style={{ marginTop:14, color, fontSize:24, fontWeight:"bold", fontFamily:"monospace", letterSpacing:-.5 }}>{value}</div>
      <div style={{ marginTop:5, color:"rgba(255,255,255,0.5)", fontSize:12 }}>{label}</div>
    </div>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon:  PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

function SectionTitle({ icon, text, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <span aria-hidden="true" style={{ fontSize:18 }}>{icon}</span>
      <span style={{ color:color??"#fff", fontSize:16, fontWeight:"bold" }}>{text}</span>
    </div>
  );
}

SectionTitle.propTypes = {
  icon:  PropTypes.string.isRequired,
  text:  PropTypes.string.isRequired,
  color: PropTypes.string,
};

SectionTitle.defaultProps = {
  color: "#fff",
};

function EmptyState({ msg }) {
  return <div style={{ background:C.card, borderRadius:12, border:`1px solid ${C.border}`, padding:24, textAlign:"center", color:"rgba(255,255,255,0.35)" }}>{msg}</div>;
}

EmptyState.propTypes = {
  msg: PropTypes.string.isRequired,
};

function EstadosCard({ title, data, colors }) {
  const entries = Object.entries(data);
  if (!entries.length) return <EmptyState msg="Sin datos" />;
  const total = Object.values(data).reduce((a,b)=>a+b,0);
  return (
    <div style={{ flex:1, minWidth:260, background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:18 }}>
      {title && <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:.8, marginBottom:14 }}>{title}</div>}
      {entries.map(([k,v]) => {
        const color = colors[k]??"rgba(255,255,255,0.24)";
        const pct   = total ? v/total : 0;
        return (
          <div key={k} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>{k}</span>
              <span style={{ color, fontSize:13, fontWeight:"bold" }}>{v} <span style={{ color:"rgba(255,255,255,0.4)", fontWeight:"normal" }}>({(pct*100).toFixed(0)}%)</span></span>
            </div>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:6, height:8, overflow:"hidden" }}>
              <div style={{ width:`${pct*100}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}99)`, borderRadius:6, transition:"width .7s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

EstadosCard.propTypes = {
  title:  PropTypes.string,
  data:   PropTypes.objectOf(PropTypes.number),
  colors: PropTypes.objectOf(PropTypes.string),
};

EstadosCard.defaultProps = {
  title:  "",
  data:   {},
  colors: {},
};

function VentasChart({ data }) {
  const entries = Object.entries(data);
  if (!entries.length) return <EmptyState msg="Sin datos de ventas" />;
  const maxVal = Math.max(...Object.values(data),1);
  const total  = Object.values(data).reduce((a,b)=>a+b,0);
  return (
    <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <span style={{ color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600 }}>Ingresos diarios</span>
        <span style={{ color:C.green, fontSize:13, fontWeight:"bold" }}>{fmt$(total)}</span>
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", height:140, gap:8 }}>
        {entries.map(([day,val]) => (
          <div key={day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
            {val>0 && <span style={{ color:"rgba(255,255,255,0.5)", fontSize:9, marginBottom:3 }}>${(val/1000).toFixed(0)}k</span>}
            <div style={{ width:"100%", height:Math.max(val/maxVal*100,val>0?6:3),
              background:val>0?`linear-gradient(to top,${C.accent},${C.purple})`:"rgba(255,255,255,0.08)",
              borderRadius:"4px 4px 0 0", transition:"height .7s ease", boxShadow:val>0?`0 0 12px ${C.accent}40`:"none" }} />
            <span style={{ color:"rgba(255,255,255,0.35)", fontSize:10, marginTop:7 }}>{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

VentasChart.propTypes = {
  data: PropTypes.objectOf(PropTypes.number),
};

VentasChart.defaultProps = {
  data: {},
};

function StockBajoTable({ items }) {
  if (!items.length) return null;
  return (
    <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.orange}40`, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr 1fr", padding:"10px 18px", background:`${C.orange}18`, borderBottom:`1px solid ${C.border}` }}>
        {["Producto","Stock","Mínimo"].map(h=><span key={h} style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600 }}>{h}</span>)}
      </div>
      {items.map((i,idx)=>(
        <div key={idx} style={{ display:"grid", gridTemplateColumns:"3fr 1fr 1fr", padding:"11px 18px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ color:"#fff", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{i.nombre_producto??i.Producto?.nombre_producto??"Producto"}</span>
          <span style={{ color:C.red, fontWeight:"bold", textAlign:"center" }}>{i.stock_resultante??i.stock_disponible??i.cantidad??0}</span>
          <span style={{ color:"rgba(255,255,255,0.35)", textAlign:"center" }}>{i.stock_minimo??5}</span>
        </div>
      ))}
    </div>
  );
}

StockBajoTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};

StockBajoTable.defaultProps = {
  items: [],
};

function DataTable({ headers, rows, estadoIdx, colorFn }) {
  if (!rows?.length) return <EmptyState msg="Sin registros" />;
  const cols = `repeat(${headers.length},1fr)`;
  const cellBase = { color:"rgba(255,255,255,0.85)", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" };
  return (
    <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden" }}>
      <div style={{ display:"grid", gridTemplateColumns:cols, padding:"11px 18px", background:"rgba(255,255,255,0.04)", borderBottom:`1px solid ${C.border}` }}>
        {headers.map(h=><span key={h} style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{h}</span>)}
      </div>
      {rows.map((row,ri)=>(
        <div key={ri} style={{ display:"grid", gridTemplateColumns:cols, padding:"11px 18px", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
          {row.map((cell,ci)=>ci===estadoIdx
            ? <div key={ci} style={{ display:"inline-flex", padding:"3px 10px", borderRadius:20, border:`1px solid ${colorFn(cell)}55`, background:`${colorFn(cell)}20`, maxWidth:140 }}>
                <span style={{ color:colorFn(cell), fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:600 }}>{cell}</span>
              </div>
            : <span key={ci} style={cellBase}>{cell}</span>
          )}
        </div>
      ))}
    </div>
  );
}

DataTable.propTypes = {
  headers:   PropTypes.arrayOf(PropTypes.string).isRequired,
  rows:      PropTypes.arrayOf(PropTypes.array),
  estadoIdx: PropTypes.number.isRequired,
  colorFn:   PropTypes.func.isRequired,
};

DataTable.defaultProps = {
  rows: [],
};

function LogoutButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?C.red:"transparent", border:`1px solid ${C.red}`, color:hov?"#fff":C.red,
        borderRadius:8, padding:"7px 16px", cursor:"pointer", fontSize:13, fontWeight:600, transition:"all .2s", letterSpacing:.3 }}>
      Cerrar sesión
    </button>
  );
}

LogoutButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

/* ─── Componente Principal ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab,    setActiveTab]    = useState("modulos");
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats,        setStats]        = useState({});
  const [userName,     setUserName]     = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) { const d = jwtDecode(token); setUserName(d.nombre??d.name??d.email??"Admin"); }
    } catch {}
  }, []);

  const cargarEstadisticas = useCallback(async () => {
    setLoadingStats(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const hdrs = { Authorization:`Bearer ${token}`, "Content-Type":"application/json" };
      const endpoints = ["ventas","pedidos","personalizaciones","pqrs","usuarios","inventario"];
      const results = await Promise.all(endpoints.map(e => fetch(`${BASE}/${e}`,{ headers:hdrs })));

      if (results.some(r=>r.status===401)) { localStorage.clear(); window.location.href="/login"; return; }

      const [b0,b1,b2,b3,b4,b5] = await Promise.all(results.map(r=>r.json()));
      const ventas     = parseList(b0,["ventas","data"]);
      const pedidos    = parseList(b1,["pedidos","data"]);
      const pers       = parseList(b2,["personalizaciones","data"]);
      const pqrs       = parseList(b3,["pqrs","data"]);
      const usuarios   = parseList(b4,["usuarios","data"]);
      const inventario = parseList(b5,["movimientos","inventario","data"]);
      const ventasMes  = delMes(ventas);

      setStats({
        ventasMes:        ventasMes.length,
        totalMes:         sumar(ventasMes),
        totalPedidos:     pedidos.length,
        totalUsuarios:    usuarios.length,
        estadosPedido:    byEstado(pedidos,"estado"),
        estadosPers:      byEstado(pers,"estado"),
        estadosPqrs:      byEstado(pqrs,"estado"),
        stockBajo:        stockBajo(inventario),
        ventasPorDia:     ventasDia(ventas),
        pqrsRecientes:    pqrs.slice(0,5),
        pedidosRecientes: pedidos.slice(0,5),
      });
    } catch (e) { console.error(e); }
    finally { setLoadingStats(false); }
  }, []);

  useEffect(() => { cargarEstadisticas(); }, [cargarEstadisticas]);
  const handleLogout = () => { localStorage.clear(); window.location.href="/login"; };

  /* ── Tab Módulos ─────────────────────────────────────────────────────── */
  const renderModulos = () => (
    <div style={{ padding:"28px 24px", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ padding:"28px 32px", borderRadius:16, background:"linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)",
        display:"flex", alignItems:"center", gap:24, marginBottom:36, boxShadow:"0 8px 32px rgba(99,102,241,0.3)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-40, top:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
        <div style={{ fontSize:56, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }} aria-hidden="true">🛡️</div>
        <div>
          <div style={{ color:"#fff", fontSize:26, fontWeight:800, letterSpacing:.5 }}>Panel de Administración</div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:15, marginTop:5 }}>Bienvenido, {userName}</div>
        </div>
      </div>
      <div style={{ color:C.cyan, fontSize:13, fontWeight:800, letterSpacing:2, marginBottom:22, opacity:.9 }}>◈ MÓDULOS DEL SISTEMA</div>
      <div className="mod-grid">
        {MODULES.map(mod=><ModuleCard key={mod.path} mod={mod} />)}
      </div>
    </div>
  );

  /* ── Tab Reportes ────────────────────────────────────────────────────── */
  const renderReportes = () => {
    if (loadingStats) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:16 }}>
        <div role="status" aria-label="Cargando estadísticas" style={{ width:44, height:44, border:`3px solid ${C.accent}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
        <span style={{ color:"rgba(255,255,255,0.5)" }}>Cargando estadísticas...</span>
      </div>
    );

    const eped  = stats.estadosPedido??{};
    const epqrs = stats.estadosPqrs??{};
    const epers = stats.estadosPers??{};
    const sb    = stats.stockBajo??[];
    const pqrsRows = (stats.pqrsRecientes??[]).map(p=>[p.nombre??"—",p.tipo_pqrs??"—",p.estado??"Pendiente",fmtD(p.fecha_solicitud??p.createdAt)]);
    const pedRows  = (stats.pedidosRecientes??[]).map(p=>[`#${p.id_pedido??p.id??"—"}`,`$${p.total??0}`,p.estado??"pendiente",fmtD(p.fecha_pedido??p.createdAt)]);

    return (
      <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:24 }}>
          <button type="button" onClick={cargarEstadisticas}
            style={{ background:C.card, border:`1px solid ${C.border}`, color:C.accent, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:13, fontWeight:600 }}>
            🔄 Actualizar
          </button>
        </div>

        <SectionTitle icon="📊" text="Resumen General" />
        <div className="kpi-wrap">
          <KpiCard label="Ventas este mes"   value={stats.ventasMes??0}                                    icon="📈" color={C.green}  />
          <KpiCard label="Ingresos mes"      value={fmt$(stats.totalMes??0)}                                icon="💰" color={C.accent} />
          <KpiCard label="Pedidos totales"   value={stats.totalPedidos??0}                                  icon="🛍️" color={C.orange} />
          <KpiCard label="Usuarios"          value={stats.totalUsuarios??0}                                 icon="👥" color={C.purple} />
          <KpiCard label="PQRS pendientes"   value={epqrs["Pendiente"]??0}                                  icon="📋" color={C.red}    />
          <KpiCard label="Personalizaciones" value={Object.values(epers).reduce((a,b)=>a+b,0)}             icon="🎨" color={C.pink}   />
        </div>

        <SectionTitle icon="📉" text="Ventas últimos 7 días" />
        <div style={{ marginBottom:32 }}><VentasChart data={stats.ventasPorDia} /></div>

        <div className="est-wrap">
          <EstadosCard title="Pedidos por estado" data={eped}  colors={{ pendiente:C.orange,en_proceso:C.accent,enviado:C.purple,completado:C.green,cancelado:C.red }} />
          <EstadosCard title="PQRS por estado"    data={epqrs} colors={{ Pendiente:C.red,"En Proceso":C.orange,Resuelto:C.green,Cerrado:"rgba(255,255,255,0.24)" }} />
        </div>

        <SectionTitle icon="🎨" text="Personalizaciones por estado" />
        <div style={{ marginBottom:32 }}>
          <EstadosCard title="" data={epers} colors={{ pendiente:C.orange,en_proceso:C.accent,aprobada:C.green,rechazada:C.red }} />
        </div>

        {sb.length>0 && <>
          <SectionTitle icon="⚠️" text="Productos con stock bajo" color={C.orange} />
          <div style={{ marginBottom:32 }}><StockBajoTable items={sb} /></div>
        </>}

        <SectionTitle icon="📋" text="PQRS recientes" />
        <div style={{ marginBottom:32 }}>
          <DataTable headers={["Nombre","Tipo","Estado","Fecha"]} rows={pqrsRows} estadoIdx={2} colorFn={colorPqrs} />
        </div>

        <SectionTitle icon="🧾" text="Pedidos recientes" />
        <div style={{ marginBottom:28 }}>
          <DataTable headers={["ID","Total","Estado","Fecha"]} rows={pedRows} estadoIdx={2} colorFn={colorPed} />
        </div>
      </div>
    );
  };

  const TABS = [{ id:"modulos",label:"Módulos",icon:"⊞" },{ id:"reportes",label:"Reportes",icon:"📊" }];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:"#fff", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{CSS}</style>

      <header style={{ background:"rgba(0,0,0,0.95)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", height:66 }}>
            <span style={{ fontWeight:800, letterSpacing:2.5, fontSize:17, background:"linear-gradient(90deg,#fff,rgba(255,255,255,0.7))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              URBAN COPS — Admin
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:18 }}>
              <span style={{ color:C.cyan, fontWeight:700, fontSize:14 }}>{userName}</span>
              <LogoutButton onClick={handleLogout} />
            </div>
          </div>
          <nav aria-label="Secciones del panel">
            <div style={{ display:"flex" }}>
              {TABS.map(tab=>(
                <button key={tab.id} type="button" onClick={()=>setActiveTab(tab.id)}
                  aria-selected={activeTab===tab.id} role="tab"
                  style={{ background:"transparent", border:"none", color:activeTab===tab.id?C.accent:"rgba(255,255,255,0.35)",
                    padding:"13px 22px", cursor:"pointer", fontSize:14, fontWeight:700,
                    borderBottom:activeTab===tab.id?`2px solid ${C.accent}`:"2px solid transparent",
                    transition:"all .2s", display:"flex", alignItems:"center", gap:7, letterSpacing:.3 }}>
                  <span aria-hidden="true">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main>{activeTab==="modulos" ? renderModulos() : renderReportes()}</main>
    </div>
  );
}