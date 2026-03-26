import React, { useState, useRef, useCallback } from "react";
import { createPersonalizacion } from "./services/personalizacionService";

const LOGOS = [
  { id: "none", label: "Sin logo", svg: null },
  { id: "star", label: "Estrella", svg: "⭐" }, { id: "crown", label: "Corona", svg: "👑" },
  { id: "fire", label: "Fuego", svg: "🔥" },   { id: "bolt",  label: "Rayo",   svg: "⚡" },
  { id: "diamond", label: "Diamante", svg: "💎" }, { id: "skull", label: "Skull", svg: "💀" },
  { id: "lion", label: "León", svg: "🦁" },    { id: "wolf",  label: "Lobo",   svg: "🐺" },
];
const COLORS = [
  { hex: "#1a1a1a", name: "Negro" }, { hex: "#2c2c54", name: "Azul Marino" },
  { hex: "#c0392b", name: "Rojo" },  { hex: "#27ae60", name: "Verde" },
  { hex: "#f39c12", name: "Naranja" }, { hex: "#8e44ad", name: "Púrpura" },
  { hex: "#ecf0f1", name: "Blanco" }, { hex: "#795548", name: "Café" },
  { hex: "#00bcd4", name: "Cian" }, { hex: "#e91e63", name: "Rosa" },
  { hex: "#607d8b", name: "Gris Azul" }, { hex: "#ff5722", name: "Coral" },
];
const VISOR_COLORS = [
  { hex: "#1a1a1a", name: "Negro" }, { hex: "#ecf0f1", name: "Blanco" },
  { hex: "#c0392b", name: "Rojo" },  { hex: "#2c2c54", name: "Marino" },
  { hex: "#795548", name: "Café" },  { hex: "#f39c12", name: "Naranja" },
];
const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];
const TALLA_MEDIDAS = [["XS","52-53 cm"],["S","54-55 cm"],["M","56-57 cm"],["L","58-59 cm"],["XL","60-61 cm"],["XXL","62+ cm"]];
const ESTILOS = [{ id:"snapback",label:"Snapback" },{ id:"trucker",label:"Trucker" },{ id:"fitted",label:"Fitted" },{ id:"dad",label:"Dad Hat" }];
const PRECIO_BASE = { snapback:85000, trucker:75000, fitted:95000, dad:70000 };
const TIPO_MAP = { snapback:"bordado", trucker:"bordado", fitted:"estampado", dad:"otro" };
const TEXTO_COLORS = ["#ffffff","#000000","#d4a017","#c0392b","#27ae60","#3498db","#e91e63","#ff5722"];
const TABS = [{ id:"color",label:"Color",icon:"🎨" },{ id:"logo",label:"Logo",icon:"✨" },{ id:"texto",label:"Texto",icon:"✏️" },{ id:"talla",label:"Talla",icon:"📐" }];
const INIT = { color:"#1a1a1a", visorColor:"#1a1a1a", logo:"none", texto:"", textoColor:"#ffffff", talla:"M", estilo:"snapback", cantidad:1 };

const find = (arr, key, val) => arr.find(x => x[key] === val);
const calcPrecio = c => (PRECIO_BASE[c.estilo]??0) + (c.logo!=="none"?10000:0) + (c.texto?8000:0);

const S = {
  gold: "#d4a017", bg: "#0d0d0d",
  card: { background:"#111", border:"1px solid #222", borderRadius:14, padding:20 },
  cell: { background:"#0d0d0d", border:"1px solid #1e1e1e", borderRadius:8, padding:"9px 12px" },
  lbl:  { fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 },
  seclbl: { fontSize:12, color:"#666", textTransform:"uppercase", letterSpacing:1, marginBottom:10, display:"block" },
};
const active = (on) => ({ border:`${on?"2px solid #d4a017":"1px solid #2a2a2a"}`, background:on?"rgba(212,160,23,0.1)":"#0d0d0d", color:on?"#d4a017":"#888" });

const CSS = `
  *,*::before,*::after{box-sizing:border-box}body{margin:0}
  .uc-grid{display:grid;grid-template-columns:1fr 420px;gap:32px;align-items:start}
  .uc-sticky{position:sticky;top:80px}
  .uc-colors{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
  .uc-logos{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .uc-tallas{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
  .uc-estilos{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .uc-infogrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
  .uc-tabs{display:grid;grid-template-columns:repeat(4,1fr)}
  .uc-modalbtns{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .uc-h1{font-size:32px}.uc-price{font-size:30px}
  @media(max-width:900px){.uc-grid{grid-template-columns:1fr}.uc-sticky{position:static}}
  @media(max-width:480px){.uc-h1{font-size:22px}.uc-price{font-size:22px}}
  @media(max-width:400px){.uc-modalbtns{grid-template-columns:1fr}}
  @media(max-width:380px){.uc-colors{grid-template-columns:repeat(4,1fr)}}
`;

