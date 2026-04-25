import { useState } from 'react'
import { ESTADO_CFG, SHIRT_COLORS_LABELS, fmtGs } from '../lib/constants'
import AppBar from './AppBar'
import Btn from './Btn'
import SLabel from './SLabel'
import Alert from './Alert'
import Badge from './Badge'
import Icon from './Icon'

const MOCK_QUOTES = [
  { id: 1, codigo: 'UY-2026-1042', fecha: '2026-04-24', cliente: 'Carlos Benítez', telefono: '0981 234 567', calidad: 'Superior', total: 1430000, estado: 'nuevo', talles: { S: 5, M: 10, L: 8, XL: 4, XXL: 0 }, colorRemera: 'azul_marino', colores: 3, entrega: 'Estándar', notas: '' },
  { id: 2, codigo: 'UY-2026-0987', fecha: '2026-04-23', cliente: 'Empresa TechPY', telefono: '0991 876 543', calidad: 'Premium', total: 3800000, estado: 'contactado', talles: { S: 0, M: 15, L: 20, XL: 10, XXL: 5 }, colorRemera: 'negro', colores: 2, entrega: 'Express', notas: 'Requiere muestra previa.' },
  { id: 3, codigo: 'UY-2026-0931', fecha: '2026-04-22', cliente: 'Ana Torres', telefono: '0972 345 678', calidad: 'Económica', total: 540000, estado: 'en_produccion', talles: { S: 8, M: 6, L: 4, XL: 2, XXL: 0 }, colorRemera: 'blanco', colores: 1, entrega: 'Rápido', notas: '' },
  { id: 4, codigo: 'UY-2026-0892', fecha: '2026-04-20', cliente: 'Club Olimpia', telefono: '0985 111 222', calidad: 'Superior', total: 2600000, estado: 'completado', talles: { S: 5, M: 10, L: 15, XL: 8, XXL: 2 }, colorRemera: 'verde', colores: 4, entrega: 'Estándar', notas: 'Entregado el 19/04.' },
  { id: 5, codigo: 'UY-2026-0845', fecha: '2026-04-18', cliente: 'Laura Duarte', telefono: '0961 555 444', calidad: 'Premium', total: 570000, estado: 'cancelado', talles: { S: 2, M: 3, L: 1, XL: 0, XXL: 0 }, colorRemera: 'rojo', colores: 2, entrega: 'Express', notas: 'Cliente canceló.' },
]

export function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const submit = () => {
    if (pass === 'admin123') onLogin()
    else setErr('Contraseña incorrecta.')
  }
  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1D6BFF,#0A3FCC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="zap" size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#E8EEFF' }}>UniformesYA</span>
          </div>
          <div style={{ fontSize: 13, color: '#7A96BF' }}>Panel de administración</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#7A96BF', display: 'block', marginBottom: 8 }}>Contraseña</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="••••••••"
            style={{ width: '100%', background: '#111E35', border: `1px solid ${err ? '#FF4D6A' : '#1C3050'}`, borderRadius: 10, padding: '14px 16px', fontSize: 15, color: '#E8EEFF', fontFamily: 'inherit', outline: 'none' }} />
          {err && <div style={{ fontSize: 12, color: '#FF4D6A', marginTop: 6 }}>{err}</div>}
        </div>
        <Btn fullWidth onClick={submit}>Ingresar</Btn>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#3D5878', marginTop: 14 }}>Demo: contraseña "admin123"</div>
      </div>
    </div>
  )
}

