import { useState } from 'react'
import { QUALITIES, SHIRT_COLORS_LABELS, fmtGs, areaLabel } from '../lib/constants'
import AppBar from './AppBar'
import Btn from './Btn'
import SLabel from './SLabel'
import Alert from './Alert'
import Icon from './Icon'

export default function ConfirmationScreen({ editorData, quoteData, onBack, onDone }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [nameErr, setNameErr] = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [quoteCode] = useState(() => `UY-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`)

  const qual = QUALITIES.find(q => q.id === quoteData?.quality)
  const tier = quoteData?.tier
  const validatePhone = (v) => /^(09[5-9]\d{7}|0[2-9]\d{6,7})$/.test(v.replace(/\s/g, ''))

  const handleSend = () => {
    let ok = true
    if (!name.trim()) { setNameErr('El nombre es requerido.'); ok = false } else setNameErr('')
    if (!validatePhone(phone)) { setPhoneErr('Ingresá un número paraguayo válido (ej: 0981 123 456).'); ok = false } else setPhoneErr('')
    if (!ok) return

    const talles = Object.entries(quoteData?.quantities || {})
      .filter(([, v]) => v > 0).map(([s, v]) => `  • ${s}: ${v} uds.`).join('\n')
    const ubicaciones = (editorData?.designs || [])
      .map(d => `  • ${areaLabel(d.area)}: ${d.filename}${editorData?.colorsByArea?.[d.area] ? ` (${editorData.colorsByArea[d.area]} col.)` : ''}`).join('\n')

    const msg = encodeURIComponent(
      `*Nueva cotización UniformesYA*\nCódigo: ${quoteCode}\n━━━━━━━━━━━━━━━━━━\nCliente: ${name.trim()}\nTeléfono: ${phone.trim()}\n━━━━━━━━━━━━━━━━━━\nItem: Remera ${SHIRT_COLORS_LABELS[editorData?.shirtColor] || ''}\nCalidad: ${qual?.label || '—'}\nDiseños:\n${ubicaciones}\n━━━━━━━━━━━━━━━━━━\nTalles:\n${talles}\nTotal: ${quoteData?.totalUnits || 0} uds.\n━━━━━━━━━━━━━━━━━━\nEntrega: ${tier?.label || '—'} · ${quoteData?.bussDays || '—'} días hábiles\nFecha solicitada: ${quoteData?.deliveryDate || '—'}\nTotal estimado: ${fmtGs(quoteData?.total || 0)}`
    )
    const a = document.createElement('a')
    a.href = `https://wa.me/595983545225?text=${msg}`
    a.target = '_blank'; a.rel = 'noopener noreferrer'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setSent(true)
    if (onDone) setTimeout(onDone, 3500)
  }

  if (sent) return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: 999, background: 'rgba(20,204,136,0.15)', border: '2px solid #14CC88', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <Icon name="check" size={36} color="#14CC88" />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#E8EEFF', margin: '0 0 14px' }}>¡Cotización enviada!</h2>
      <p style={{ fontSize: 15, color: '#7A96BF', lineHeight: 1.7, margin: '0 0 28px' }}>
        Te contactaremos por WhatsApp a la brevedad para confirmar tu pedido.
      </p>
      <div style={{ background: '#111E35', border: '1px solid #1C3050', borderRadius: 12, padding: '14px 22px', display: 'inline-flex', gap: 10, alignItems: 'center' }}>
        <Icon name="copy" size={16} color="#7A96BF" />
        <span style={{ fontSize: 14, color: '#7A96BF' }}>Código: </span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1D6BFF', letterSpacing: '0.04em' }}>{quoteCode}</span>
      </div>
    </div>
  )

  const inputStyle = (hasErr) => ({
    width: '100%', background: '#111E35',
    border: `1px solid ${hasErr ? '#FF4D6A' : '#1C3050'}`,
    borderRadius: 10, padding: '14px 16px', fontSize: 15,
    color: '#E8EEFF', fontFamily: "'DM Sans', sans-serif", outline: 'none',
  })

  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Confirmar y solicitar" onBack={onBack} step={4} totalSteps={4} />

      <div style={{ flex: 1, padding: '24px 18px 130px', overflowY: 'auto' }}>
        <div style={{ background: '#111E35', border: '1px solid #1C3050', borderRadius: 16, padding: '18px', marginBottom: 28 }}>
          <SLabel>Resumen del pedido</SLabel>
          {[
            ['Código', quoteCode],
            ['Remera', SHIRT_COLORS_LABELS[editorData?.shirtColor] || '—'],
            ['Calidad', qual?.label || '—'],
            ['Diseños', (editorData?.designs || []).map(d => areaLabel(d.area)).join(' · ') || '—'],
            ['Talles', Object.entries(quoteData?.quantities || {}).filter(([, v]) => v > 0).map(([s, v]) => `${s}:${v}`).join(' · ') || '—'],
            ['Fecha', quoteData?.deliveryDate || '—'],
            ['Entrega', `${tier?.label || '—'} (${quoteData?.bussDays || '—'} días hábiles)`],
            ['Total', fmtGs(quoteData?.total || 0)],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #0E1A2E' }}>
              <span style={{ fontSize: 13, color: '#7A96BF' }}>{k}</span>
              <span style={{ fontSize: 13, color: '#E8EEFF', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>

        <SLabel>Tus datos</SLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, color: '#7A96BF', display: 'block', marginBottom: 8 }}>Nombre completo *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: María González" style={inputStyle(nameErr)} />
            {nameErr && <div style={{ fontSize: 12, color: '#FF4D6A', marginTop: 6 }}>{nameErr}</div>}
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#7A96BF', display: 'block', marginBottom: 8 }}>Teléfono / WhatsApp *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 0981 123 456" type="tel" style={inputStyle(phoneErr)} />
            {phoneErr && <div style={{ fontSize: 12, color: '#FF4D6A', marginTop: 6 }}>{phoneErr}</div>}
          </div>
        </div>
        <Alert type="info">Al enviar se abrirá WhatsApp con todos los detalles de tu pedido.</Alert>
      </div>

      <div style={{ position: 'sticky', bottom: 0, background: 'linear-gradient(to top, #080F1E 80%, transparent)', padding: '16px 18px 36px' }}>
        <Btn fullWidth icon="whatsapp" onClick={handleSend}>Enviar por WhatsApp</Btn>
      </div>
    </div>
  )
}