function GorraSVG({ color, visorColor, logo, texto, textoColor }) {
  const li = find(LOGOS,"id",logo);
  const hasLogo = logo !== "none" && li?.svg;
  return (
    <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" role="img"
      aria-label="Vista previa de la gorra" style={{ width:"100%", maxWidth:360, filter:"drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}>
      <ellipse cx="150" cy="205" rx="110" ry="12" fill="rgba(0,0,0,0.25)" />
      <path d="M 50 130 Q 50 50 150 45 Q 250 50 250 130 Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <path d="M 150 45 Q 160 88 155 130" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      <path d="M 150 45 Q 140 88 145 130" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      <circle cx="150" cy="48" r="6" fill={visorColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <path d="M 52 132 Q 150 128 248 132 Q 248 142 150 144 Q 52 142 52 132 Z" fill={visorColor} opacity="0.85" />
      <path d="M 70 138 Q 150 148 230 138 Q 240 155 220 165 Q 150 172 80 165 Q 60 155 70 138 Z" fill={visorColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <path d="M 75 143 Q 150 152 225 143" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
      <path d="M 100 65 Q 130 55 170 62" stroke="rgba(255,255,255,0.18)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {hasLogo && <text x="150" y="105" textAnchor="middle" fontSize="36" aria-hidden="true">{li.svg}</text>}
      {texto && <text x="150" y={hasLogo?"125":"110"} textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="Arial,sans-serif" fill={textoColor} letterSpacing="1">{texto.toUpperCase().slice(0,10)}</text>}
    </svg>
  );
}

function ColorSwatch({ hex, name, selected, onClick }) {
  return (
    <button type="button" aria-label={name} aria-pressed={selected} onClick={onClick}
      style={{ width:"100%", aspectRatio:"1", borderRadius:8, background:hex, cursor:"pointer", transition:"transform .15s",
        border:selected?"3px solid #d4a017":"2px solid #2a2a2a", transform:selected?"scale(1.15)":"scale(1)" }} />
  );
}

function TabColor({ config, set }) {
  return (
    <div>
      <span style={S.seclbl}>Color de la gorra</span>
      <div className="uc-colors" style={{ marginBottom:20 }}>
        {COLORS.map(c => <ColorSwatch key={c.hex} hex={c.hex} name={`Gorra: ${c.name}`} selected={config.color===c.hex} onClick={()=>set("color",c.hex)} />)}
      </div>
      <span style={S.seclbl}>Color de la visera</span>
      <div className="uc-colors" style={{ marginBottom:16 }}>
        {VISOR_COLORS.map(c => <ColorSwatch key={c.hex} hex={c.hex} name={`Visera: ${c.name}`} selected={config.visorColor===c.hex} onClick={()=>set("visorColor",c.hex)} />)}
      </div>
      <span style={S.seclbl}>Color personalizado</span>
      <label style={{ display:"flex", gap:10, alignItems:"center" }}>
        <input type="color" value={config.color} onChange={e=>set("color",e.target.value)}
          style={{ width:48, height:40, borderRadius:8, border:"1px solid #333", cursor:"pointer", padding:2 }} />
        <span style={{ fontSize:13, color:"#666" }}>Elige cualquier color</span>
      </label>
    </div>
  );
}

function TabLogo({ config, set }) {
  return (
    <div>
      <span style={S.seclbl}>Elige un logo (+$10.000)</span>
      <div className="uc-logos">
        {LOGOS.map(l => (
          <button key={l.id} type="button" aria-pressed={config.logo===l.id} onClick={()=>set("logo",l.id)}
            style={{ ...active(config.logo===l.id), padding:"14px 8px", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:6, transition:"all .2s" }}>
            <span aria-hidden="true" style={{ fontSize:28 }}>{l.svg??"✖"}</span>{l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabTexto({ config, set }) {
  return (
    <div>
      <label htmlFor="texto-gorra" style={S.seclbl}>Texto en la gorra (+$8.000, máx 10 caracteres)</label>
      <input id="texto-gorra" type="text" maxLength={10} value={config.texto} placeholder="Ej: URBAN, tu nombre..."
        onChange={e=>set("texto",e.target.value)}
        style={{ width:"100%", background:S.bg, border:"1px solid #2a2a2a", borderRadius:8, padding:"11px 14px",
          color:"#fff", fontSize:15, outline:"none", marginBottom:16, letterSpacing:1, fontWeight:600, boxSizing:"border-box" }} />
      <span style={S.seclbl}>Color del texto</span>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {TEXTO_COLORS.map(c => (
          <button key={c} type="button" aria-label={`Color texto: ${c}`} aria-pressed={config.textoColor===c} onClick={()=>set("textoColor",c)}
            style={{ width:34, height:34, borderRadius:6, background:c, cursor:"pointer", transition:"transform .15s",
              border:config.textoColor===c?"3px solid #d4a017":"2px solid #2a2a2a", transform:config.textoColor===c?"scale(1.2)":"scale(1)" }} />
        ))}
      </div>
    </div>
  );
}

function TabTalla({ config, set }) {
  return (
    <div>
      <span style={S.seclbl}>Selecciona tu talla</span>
      <div className="uc-tallas">
        {TALLAS.map(t => (
          <button key={t} type="button" aria-pressed={config.talla===t} onClick={()=>set("talla",t)}
            style={{ ...active(config.talla===t), padding:"16px 8px", borderRadius:10, fontSize:18, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ background:S.bg, border:"1px solid #1e1e1e", borderRadius:10, padding:14 }}>
        <span style={{ ...S.seclbl, marginBottom:8 }}>Guía de tallas</span>
        {TALLA_MEDIDAS.map(([t,m]) => (
          <div key={t} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid #1a1a1a", fontSize:13 }}>
            <span style={{ color:config.talla===t?S.gold:"#555", fontWeight:config.talla===t?700:400 }}>{t}</span>
            <span style={{ color:"#444" }}>{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalPedido({ config, precio, onClose, onConfirmar, enviando }) {
  const descRef = useRef(null);
  const ci = find(COLORS,"hex",config.color)??{ name:"Personalizado" };
  const vi = find(VISOR_COLORS,"hex",config.visorColor)??{ name:"Personalizado" };
  const li = find(LOGOS,"id",config.logo);
  const ei = find(ESTILOS,"id",config.estilo);
  const resumen = [
    { label:"Estilo", value:ei?.label }, { label:"Talla", value:config.talla },
    { label:"Color gorra", value:ci.name }, { label:"Color visera", value:vi.name },
    { label:"Logo", value:`${li?.svg??""} ${li?.label??""}`.trim() },
    { label:"Texto", value:config.texto?config.texto.toUpperCase():"Ninguno" },
    { label:"Cantidad", value:config.cantidad },
    { label:"Precio unit.", value:`$${precio.toLocaleString("es-CO")} COP` },
  ];
  const defaultDesc = `Gorra ${ei?.label} talla ${config.talla}, color ${ci.name}, visera ${vi.name}${config.logo!=="none"?`, logo ${li?.label}`:""}${config.texto?`, texto "${config.texto.toUpperCase()}"`:""}. Cantidad: ${config.cantidad}.`;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div style={{ background:"#111", border:"1px solid #2a2a2a", borderRadius:18, maxWidth:520, width:"100%", maxHeight:"90vh", overflowY:"auto", padding:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h2 id="modal-title" style={{ color:"#fff", fontSize:20, fontWeight:800, margin:0 }}>✅ Confirmar Pedido</h2>
          <button type="button" onClick={onClose} disabled={enviando} aria-label="Cerrar modal"
            style={{ background:"none", border:"none", color:"#555", fontSize:24, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ background:S.bg, borderRadius:12, padding:"20px 16px", marginBottom:20, textAlign:"center" }}>
          <GorraSVG color={config.color} visorColor={config.visorColor} logo={config.logo} texto={config.texto} textoColor={config.textoColor} />
        </div>
        <div style={{ fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Detalle de la personalización</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
          {resumen.map(item => (
            <div key={item.label} style={S.cell}>
              <div style={S.lbl}>{item.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#ddd" }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid rgba(212,160,23,0.25)", borderRadius:10, padding:"12px 18px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"#888", fontSize:13 }}>TOTAL DEL PEDIDO</span>
          <span style={{ color:S.gold, fontSize:24, fontWeight:800 }}>${(precio*config.cantidad).toLocaleString("es-CO")} COP</span>
        </div>
        <label htmlFor="desc-pedido" style={{ ...S.seclbl, marginBottom:8 }}>Descripción del pedido</label>
        <textarea id="desc-pedido" ref={descRef} defaultValue={defaultDesc} rows={3}
          style={{ width:"100%", background:S.bg, border:"1px solid #2a2a2a", borderRadius:8, padding:"11px 14px", color:"#ccc", fontSize:13, resize:"vertical", outline:"none", boxSizing:"border-box", marginBottom:22 }} />
        <div className="uc-modalbtns">
          <button type="button" onClick={onClose} disabled={enviando}
            style={{ padding:13, borderRadius:10, border:"1px solid #2a2a2a", background:S.bg, color:"#888", fontSize:14, fontWeight:600, cursor:"pointer" }}>
            Cancelar
          </button>
          <button type="button" onClick={()=>onConfirmar(descRef.current?.value??"")} disabled={enviando}
            style={{ padding:13, borderRadius:10, border:"none", background:enviando?"#555":"#7c3aed", color:"#fff", fontSize:14, fontWeight:800, cursor:enviando?"not-allowed":"pointer" }}>
            {enviando?"⏳ Enviando...":"✨ Crear Personalización"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Personalizacion() {
  const [config, setConfig] = useState(INIT);
  const [activeTab, setActiveTab] = useState("color");
  const [showModal, setShowModal] = useState(false);
  const [enviado, setEnviado]     = useState(false);
  const [enviando, setEnviando]   = useState(false);

  const set = useCallback((key, val) => setConfig(prev => ({ ...prev, [key]: val })), []);
  const precio = calcPrecio(config);

  const guardar = useCallback(async (desc) => {
    const ci = find(COLORS,"hex",config.color)??{ name:"Personalizado" };
    const vi = find(VISOR_COLORS,"hex",config.visorColor)??{ name:"Personalizado" };
    const li = find(LOGOS,"id",config.logo);
    const colorDeseado = [`Gorra: ${ci.name}`,`Visera: ${vi.name}`,
      config.logo!=="none"&&li?`Logo: ${li.label}`:null,
      config.texto?`Texto: ${config.texto.toUpperCase()} (color: ${config.textoColor})`:null,
    ].filter(Boolean).join(" | ");
    try {
      setEnviando(true);
      await createPersonalizacion({
        tipo_personalizacion: TIPO_MAP[config.estilo]??"otro",
        descripcion_personalizacion: desc,
        color_deseado: colorDeseado,
        talla: config.talla,
        precio_adicional: (config.logo!=="none"?10000:0)+(config.texto?8000:0),
      });
      setShowModal(false); setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
    } catch (err) {
      alert(`❌ ${err?.msg??err?.message??"Error al enviar la personalización"}`);
    } finally { setEnviando(false); }
  }, [config]);

  const previewInfo = [
    { label:"Estilo", value:find(ESTILOS,"id",config.estilo)?.label },
    { label:"Talla",  value:config.talla },
    { label:"Color",  value:find(COLORS,"hex",config.color)?.name??"Personalizado" },
    { label:"Logo",   value:find(LOGOS,"id",config.logo)?.label },
  ];
  const PANEL_TABS = { color:<TabColor config={config} set={set}/>, logo:<TabLogo config={config} set={set}/>, texto:<TabTexto config={config} set={set}/>, talla:<TabTalla config={config} set={set}/> };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#e0e0e0", fontFamily:"'Segoe UI',sans-serif" }}>
        {showModal && <ModalPedido config={config} precio={precio} onClose={()=>!enviando&&setShowModal(false)} onConfirmar={guardar} enviando={enviando} />}

        <nav aria-label="Navegación principal" style={{ background:"#111", borderBottom:"1px solid #222", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <a href="/" style={{ fontSize:22, fontWeight:800, color:"#fff", textDecoration:"none", letterSpacing:1 }}>URBAN CAPS</a>
          <div style={{ display:"flex", gap:12 }}>
            <a href="/login"   aria-label="Iniciar sesión" style={{ color:"#aaa", fontSize:22 }}><i className="bi bi-person" aria-hidden="true" /></a>
            <a href="/carrito" aria-label="Ver carrito"    style={{ color:"#aaa", fontSize:22 }}><i className="bi bi-cart"   aria-hidden="true" /></a>
          </div>
        </nav>

        <header style={{ textAlign:"center", padding:"32px 20px 16px" }}>
          <h1 className="uc-h1" style={{ fontWeight:800, color:"#fff", marginBottom:6, letterSpacing:1 }}>🎨 DISEÑA TU GORRA</h1>
          <p style={{ color:"#666", fontSize:15 }}>Personaliza cada detalle en tiempo real</p>
        </header>

        <main style={{ maxWidth:1100, margin:"0 auto", padding:"0 20px 60px" }}>
          <div className="uc-grid">

            <div className="uc-sticky">
              <div style={{ background:"#111", border:"1px solid #222", borderRadius:16, padding:32, textAlign:"center" }}>
                <div style={{ background:S.bg, borderRadius:12, padding:"32px 16px", marginBottom:24 }}>
                  <GorraSVG color={config.color} visorColor={config.visorColor} logo={config.logo} texto={config.texto} textoColor={config.textoColor} />
                </div>
                <div className="uc-infogrid">
                  {previewInfo.map(i => (
                    <div key={i.label} style={{ ...S.cell, textAlign:"left" }}>
                      <div style={S.lbl}>{i.label}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#ddd" }}>{i.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(212,160,23,0.08)", border:"1px solid rgba(212,160,23,0.25)", borderRadius:10, padding:"14px 20px", marginBottom:20 }}>
                  <div style={{ fontSize:12, color:"#888", marginBottom:4 }}>PRECIO TOTAL</div>
                  <div className="uc-price" style={{ fontWeight:800, color:S.gold }}>${precio.toLocaleString("es-CO")} COP</div>
                  <div style={{ fontSize:11, color:"#555", marginTop:4 }}>
                    {config.logo!=="none"&&"+ $10.000 logo  "}{config.texto&&"+ $8.000 texto"}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:16 }}>
                  <button type="button" aria-label="Reducir cantidad" onClick={()=>set("cantidad",Math.max(1,config.cantidad-1))}
                    style={{ width:36, height:36, borderRadius:"50%", border:"1px solid #333", background:"#1a1a1a", color:"#fff", fontSize:18, cursor:"pointer" }}>−</button>
                  <span aria-live="polite" style={{ fontSize:20, fontWeight:700, minWidth:32, textAlign:"center" }}>{config.cantidad}</span>
                  <button type="button" aria-label="Aumentar cantidad" onClick={()=>set("cantidad",config.cantidad+1)}
                    style={{ width:36, height:36, borderRadius:"50%", border:"1px solid #333", background:"#1a1a1a", color:"#fff", fontSize:18, cursor:"pointer" }}>+</button>
                </div>
                <button type="button" onClick={()=>setShowModal(true)}
                  style={{ width:"100%", padding:14, borderRadius:10, border:"none", background:enviado?"#27ae60":"#7c3aed", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", letterSpacing:1 }}>
                  {enviado?"✅ ¡PERSONALIZACIÓN ENVIADA!":"✨ ENVIAR PERSONALIZACIÓN"}
                </button>
                {enviado&&<p aria-live="polite" style={{ color:"#555", fontSize:12, marginTop:10 }}>Pedido guardado correctamente en la base de datos</p>}
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={S.card}>
                <span style={S.seclbl}>Estilo de gorra</span>
                <div role="group" aria-label="Estilos de gorra" className="uc-estilos">
                  {ESTILOS.map(e => (
                    <button key={e.id} type="button" aria-pressed={config.estilo===e.id} onClick={()=>set("estilo",e.id)}
                      style={{ ...active(config.estilo===e.id), padding:"10px 14px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background:"#111", border:"1px solid #222", borderRadius:14, overflow:"hidden" }}>
                <div role="tablist" aria-label="Opciones de personalización" className="uc-tabs" style={{ borderBottom:"1px solid #222" }}>
                  {TABS.map(t => (
                    <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={activeTab===t.id} aria-controls={`tabpanel-${t.id}`}
                      onClick={()=>setActiveTab(t.id)}
                      style={{ padding:"13px 8px", border:"none", borderBottom:activeTab===t.id?"2px solid #d4a017":"2px solid transparent",
                        background:"none", color:activeTab===t.id?"#d4a017":"#555", fontSize:12, fontWeight:600, cursor:"pointer",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <span aria-hidden="true" style={{ fontSize:18 }}>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} style={{ padding:20 }}>
                  {PANEL_TABS[activeTab]}
                </div>
              </div>
            </div>

          </div>
        </main>

        <footer style={{ background:"#000", borderTop:"1px solid #1a1a1a", padding:"32px 24px", textAlign:"center", color:"#444", fontSize:13 }}>
          © 2025 UrbanCops. Todos los derechos reservados.
        </footer>
      </div>
    </>
  );
}