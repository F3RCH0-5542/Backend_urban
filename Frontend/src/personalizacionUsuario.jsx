import React, { useState } from "react";
import { createPersonalizacion } from "./services/personalizacionService";

const LOGOS = [
  { id: "none",    label: "Sin logo",   svg: null },
  { id: "star",    label: "Estrella",   svg: "⭐" },
  { id: "crown",   label: "Corona",     svg: "👑" },
  { id: "fire",    label: "Fuego",      svg: "🔥" },
  { id: "bolt",    label: "Rayo",       svg: "⚡" },
  { id: "diamond", label: "Diamante",   svg: "💎" },
  { id: "skull",   label: "Skull",      svg: "💀" },
  { id: "lion",    label: "León",       svg: "🦁" },
  { id: "wolf",    label: "Lobo",       svg: "🐺" },
];

const COLORS = [
  { hex: "#1a1a1a", name: "Negro"        },
  { hex: "#2c2c54", name: "Azul Marino"  },
  { hex: "#c0392b", name: "Rojo"         },
  { hex: "#27ae60", name: "Verde"        },
  { hex: "#f39c12", name: "Naranja"      },
  { hex: "#8e44ad", name: "Púrpura"      },
  { hex: "#ecf0f1", name: "Blanco"       },
  { hex: "#795548", name: "Café"         },
  { hex: "#00bcd4", name: "Cian"         },
  { hex: "#e91e63", name: "Rosa"         },
  { hex: "#607d8b", name: "Gris Azul"    },
  { hex: "#ff5722", name: "Coral"        },
];

const VISOR_COLORS = [
  { hex: "#1a1a1a", name: "Negro"   },
  { hex: "#ecf0f1", name: "Blanco"  },
  { hex: "#c0392b", name: "Rojo"    },
  { hex: "#2c2c54", name: "Marino"  },
  { hex: "#795548", name: "Café"    },
  { hex: "#f39c12", name: "Naranja" },
];

const TALLAS = ["XS", "S", "M", "L", "XL", "XXL"];

const ESTILOS = [
  { id: "snapback", label: "Snapback" },
  { id: "trucker",  label: "Trucker"  },
  { id: "fitted",   label: "Fitted"   },
  { id: "dad",      label: "Dad Hat"  },
];

// ✅ Mapeo de estilo de gorra al tipo que acepta el backend
const TIPO_MAP = {
  snapback: "bordado",
  trucker:  "bordado",
  fitted:   "estampado",
  dad:      "otro",
};

// ── Gorra SVG ─────────────────────────────────────────────────────────────────
function GorraSVG({ color, visorColor, logo, texto, textoColor }) {
  return (
    <svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 360, filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.5))" }}>
      <ellipse cx="150" cy="205" rx="110" ry="12" fill="rgba(0,0,0,0.25)" />
      <path d="M 50 130 Q 50 50 150 45 Q 250 50 250 130 Z" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <path d="M 150 45 Q 160 88 155 130" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      <path d="M 150 45 Q 140 88 145 130" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
      <circle cx="150" cy="48" r="6" fill={visorColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <path d="M 52 132 Q 150 128 248 132 Q 248 142 150 144 Q 52 142 52 132 Z" fill={visorColor} opacity="0.85" />
      <path d="M 70 138 Q 150 148 230 138 Q 240 155 220 165 Q 150 172 80 165 Q 60 155 70 138 Z" fill={visorColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <path d="M 75 143 Q 150 152 225 143" stroke="rgba(0,0,0,0.12)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
      <path d="M 100 65 Q 130 55 170 62" stroke="rgba(255,255,255,0.18)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {logo && logo !== "none" && (
        <text x="150" y="105" textAnchor="middle" fontSize="36" style={{ userSelect: "none" }}>
          {LOGOS.find(l => l.id === logo)?.svg}
        </text>
      )}
      {texto && (
        <text x="150" y={logo && logo !== "none" ? "125" : "110"} textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif" fill={textoColor} letterSpacing="1">
          {texto.toUpperCase().slice(0, 10)}
        </text>
      )}
    </svg>
  );
}

