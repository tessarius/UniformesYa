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
    if (!validatePhone(phone)) { setPhoneErr('Ingresa un numero paraguayo valido (ej: 0981 123 456).'); ok = false } else setPhoneErr('')
    if (!ok) return

    const talles = Object.entries(quoteData?.quantities || {})
      .filter(([, v]) => v > 0).map(([s, v]) => `  • ${s}: ${v} uds.`).join('\n')
    const ubicaciones = (editorData?.designs || [])
      .map(d => `  • ${areaLabel(d.area)}: ${d.filename}${editorData?.colorsByArea?.[d.area] ? ` (${editorData.colorsByArea[d.area]} col.)` : ''}`).join('\n')

    const msg = encodeURIComponent(
      `*Nueva cotizacion UniformesYA*
Codigo: ${quoteCode}
━━━━━━━━━━━━━━━━━━
Cliente: ${name.trim()}
Telefono: ${phone.trim()}
━━━━━━━━━━━━━━━━━━
Item: Remera ${SHIRT_COLORS_LABELS[editorData?.shirtColor] || ''}
Calidad: ${qual?.label || '—'}
Disenos:
${ubicaciones}
━━━━━━━━━━━━━━━━━━
Talles:
${talles}
Total: ${quoteData?.totalUnits || 0} uds.
━━━━━━━━━━━━━━━━━━
Entrega: ${tier?.label || '—'} · ${quoteData?.bussDays || '—'} dias habiles
Fecha solicitada: ${quoteData?.deliveryDate || '—'}
Total estimado: ${fmtGs(quoteData?.total || 0)}
`)
    const a = document.createElement('a')
    a.href = `https://wa.me/595983545225?text=${msg}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setSent(true)
    if (onDone) setTimeout(onDone, 3500)
  }

  if (sent) return (
    <div className="min-h-full bg-dark-bg flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-success/15 border-2 border-success flex items-center justify-center mb-6">
        <Icon name="check" size={36} color="#14CC88" />
      </div>
      <h2 className="text-2xl font-extrabold text-text-primary mb-3">Cotizacion enviada!</h2>
      <p className="text-[15px] text-text-secondary leading-relaxed mb-6">
        Te contactaremos por WhatsApp a la brevedad para confirmar tu pedido.
      </p>
      <div className="bg-dark-surface border border-dark-border rounded-xl py-3.5 px-5 inline-flex gap-2.5 items-center">
        <Icon name="copy" size={16} color="#7A96BF" />
        <span className="text-sm text-text-secondary">Codigo: </span>
        <span className="text-base font-bold text-accent tracking-wide">{quoteCode}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title="Confirmar y solicitar" onBack={onBack} step={4} totalSteps={4} />

      <div className="flex-1 px-4 pt-5 pb-[120px] overflow-y-auto">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-4 mb-5">
          <SLabel>Resumen del pedido</SLabel>
          {[
            ['Codigo', quoteCode],
            ['Remera', SHIRT_COLORS_LABELS[editorData?.shirtColor] || '—'],
            ['Calidad', qual?.label || '—'],
            ['Disenos', (editorData?.designs || []).map(d => areaLabel(d.area)).join(' · ') || '—'],
            ['Talles', Object.entries(quoteData?.quantities || {}).filter(([, v]) => v > 0).map(([s, v]) => `${s}:${v}`).join(' · ') || '—'],
            ['Fecha', quoteData?.deliveryDate || '—'],
            ['Entrega', `${tier?.label || '—'} (${quoteData?.bussDays || '—'} dias habiles)`],
            ['Total', fmtGs(quoteData?.total || 0)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-dark-border-subtle">
              <span className="text-[13px] text-text-secondary">{k}</span>
              <span className="text-[13px] text-text-primary font-medium text-right max-w-[60%]">{v}</span>
            </div>
          ))}
        </div>

        <SLabel>Tus datos</SLabel>
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="text-xs text-text-secondary block mb-1.5">Nombre completo *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Maria Gonzalez"
              className={`w-full bg-dark-surface border ${nameErr ? 'border-danger' : 'border-dark-border'} rounded-[10px] py-[13px] px-3.5 text-[15px] text-text-primary outline-none`} />
            {nameErr && <div className="text-xs text-danger mt-1">{nameErr}</div>}
          </div>
          <div>
            <label className="text-xs text-text-secondary block mb-1.5">Telefono / WhatsApp *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="Ej: 0981 123 456" type="tel"
              className={`w-full bg-dark-surface border ${phoneErr ? 'border-danger' : 'border-dark-border'} rounded-[10px] py-[13px] px-3.5 text-[15px] text-text-primary outline-none`} />
            {phoneErr && <div className="text-xs text-danger mt-1">{phoneErr}</div>}
          </div>
        </div>
        <Alert type="info">Al enviar se abrira WhatsApp con todos los detalles de tu pedido.</Alert>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-dark-bg from-80% to-transparent px-4 pt-4 pb-8">
        <Btn fullWidth icon="whatsapp" onClick={handleSend}>Enviar por WhatsApp</Btn>
      </div>
    </div>
  )
}
