import { useState } from 'react'
import { ESTADO_CFG, SHIRT_COLORS_LABELS, fmtGs } from '../lib/constants'
import AppBar from './AppBar'
import Btn from './Btn'
import SLabel from './SLabel'
import Alert from './Alert'
import Badge from './Badge'
import Icon from './Icon'

const MOCK_QUOTES = [
  { id: 1, codigo: 'UY-2026-1042', fecha: '2026-04-24', cliente: 'Carlos Benitez', telefono: '0981 234 567', calidad: 'Superior', total: 1430000, estado: 'nuevo', talles: { S: 5, M: 10, L: 8, XL: 4, XXL: 0 }, colorRemera: 'azul_marino', colores: 3, entrega: 'Estandar', notas: '' },
  { id: 2, codigo: 'UY-2026-0987', fecha: '2026-04-23', cliente: 'Empresa TechPY', telefono: '0991 876 543', calidad: 'Premium', total: 3800000, estado: 'contactado', talles: { S: 0, M: 15, L: 20, XL: 10, XXL: 5 }, colorRemera: 'negro', colores: 2, entrega: 'Express', notas: 'Requiere muestra previa.' },
  { id: 3, codigo: 'UY-2026-0931', fecha: '2026-04-22', cliente: 'Ana Torres', telefono: '0972 345 678', calidad: 'Economica', total: 540000, estado: 'en_produccion', talles: { S: 8, M: 6, L: 4, XL: 2, XXL: 0 }, colorRemera: 'blanco', colores: 1, entrega: 'Rapido', notas: '' },
  { id: 4, codigo: 'UY-2026-0892', fecha: '2026-04-20', cliente: 'Club Olimpia', telefono: '0985 111 222', calidad: 'Superior', total: 2600000, estado: 'completado', talles: { S: 5, M: 10, L: 15, XL: 8, XXL: 2 }, colorRemera: 'verde', colores: 4, entrega: 'Estandar', notas: 'Entregado el 19/04.' },
  { id: 5, codigo: 'UY-2026-0845', fecha: '2026-04-18', cliente: 'Laura Duarte', telefono: '0961 555 444', calidad: 'Premium', total: 570000, estado: 'cancelado', talles: { S: 2, M: 3, L: 1, XL: 0, XXL: 0 }, colorRemera: 'rojo', colores: 2, entrega: 'Express', notas: 'Cliente cancelo.' },
]