export function AdminList({ onSelect, onLogout }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')

  const filtered = MOCK_QUOTES.filter(q => {
    const matchFilter = filter === 'todos' || q.estado === filter
    const matchSearch = !search || q.codigo.toLowerCase().includes(search.toLowerCase()) || q.cliente.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Cotizaciones" rightAction={
        <button onClick={onLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#7A96BF', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'inherit' }}>
          <Icon name="logout" size={16} color="#7A96BF" /> Salir
        </button>
      } />

      <div style={{ padding: '18px 18px 0' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon name="search" size={16} color="#3D5878" />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por código o cliente…"
            style={{ width: '100%', background: '#111E35', border: '1px solid #1C3050', borderRadius: 10, padding: '12px 14px 12px 38px', fontSize: 14, color: '#E8EEFF', fontFamily: 'inherit', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[['todos', 'Todos'], ...Object.entries(ESTADO_CFG).map(([k, v]) => [k, v.label])].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, background: filter === id ? '#1D6BFF' : '#111E35', color: filter === id ? '#fff' : '#7A96BF' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: '#3D5878', padding: 40, fontSize: 14 }}>No hay cotizaciones que coincidan.</div>
        )}
        {filtered.map(q => {
          const ec = ESTADO_CFG[q.estado]
          return (
            <div key={q.id} onClick={() => onSelect(q)}
              style={{ background: '#111E35', border: '1px solid #1C3050', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.12s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#E8EEFF', marginBottom: 3 }}>{q.cliente}</div>
                  <div style={{ fontSize: 11, color: '#3D5878', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{q.codigo}</div>
                </div>
                <Badge color={ec.color}>{ec.label}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: '#7A96BF' }}>{q.fecha} · {q.calidad} · {q.entrega}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1D6BFF' }}>{fmtGs(q.total)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AdminDetail({ quote: initialQuote, onBack }) {
  const [quote, setQuote] = useState(initialQuote)
  const [notes, setNotes] = useState(initialQuote.notas || '')
  const [saved, setSaved] = useState(false)
  const ec = ESTADO_CFG[quote.estado]
  const totalTalles = Object.values(quote.talles).reduce((a, b) => a + b, 0)

  const saveNotes = () => {
    setQuote(q => ({ ...q, notas: notes }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const cardStyle = { background: '#111E35', border: '1px solid #1C3050', borderRadius: 14, padding: '18px' }
  const rowStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #0E1A2E' }

  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title={quote.codigo} onBack={onBack} rightAction={<Badge color={ec.color}>{ec.label}</Badge>} />

      <div style={{ flex: 1, padding: '24px 18px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={cardStyle}>
          <SLabel>Cliente</SLabel>
          {[['Nombre', quote.cliente], ['Teléfono', quote.telefono], ['Fecha', quote.fecha]].map(([k, v]) => (
            <div key={k} style={rowStyle}>
              <span style={{ fontSize: 13, color: '#7A96BF' }}>{k}</span>
              <span style={{ fontSize: 13, color: '#E8EEFF', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <SLabel>Pedido</SLabel>
          {[
            ['Color remera', SHIRT_COLORS_LABELS[quote.colorRemera] || quote.colorRemera],
            ['Calidad', quote.calidad],
            ['Colores de diseño', `${quote.colores}`],
            ['Tiempo de entrega', quote.entrega],
            ['Talles', Object.entries(quote.talles).filter(([, v]) => v > 0).map(([s, v]) => `${s}:${v}`).join(' · ')],
            ['Total unidades', `${totalTalles}`],
            ['Total', fmtGs(quote.total)],
          ].map(([k, v]) => (
            <div key={k} style={rowStyle}>
              <span style={{ fontSize: 13, color: '#7A96BF' }}>{k}</span>
              <span style={{ fontSize: 13, color: '#E8EEFF', fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{v}</span>
            </div>
          ))}
        </div>

        <div>
          <SLabel>Estado del pedido</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(ESTADO_CFG).map(([id, cfg]) => (
              <div key={id} onClick={() => setQuote(q => ({ ...q, estado: id }))}
                style={{ padding: '13px 16px', borderRadius: 12, cursor: 'pointer', border: quote.estado === id ? `1.5px solid ${cfg.color}` : '1px solid #1C3050', background: quote.estado === id ? cfg.color + '18' : '#111E35', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: quote.estado === id ? cfg.color : '#3D5878', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: quote.estado === id ? 700 : 400, color: quote.estado === id ? cfg.color : '#E8EEFF' }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SLabel>Notas internas</SLabel>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
            placeholder="Escribí notas internas sobre este pedido…"
            style={{ width: '100%', background: '#111E35', border: '1px solid #1C3050', borderRadius: 10, padding: '13px 14px', fontSize: 14, color: '#E8EEFF', fontFamily: 'inherit', resize: 'vertical', outline: 'none', lineHeight: 1.6 }} />
          <div style={{ marginTop: 10 }}>
            {saved
              ? <Alert type="success">Notas guardadas.</Alert>
              : <Btn variant="secondary" small onClick={saveNotes}>Guardar notas</Btn>
            }
          </div>
        </div>

        <Btn icon="whatsapp" variant="success" fullWidth
          onClick={() => window.open(`https://wa.me/595${quote.telefono.replace(/\D/g, '')}`, '_blank')}>
          Contactar por WhatsApp
        </Btn>
      </div>
    </div>
  )
}
