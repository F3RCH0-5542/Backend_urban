// src/micuenta.jsx
import { useState, useEffect } from 'react';

const API = 'http://localhost:3001';
const getToken = () => localStorage.getItem('token');

const TABS = [
  { id: 'pedidos',    label: 'Pedidos',     icon: 'bi bi-bag-check' },
  { id: 'personaliz', label: 'Personaliz.', icon: 'bi bi-palette'   },
  { id: 'pqrs',       label: 'PQRS',        icon: 'bi bi-chat-dots' },
  { id: 'perfil',     label: 'Perfil',      icon: 'bi bi-person'    },
];

export default function MiCuenta() {
  const [tab, setTab]                       = useState('pedidos');
  const [usuario, setUsuario]               = useState(null);
  const [pedidos, setPedidos]               = useState([]);
  const [personalizaciones, setPersonaliz]  = useState([]);
  const [misPqrs, setMisPqrs]               = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [loadingPersonaliz, setLoadingPers] = useState(true);
  const [loadingPqrs, setLoadingPqrs]       = useState(true);
  const [pqrsForm, setPqrsForm]             = useState({ tipo: 'Peticion', asunto: '', mensaje: '' });
  const [enviando, setEnviando]             = useState(false);
  const [pqrsOk, setPqrsOk]                 = useState('');
  const [pqrsErr, setPqrsErr]               = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuarioLogueado');
      if (!raw) { window.location.href = '/login'; return; }
      const u = JSON.parse(raw);
      setUsuario(u);
      // ✅ Fix: fetchPedidos no recibe argumento (no lo usaba)
      fetchPedidos();
      fetchPersonaliz(u.id || u.id_usuario);
      fetchPqrs(u.id || u.id_usuario);
    } catch {
      window.location.href = '/login';
    }
  }, []);

  // ✅ Fix: sin parámetro id (no se usaba)
  const fetchPedidos = async () => {
    try {
      const res = await fetch(`${API}/api/pedidos/mis-pedidos`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) { setPedidos([]); return; }
      const data = await res.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('❌ Fetch pedidos falló:', e);
      setPedidos([]);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const fetchPersonaliz = async (id) => {
    try {
      const res = await fetch(`${API}/api/personalizaciones/usuario/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) { setPersonaliz([]); return; }
      const data = await res.json();
      setPersonaliz(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('❌ Fetch personaliz falló:', e);
      setPersonaliz([]);
    } finally {
      setLoadingPers(false);
    }
  };

  const fetchPqrs = async (id) => {
    try {
      const res = await fetch(`${API}/api/pqrs/usuario/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) { setMisPqrs([]); return; }
      const data = await res.json();
      setMisPqrs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('❌ Fetch pqrs falló:', e);
      setMisPqrs([]);
    } finally {
      setLoadingPqrs(false);
    }
  };

  const enviarPqrs = async () => {
    setPqrsErr(''); setPqrsOk('');
    if (!pqrsForm.asunto.trim() || !pqrsForm.mensaje.trim()) {
      setPqrsErr('Completa todos los campos.'); return;
    }
    setEnviando(true);
    try {
      const res = await fetch(`${API}/api/pqrs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nombre:      usuario.nombre,
          correo:      usuario.email || usuario.correo || '',
          tipo_pqrs:   pqrsForm.tipo,
          descripcion: `${pqrsForm.asunto} — ${pqrsForm.mensaje}`,
          estado:      'Pendiente',
          respuesta:   '',
          id_usuario:  usuario.id || usuario.id_usuario,
        }),
      });
      if (!res.ok) throw new Error();
      const num = Math.floor(100000 + Math.random() * 900000);
      setPqrsOk(`✅ Enviado. Seguimiento: #${num}`);
      setPqrsForm({ tipo: 'Peticion', asunto: '', mensaje: '' });
      fetchPqrs(usuario.id || usuario.id_usuario);
    } catch {
      setPqrsErr('Error al enviar. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const fmt = (v) => Number(v) === 0 ? '$0' : '$' + Number(v).toLocaleString('es-CO');

  const badge = (estado = 'pendiente') => {
    const m = {
      pendiente:  ['rgba(212,160,23,0.15)', '#d4a017', 'rgba(212,160,23,0.4)'],
      PENDIENTE:  ['rgba(212,160,23,0.15)', '#d4a017', 'rgba(212,160,23,0.4)'],
      Pendiente:  ['rgba(212,160,23,0.15)', '#d4a017', 'rgba(212,160,23,0.4)'],
      en_proceso: ['rgba(99,102,241,0.15)', '#818cf8', 'rgba(99,102,241,0.4)'],
      enviado:    ['rgba(59,130,246,0.15)', '#60a5fa', 'rgba(59,130,246,0.4)'],
      completado: ['rgba(0,212,180,0.12)',  '#00d4b4', 'rgba(0,212,180,0.35)'],
      COMPLETADO: ['rgba(0,212,180,0.12)',  '#00d4b4', 'rgba(0,212,180,0.35)'],
      Respondido: ['rgba(0,212,180,0.12)',  '#00d4b4', 'rgba(0,212,180,0.35)'],
      cancelado:  ['rgba(220,53,69,0.12)',  '#dc3545', 'rgba(220,53,69,0.35)'],
      CANCELADO:  ['rgba(220,53,69,0.12)',  '#dc3545', 'rgba(220,53,69,0.35)'],
    };
    const [bg, color, border] = m[estado] || m.pendiente;
    return {
      fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '2px 7px',
      borderRadius: 3, textTransform: 'uppercase',
      background: bg, color, border: `1px solid ${border}`,
    };
  };

  const initials = (n = '') => n.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();

  const S = {
    wrap:   { background: '#0a0a0a', minHeight: '100vh', fontFamily: "'Barlow','Segoe UI',sans-serif", color: '#e0e0e0' },
    topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#111', borderBottom: '1px solid #2a2a2a' },
    tbL:    { display: 'flex', alignItems: 'center', gap: 12 },
    bkBtn:  { background: 'none', border: 'none', color: '#e0e0e0', cursor: 'pointer', fontSize: 22 },
    ttl:    { fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 1, color: '#fff', margin: 0 },
    sub:    { fontSize: 12, color: '#666', margin: 0 },
    hBtn:   { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 20 },
    tabs:   { display: 'flex', background: '#111', borderBottom: '1px solid #2a2a2a' },
    tab: a => ({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '13px 6px', background: 'none', border: 'none', borderBottom: a ? '2px solid #d4a017' : '2px solid transparent', color: a ? '#d4a017' : '#666', cursor: 'pointer', fontSize: 11, fontWeight: 500, transition: 'color .2s' }),
    cnt:    { padding: 16 },
    card:   { display: 'flex', alignItems: 'center', background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: '14px 16px', marginBottom: 10 },
    ico:    { width: 40, height: 40, background: '#1e1800', border: '1.5px solid #d4a017', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#d4a017', fontSize: 17 },
    icoB:   { width: 40, height: 40, background: '#001e1a', border: '1.5px solid #00d4b4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#00d4b4', fontSize: 17 },
    cInfo:  { flex: 1, marginLeft: 14 },
    cHead:  { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' },
    cNum:   { fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, color: '#fff' },
    cDate:  { fontSize: 12, color: '#666' },
    cDesc:  { fontSize: 12, color: '#888', marginTop: 2 },
    amt: v => ({ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 700, color: Number(v) === 0 ? '#666' : '#00d4b4', flexShrink: 0 }),
    empty:  { textAlign: 'center', padding: '60px 20px', color: '#555' },
    eIco:   { fontSize: 44, marginBottom: 14, opacity: 0.35 },
    load:   { color: '#666', textAlign: 'center', paddingTop: 40, fontSize: 14 },
    lbl:    { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: '#888', marginBottom: 5, textTransform: 'uppercase' },
    inp:    { width: '100%', background: '#161616', border: '1px solid #2a2a2a', borderRadius: 6, padding: '9px 13px', color: '#e0e0e0', fontFamily: 'inherit', fontSize: 14, outline: 'none', marginBottom: 14 },
    btnG:   { background: '#d4a017', color: '#000', border: 'none', borderRadius: 6, padding: '10px 28px', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer' },
    aOk:    { background: 'rgba(0,212,180,0.1)', border: '1px solid rgba(0,212,180,0.3)', color: '#00d4b4', borderRadius: 6, padding: '10px 14px', fontSize: 13, marginBottom: 14 },
    aErr:   { background: 'rgba(220,53,69,0.1)',  border: '1px solid rgba(220,53,69,0.3)',  color: '#dc3545', borderRadius: 6, padding: '10px 14px', fontSize: 13, marginBottom: 14 },
    pCard:  { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 10, padding: 24, maxWidth: 400 },
    ava:    { width: 60, height: 60, background: 'linear-gradient(135deg,#d4a017,#b8860b)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 700, color: '#000', marginBottom: 14 },
    pNom:   { fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 700, color: '#fff' },
    pMail:  { fontSize: 13, color: '#666', marginTop: 3 },
    div:    { border: 'none', borderTop: '1px solid #2a2a2a', margin: '18px 0' },
    sRow:   { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
    sLbl:   { fontSize: 13, color: '#666' },
    sVal:   { fontSize: 13, fontWeight: 600 },
  };

  return (
    <div style={S.wrap}>

      {/* TOPBAR */}
      <div style={S.topbar}>
        <div style={S.tbL}>
          <button style={S.bkBtn} onClick={() => window.history.back()}>&#8592;</button>
          <div>
            <p style={S.ttl}>MI CUENTA</p>
            <p style={S.sub}>{usuario?.nombre || '...'}</p>
          </div>
        </div>
        <button style={S.hBtn} onClick={() => window.location.href = '/'}>
          <i className="bi bi-house"></i>
        </button>
      </div>

      {/* TABS */}
      <div style={S.tabs}>
        {TABS.map(t => (
          <button key={t.id} style={S.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            <i className={t.icon} style={{ fontSize: 17 }}></i>
            {t.label}
          </button>
        ))}
      </div>

      <div style={S.cnt}>

        {/* ══ PEDIDOS ══ */}
        {tab === 'pedidos' && (
          loadingPedidos
            ? <p style={S.load}><span className="spinner-border spinner-border-sm me-2"></span>Cargando pedidos...</p>
            : pedidos.length === 0
              ? (
                <div style={S.empty}>
                  <div style={S.eIco}><i className="bi bi-bag-x"></i></div>
                  <p>No tienes pedidos aún</p>
                  <button style={{ ...S.btnG, marginTop: 16 }} onClick={() => window.location.href = '/'}>
                    Ver productos
                  </button>
                </div>
              )
              : pedidos.map(p => (
                // ✅ Fix: button en lugar de div con onClick
                <button
                  key={p.id_pedido}
                  style={{ ...S.card, width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => window.location.href = `/pedido/${p.id_pedido}`}
                >
                  <div style={S.ico}><i className="bi bi-bag-check"></i></div>
                  <div style={S.cInfo}>
                    <div style={S.cHead}>
                      <span style={S.cNum}>Pedido #{p.id_pedido}</span>
                      <span style={badge(p.estado)}>{p.estado}</span>
                    </div>
                    <div style={S.cDate}>
                      {p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleDateString('es-CO') : '—'}
                    </div>
                  </div>
                  <div style={S.amt(p.total)}>{fmt(p.total)}</div>
                </button>
              ))
        )}

        {/* ══ PERSONALIZ. ══ */}
        {tab === 'personaliz' && (
          loadingPersonaliz
            ? <p style={S.load}><span className="spinner-border spinner-border-sm me-2"></span>Cargando personalizaciones...</p>
            : personalizaciones.length === 0
              ? (
                <div style={S.empty}>
                  <div style={S.eIco}><i className="bi bi-palette"></i></div>
                  <p>No tienes personalizaciones aún</p>
                  <button style={{ ...S.btnG, marginTop: 20 }} onClick={() => window.location.href = '/personalizacion'}>
                    Crear Personalización
                  </button>
                </div>
              )
              : personalizaciones.map(p => (
                // ✅ Fix: div no interactivo — sin onClick, solo display
                <div key={p.id_personalizacion || p.id} style={S.card}>
                  <div style={S.ico}><i className="bi bi-palette2"></i></div>
                  <div style={S.cInfo}>
                    <div style={S.cHead}>
                      <span style={S.cNum}>{p.tipo_gorra || p.tipo_personalizacion || p.nombre || `Diseño #${p.id_personalizacion || p.id}`}</span>
                      <span style={badge(p.estado || 'pendiente')}>{p.estado || 'pendiente'}</span>
                    </div>
                    {p.diseno && <div style={S.cDesc}>Diseño: {p.diseno}</div>}
                    <div style={S.cDate}>
                      {p.fecha_solicitud || p.fecha || p.created_at
                        ? new Date(p.fecha_solicitud || p.fecha || p.created_at).toLocaleDateString('es-CO')
                        : '—'}
                    </div>
                  </div>
                  <div style={S.amt(p.precio_adicional || p.precio || 0)}>
                    {fmt(p.precio_adicional || p.precio || 0)}
                  </div>
                </div>
              ))
        )}

        {/* ══ PQRS ══ */}
        {tab === 'pqrs' && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, padding: 20, marginBottom: 24 }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                <i className="bi bi-plus-circle me-2" style={{ color: '#d4a017' }}></i>Nueva solicitud
              </p>

              {pqrsOk  && <div style={S.aOk}>{pqrsOk}</div>}
              {pqrsErr && <div style={S.aErr}>{pqrsErr}</div>}

              {/* ✅ Fix: label con htmlFor + id en cada control */}
              <label htmlFor="pqrs-tipo" style={S.lbl}>Tipo</label>
              <select
                id="pqrs-tipo"
                style={S.inp}
                value={pqrsForm.tipo}
                onChange={e => setPqrsForm(f => ({ ...f, tipo: e.target.value }))}
              >
                <option value="Peticion">Petición</option>
                <option value="Queja">Queja</option>
                <option value="Reclamo">Reclamo</option>
                <option value="Sugerencia">Sugerencia</option>
              </select>

              <label htmlFor="pqrs-asunto" style={S.lbl}>Asunto</label>
              <input
                id="pqrs-asunto"
                style={S.inp}
                type="text"
                placeholder="Describe brevemente tu solicitud"
                value={pqrsForm.asunto}
                onChange={e => setPqrsForm(f => ({ ...f, asunto: e.target.value }))}
              />

              <label htmlFor="pqrs-mensaje" style={S.lbl}>Mensaje</label>
              <textarea
                id="pqrs-mensaje"
                style={{ ...S.inp, resize: 'vertical', minHeight: 90 }}
                placeholder="Explica con detalle..."
                value={pqrsForm.mensaje}
                onChange={e => setPqrsForm(f => ({ ...f, mensaje: e.target.value }))}
              />

              <button style={{ ...S.btnG, opacity: enviando ? 0.6 : 1 }} onClick={enviarPqrs} disabled={enviando}>
                {enviando
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</>
                  : <><i className="bi bi-send-fill me-2"></i>Enviar PQRS</>}
              </button>
            </div>

            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
              <i className="bi bi-clock-history me-2" style={{ color: '#d4a017' }}></i>Mis solicitudes
            </p>

            {loadingPqrs
              ? <p style={S.load}>Cargando...</p>
              : misPqrs.length === 0
                ? <p style={{ color: '#555', fontSize: 13 }}>Sin solicitudes aún.</p>
                : misPqrs.map(q => (
                  // ✅ Fix: div no interactivo — sin onClick
                  <div
                    key={q.id_pqrs || q.id}
                    style={{ ...S.card, flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 6 }}>
                      <div style={S.icoB}><i className="bi bi-chat-dots"></i></div>
                      <div style={{ flex: 1 }}>
                        <div style={S.cHead}>
                          <span style={S.cNum}>{q.tipo_pqrs}</span>
                          <span style={badge(q.estado)}>{q.estado}</span>
                        </div>
                        <div style={S.cDate}>
                          {q.fecha_creacion || q.fecha || q.created_at
                            ? new Date(q.fecha_creacion || q.fecha || q.created_at).toLocaleDateString('es-CO')
                            : '—'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 6px 54px' }}>{q.descripcion}</p>
                    {q.respuesta && (
                      <div style={{ marginLeft: 54, background: 'rgba(0,212,180,0.08)', border: '1px solid rgba(0,212,180,0.2)', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#00d4b4' }}>
                        <i className="bi bi-reply-fill me-2"></i><strong>Respuesta:</strong> {q.respuesta}
                      </div>
                    )}
                  </div>
                ))
            }
          </div>
        )}

        {/* ══ PERFIL ══ */}
        {tab === 'perfil' && usuario && (
          <div style={S.pCard}>
            <div style={S.ava}>{initials(usuario.nombre)}</div>
            <div style={S.pNom}>{usuario.nombre}</div>
            <div style={S.pMail}>{usuario.email || usuario.correo}</div>
            <hr style={S.div} />
            <div style={S.sRow}><span style={S.sLbl}>Pedidos</span><span style={S.sVal}>{pedidos.length}</span></div>
            <div style={S.sRow}><span style={S.sLbl}>Personalizaciones</span><span style={S.sVal}>{personalizaciones.length}</span></div>
            <div style={S.sRow}><span style={S.sLbl}>PQRS</span><span style={S.sVal}>{misPqrs.length}</span></div>
            <div style={S.sRow}><span style={S.sLbl}>Estado</span><span style={{ ...S.sVal, color: '#00d4b4' }}>Activo</span></div>
            <hr style={S.div} />
            <button
              style={{ background: 'transparent', color: '#dc3545', border: '1px solid #dc3545', borderRadius: 6, padding: '10px 0', width: '100%', cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}
              onClick={() => {
                if (window.confirm('¿Cerrar sesión?')) {
                  localStorage.removeItem('usuarioLogueado');
                  localStorage.removeItem('token');
                  localStorage.removeItem('carritoUrbanCops');
                  window.location.href = '/';
                }
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
}