export function AdminLogin({ onLogin }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const submit = () => {
    if (pass === 'admin123') onLogin()
    else setErr('Contrasena incorrecta.')
  }
  return (
    <div className="min-h-full bg-dark-bg flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-[340px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
              <Icon name="zap" size={18} color="#fff" />
            </div>
            <span className="text-xl font-extrabold text-text-primary">UniformesYA</span>
          </div>
          <div className="text-[13px] text-text-secondary">Panel de administracion</div>
        </div>
        <div className="mb-3">
          <label className="text-xs text-text-secondary block mb-1.5">Contrasena</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="••••••••"
            className={`w-full bg-dark-surface border ${err ? 'border-danger' : 'border-dark-border'} rounded-[10px] py-[13px] px-3.5 text-[15px] text-text-primary outline-none`} />
          {err && <div className="text-xs text-danger mt-1">{err}</div>}
        </div>
        <Btn fullWidth onClick={submit}>Ingresar</Btn>
        <div className="text-center text-xs text-text-muted mt-3">Demo: contrasena "admin123"</div>
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
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title="Cotizaciones" rightAction={
        <button onClick={onLogout} className="bg-transparent border-none cursor-pointer text-text-secondary flex items-center gap-1.5 text-[13px]">
          <Icon name="logout" size={16} color="#7A96BF" /> Salir
        </button>
      } />

      <div className="px-4 pt-4">
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="search" size={16} color="#3D5878" />
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por codigo o cliente..."
            className="w-full bg-dark-surface border border-dark-border rounded-[10px] py-[11px] pl-[38px] pr-3.5 text-sm text-text-primary outline-none" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[['todos', 'Todos'], ...Object.entries(ESTADO_CFG).map(([k, v]) => [k, v.label])].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)}
              className={`
                py-1.5 px-3 rounded-lg text-xs font-semibold border-none cursor-pointer whitespace-nowrap shrink-0
                ${filter === id ? 'bg-accent text-white' : 'bg-dark-surface text-text-secondary'}
              `}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-3 flex flex-col gap-2">
        {filtered.length === 0 && (
          <div className="text-center text-text-muted py-10 text-sm">No hay cotizaciones que coincidan.</div>
        )}
        {filtered.map(q => {
          const ec = ESTADO_CFG[q.estado]
          return (
            <div key={q.id} onClick={() => onSelect(q)}
              className="bg-dark-surface border border-dark-border rounded-[14px] py-3.5 px-4 cursor-pointer transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-bold text-text-primary mb-0.5">{q.cliente}</div>
                  <div className="text-[11px] text-text-muted font-mono tracking-wide">{q.codigo}</div>
                </div>
                <Badge color={ec.color}>{ec.label}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-text-secondary">{q.fecha} · {q.calidad} · {q.entrega}</div>
                <div className="text-[15px] font-bold text-accent">{fmtGs(q.total)}</div>
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

  const saveNotes = () => {
    setQuote(q => ({ ...q, notas: notes }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const totalTalles = Object.values(quote.talles).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title={quote.codigo} onBack={onBack}
        rightAction={<Badge color={ec.color}>{ec.label}</Badge>} />

      <div className="flex-1 px-4 pt-5 pb-10 flex flex-col gap-4">
        {/* Client */}
        <div className="bg-dark-surface border border-dark-border rounded-[14px] p-4">
          <SLabel>Cliente</SLabel>
          {[['Nombre', quote.cliente], ['Telefono', quote.telefono], ['Fecha', quote.fecha]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-dark-border-subtle">
              <span className="text-[13px] text-text-secondary">{k}</span>
              <span className="text-[13px] text-text-primary font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* Order detail */}
        <div className="bg-dark-surface border border-dark-border rounded-[14px] p-4">
          <SLabel>Pedido</SLabel>
          {[
            ['Color remera', SHIRT_COLORS_LABELS[quote.colorRemera] || quote.colorRemera],
            ['Calidad', quote.calidad],
            ['Colores de diseno', `${quote.colores}`],
            ['Tiempo de entrega', quote.entrega],
            ['Talles', Object.entries(quote.talles).filter(([, v]) => v > 0).map(([s, v]) => `${s}:${v}`).join(' · ')],
            ['Total unidades', `${totalTalles}`],
            ['Total', fmtGs(quote.total)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-dark-border-subtle">
              <span className="text-[13px] text-text-secondary">{k}</span>
              <span className="text-[13px] text-text-primary font-medium text-right max-w-[55%]">{v}</span>
            </div>
          ))}
        </div>

        {/* Estado selector */}
        <div>
          <SLabel>Estado del pedido</SLabel>
          <div className="flex flex-col gap-2">
            {Object.entries(ESTADO_CFG).map(([id, cfg]) => (
              <div key={id} onClick={() => setQuote(q => ({ ...q, estado: id }))}
                className="py-3 px-4 rounded-xl cursor-pointer flex items-center gap-3"
                style={{
                  border: quote.estado === id ? `1.5px solid ${cfg.color}` : '1px solid #1C3050',
                  background: quote.estado === id ? cfg.color + '18' : '#111E35',
                }}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: quote.estado === id ? cfg.color : '#3D5878' }} />
                <span className="text-sm" style={{
                  fontWeight: quote.estado === id ? 700 : 400,
                  color: quote.estado === id ? cfg.color : '#E8EEFF',
                }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Internal notes */}
        <div>
          <SLabel>Notas internas</SLabel>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
            placeholder="Escribi notas internas sobre este pedido..."
            className="w-full bg-dark-surface border border-dark-border rounded-[10px] py-3 px-3.5 text-sm text-text-primary outline-none resize-y leading-relaxed" />
          <div className="mt-2">
            {saved
              ? <Alert type="success">Notas guardadas.</Alert>
              : <Btn variant="secondary" small onClick={saveNotes}>Guardar notas</Btn>
            }
          </div>
        </div>

        {/* WhatsApp contact */}
        <Btn icon="whatsapp" variant="success" fullWidth
          onClick={() => window.open(`https://wa.me/595${quote.telefono.replace(/\D/g, '')}`, '_blank')}>
          Contactar por WhatsApp
        </Btn>
      </div>
    </div>
  )
}