// ── Modal de confirmación de pedido ───────────────────────────────────────────
function ModalPedido({ config, precio, onClose, onConfirmar, enviando }) {
  const logoInfo   = LOGOS.find(l => l.id === config.logo);
  const colorInfo  = COLORS.find(c => c.hex === config.color) || { name: "Personalizado" };
  const visorInfo  = VISOR_COLORS.find(c => c.hex === config.visorColor) || { name: "Personalizado" };
  const estiloInfo = ESTILOS.find(e => e.id === config.estilo);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: "#111", border: "1px solid #2a2a2a", borderRadius: 18,
        maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto",
        padding: 28,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>
            ✅ Confirmar Pedido
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        {/* Preview pequeño */}
        <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "20px 16px", marginBottom: 20, textAlign: "center" }}>
          <GorraSVG
            color={config.color}
            visorColor={config.visorColor}
            logo={config.logo}
            texto={config.texto}
            textoColor={config.textoColor}
          />
        </div>

        {/* Resumen de parámetros */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            Detalle de la personalización
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Estilo",        value: estiloInfo?.label },
              { label: "Talla",         value: config.talla },
              { label: "Color gorra",   value: colorInfo.name },
              { label: "Color visera",  value: visorInfo.name },
              { label: "Logo",          value: `${logoInfo?.svg || ""} ${logoInfo?.label}`.trim() },
              { label: "Texto",         value: config.texto ? config.texto.toUpperCase() : "Ninguno" },
              { label: "Cantidad",      value: config.cantidad },
              { label: "Precio unit.",  value: `$${precio.toLocaleString("es-CO")} COP` },
            ].map(item => (
              <div key={item.label} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, padding: "9px 12px" }}>
                <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.25)", borderRadius: 10, padding: "12px 18px", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: 13 }}>TOTAL DEL PEDIDO</span>
          <span style={{ color: "#d4a017", fontSize: 24, fontWeight: 800 }}>
            ${(precio * config.cantidad).toLocaleString("es-CO")} COP
          </span>
        </div>

        {/* Descripción auto-generada (editable) */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            Descripción del pedido
          </div>
          <textarea
            id="descripcion-pedido"
            defaultValue={`Gorra ${estiloInfo?.label} talla ${config.talla}, color ${colorInfo.name}, visera ${visorInfo.name}${config.logo !== "none" ? `, logo ${logoInfo?.label}` : ""}${config.texto ? `, texto "${config.texto.toUpperCase()}"` : ""}. Cantidad: ${config.cantidad}.`}
            rows={3}
            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, padding: "11px 14px", color: "#ccc", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Botones */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={enviando}
            style={{ padding: "13px", borderRadius: 10, border: "1px solid #2a2a2a", background: "#0d0d0d", color: "#888", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const desc = document.getElementById("descripcion-pedido").value;
              onConfirmar(desc);
            }}
            disabled={enviando}
            style={{
              padding: "13px", borderRadius: 10, border: "none",
              background: enviando ? "#555" : "#7c3aed",
              color: "#fff", fontSize: 14, fontWeight: 800, cursor: enviando ? "not-allowed" : "pointer", letterSpacing: 0.5,
            }}
          >
            {enviando ? "⏳ Enviando..." : "✨ Crear Personalización"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function Personalizacion() {
  const [config, setConfig] = useState({
    color:      "#1a1a1a",
    visorColor: "#1a1a1a",
    logo:       "none",
    texto:      "",
    textoColor: "#ffffff",
    talla:      "M",
    estilo:     "snapback",
    cantidad:   1,
  });
  const [activeTab, setActiveTab] = useState("color");
  const [showModal, setShowModal] = useState(false);
  const [enviado,   setEnviado]   = useState(false);
  const [enviando,  setEnviando]  = useState(false); // ✅ estado de carga

  const set = (key, val) => setConfig(c => ({ ...c, [key]: val }));

  const precioBase = { snapback: 85000, trucker: 75000, fitted: 95000, dad: 70000 };
  const precio = precioBase[config.estilo]
    + (config.logo !== "none" ? 10000 : 0)
    + (config.texto           ? 8000  : 0);

  // ✅ CORREGIDO: ahora guarda en la BD vía API real
  const guardarEnAdmin = async (descripcion) => {
    const logoInfo  = LOGOS.find(l => l.id === config.logo);
    const colorInfo = COLORS.find(c => c.hex === config.color) || { name: "Personalizado" };
    const visorInfo = VISOR_COLORS.find(c => c.hex === config.visorColor) || { name: "Personalizado" };

    // Construir color_deseado como texto descriptivo
    const colorDeseado = [
      `Gorra: ${colorInfo.name}`,
      `Visera: ${visorInfo.name}`,
      config.logo !== "none" ? `Logo: ${logoInfo?.label}` : null,
      config.texto ? `Texto: ${config.texto.toUpperCase()} (color: ${config.textoColor})` : null,
    ].filter(Boolean).join(" | ");

    const payload = {
      tipo_personalizacion:        TIPO_MAP[config.estilo] || "otro",
      descripcion_personalizacion: descripcion,
      color_deseado:               colorDeseado,
      talla:                       config.talla,
      precio_adicional:            (config.logo !== "none" ? 10000 : 0) + (config.texto ? 8000 : 0),
    };

    try {
      setEnviando(true);
      await createPersonalizacion(payload);
      setShowModal(false);
      setEnviado(true);
      setTimeout(() => setEnviado(false), 3000);
    } catch (err) {
      const mensaje = err?.msg || err?.message || "Error al enviar la personalización";
      alert("❌ " + mensaje);
    } finally {
      setEnviando(false);
    }
  };

  const tabs = [
    { id: "color", label: "Color", icon: "🎨" },
    { id: "logo",  label: "Logo",  icon: "✨" },
    { id: "texto", label: "Texto", icon: "✏️" },
    { id: "talla", label: "Talla", icon: "📐" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Modal */}
      {showModal && (
        <ModalPedido
          config={config}
          precio={precio}
          onClose={() => !enviando && setShowModal(false)}
          onConfirmar={guardarEnAdmin}
          enviando={enviando}
        />
      )}

      {/* NAVBAR */}
      <nav style={{ background: "#111", borderBottom: "1px solid #222", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 800, color: "#fff", textDecoration: "none", letterSpacing: 1 }}>
          URBAN CAPS
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/login"   style={{ color: "#aaa", textDecoration: "none", fontSize: 22 }}><i className="bi bi-person" /></a>
          <a href="/carrito" style={{ color: "#aaa", textDecoration: "none", fontSize: 22 }}><i className="bi bi-cart" /></a>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ textAlign: "center", padding: "32px 20px 16px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: 1 }}>🎨 DISEÑA TU GORRA</h1>
        <p style={{ color: "#666", fontSize: 15 }}>Personaliza cada detalle en tiempo real</p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 32, alignItems: "start" }}>

        {/* ── PANEL IZQUIERDO: Preview ── */}
        <div style={{ position: "sticky", top: 80 }}>
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 16, padding: 32, textAlign: "center" }}>

            <div style={{ background: "#0d0d0d", borderRadius: 12, padding: "32px 16px", marginBottom: 24 }}>
              <GorraSVG
                color={config.color}
                visorColor={config.visorColor}
                logo={config.logo}
                texto={config.texto}
                textoColor={config.textoColor}
              />
            </div>

            {/* Info del diseño */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Estilo",  value: ESTILOS.find(e => e.id === config.estilo)?.label },
                { label: "Talla",   value: config.talla },
                { label: "Color",   value: COLORS.find(c => c.hex === config.color)?.name || "Personalizado" },
                { label: "Logo",    value: LOGOS.find(l => l.id === config.logo)?.label },
              ].map(item => (
                <div key={item.label} style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 8, padding: "10px 14px", textAlign: "left" }}>
                  <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ddd" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Precio */}
            <div style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.25)", borderRadius: 10, padding: "14px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>PRECIO TOTAL</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#d4a017" }}>
                ${precio.toLocaleString("es-CO")} COP
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                {config.logo !== "none" && "+ $10.000 logo  "}
                {config.texto && "+ $8.000 texto"}
              </div>
            </div>

            {/* Cantidad */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16 }}>
              <button onClick={() => set("cantidad", Math.max(1, config.cantidad - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", background: "#1a1a1a", color: "#fff", fontSize: 18, cursor: "pointer" }}>−</button>
              <span style={{ fontSize: 20, fontWeight: 700, minWidth: 32, textAlign: "center" }}>{config.cantidad}</span>
              <button onClick={() => set("cantidad", config.cantidad + 1)}             style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #333", background: "#1a1a1a", color: "#fff", fontSize: 18, cursor: "pointer" }}>+</button>
            </div>

            {/* ── BOTÓN PRINCIPAL ── */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                width: "100%", padding: "14px", borderRadius: 10, border: "none",
                background: enviado ? "#27ae60" : "#7c3aed",
                color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                letterSpacing: 1, transition: "all 0.3s",
              }}
            >
              {enviado ? "✅ ¡PERSONALIZACIÓN ENVIADA!" : "✨ ENVIAR PERSONALIZACIÓN"}
            </button>

            {enviado && (
              <p style={{ color: "#555", fontSize: 12, marginTop: 10 }}>
                Pedido guardado correctamente en la base de datos
              </p>
            )}
          </div>
        </div>

        {/* ── PANEL DERECHO: Controles ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Estilo de gorra */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Estilo de gorra</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ESTILOS.map(e => (
                <button key={e.id} onClick={() => set("estilo", e.id)}
                  style={{ padding: "10px 14px", borderRadius: 8, border: config.estilo === e.id ? "2px solid #d4a017" : "1px solid #2a2a2a", background: config.estilo === e.id ? "rgba(212,160,23,0.1)" : "#0d0d0d", color: config.estilo === e.id ? "#d4a017" : "#888", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #222" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ padding: "13px 8px", border: "none", borderBottom: activeTab === t.id ? "2px solid #d4a017" : "2px solid transparent", background: "none", color: activeTab === t.id ? "#d4a017" : "#555", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: 20 }}>

              {/* TAB COLOR */}
              {activeTab === "color" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>COLOR DE LA GORRA</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 20 }}>
                    {COLORS.map(c => (
                      <button key={c.hex} title={c.name} onClick={() => set("color", c.hex)}
                        style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: config.color === c.hex ? "3px solid #d4a017" : "2px solid #2a2a2a", background: c.hex, cursor: "pointer", transition: "transform 0.15s", transform: config.color === c.hex ? "scale(1.15)" : "scale(1)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>COLOR DE LA VISERA</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 16 }}>
                    {VISOR_COLORS.map(c => (
                      <button key={c.hex} title={c.name} onClick={() => set("visorColor", c.hex)}
                        style={{ width: "100%", aspectRatio: "1", borderRadius: 8, border: config.visorColor === c.hex ? "3px solid #d4a017" : "2px solid #2a2a2a", background: c.hex, cursor: "pointer", transition: "transform 0.15s", transform: config.visorColor === c.hex ? "scale(1.15)" : "scale(1)" }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>COLOR PERSONALIZADO</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input type="color" value={config.color} onChange={e => set("color", e.target.value)}
                      style={{ width: 48, height: 40, borderRadius: 8, border: "1px solid #333", background: "none", cursor: "pointer", padding: 2 }} />
                    <span style={{ fontSize: 13, color: "#666" }}>Elige cualquier color</span>
                  </div>
                </div>
              )}

              {/* TAB LOGO */}
              {activeTab === "logo" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>ELIGE UN LOGO (+$10.000)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {LOGOS.map(l => (
                      <button key={l.id} onClick={() => set("logo", l.id)}
                        style={{ padding: "14px 8px", borderRadius: 10, border: config.logo === l.id ? "2px solid #d4a017" : "1px solid #2a2a2a", background: config.logo === l.id ? "rgba(212,160,23,0.1)" : "#0d0d0d", color: config.logo === l.id ? "#d4a017" : "#777", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                        <span style={{ fontSize: 28 }}>{l.svg || "✖"}</span>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB TEXTO */}
              {activeTab === "texto" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>TEXTO EN LA GORRA (+$8.000, máx 10 caracteres)</div>
                  <input type="text" maxLength={10} value={config.texto} onChange={e => set("texto", e.target.value)}
                    placeholder="Ej: URBAN, tu nombre..."
                    style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, padding: "11px 14px", color: "#fff", fontSize: 15, outline: "none", marginBottom: 16, letterSpacing: 1, fontWeight: 600, boxSizing: "border-box" }} />
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>COLOR DEL TEXTO</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["#ffffff","#000000","#d4a017","#c0392b","#27ae60","#3498db","#e91e63","#ff5722"].map(c => (
                      <button key={c} onClick={() => set("textoColor", c)}
                        style={{ width: 34, height: 34, borderRadius: 6, border: config.textoColor === c ? "3px solid #d4a017" : "2px solid #2a2a2a", background: c, cursor: "pointer", transition: "transform 0.15s", transform: config.textoColor === c ? "scale(1.2)" : "scale(1)" }} />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB TALLA */}
              {activeTab === "talla" && (
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>SELECCIONA TU TALLA</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                    {TALLAS.map(t => (
                      <button key={t} onClick={() => set("talla", t)}
                        style={{ padding: "16px 8px", borderRadius: 10, border: config.talla === t ? "2px solid #d4a017" : "1px solid #2a2a2a", background: config.talla === t ? "rgba(212,160,23,0.1)" : "#0d0d0d", color: config.talla === t ? "#d4a017" : "#888", fontSize: 18, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div style={{ background: "#0d0d0d", border: "1px solid #1e1e1e", borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>GUÍA DE TALLAS</div>
                    {[["XS","52-53 cm"],["S","54-55 cm"],["M","56-57 cm"],["L","58-59 cm"],["XL","60-61 cm"],["XXL","62+ cm"]].map(([t, med]) => (
                      <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1a1a1a", fontSize: 13 }}>
                        <span style={{ color: config.talla === t ? "#d4a017" : "#555", fontWeight: config.talla === t ? 700 : 400 }}>{t}</span>
                        <span style={{ color: "#444" }}>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#000", borderTop: "1px solid #1a1a1a", padding: "32px 24px", textAlign: "center", color: "#444", fontSize: 13 }}>
        © 2025 UrbanCops. Todos los derechos reservados.
      </footer>
    </div>
  );
}