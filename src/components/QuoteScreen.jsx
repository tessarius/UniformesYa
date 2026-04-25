import { useState, useMemo } from 'react'
import {
  QUALITIES, DELIVERY_TIERS, SHIRT_COLORS_REF, SHIRT_COLORS_LABELS,
  STD_SIZES, KIDS_SIZES, EXTRA_SIZES, OTHER_SIZES, PRINT_AREAS,
  fmtGs, areaLabel,
} from '../lib/constants'
import { calculateQuote } from '../lib/pricing'
import { addBusinessDays, countBusinessDays, toDateInput, tierForDays } from '../lib/dateUtils'
import AppBar from './AppBar'
import Btn from './Btn'
import SLabel from './SLabel'
import Alert from './Alert'
import Divider from './Divider'
import Badge from './Badge'
import Icon from './Icon'

const s = {
  surface: { background: '#111E35', border: '1px solid #1C3050', borderRadius: 14, padding: '16px 18px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #0E1A2E' },
}

function SizeRow({ sz, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: '#111E35', borderRadius: 12, border: '1px solid #1C3050', overflow: 'hidden', height: 54 }}>
      <div style={{ width: 54, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #1C3050', height: '100%' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#E8EEFF' }}>{sz}</span>
      </div>
      <button onClick={() => onChange(Math.max(0, (value || 0) - 1))}
        style={{ width: 46, height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#7A96BF', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }}>
        −
      </button>
      <input type="number" min={0} value={value || ''} placeholder="0"
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 16, fontWeight: 600, color: '#E8EEFF', fontFamily: 'inherit', outline: 'none', textAlign: 'center', padding: 0, minWidth: 0 }} />
      <button onClick={() => onChange((value || 0) + 1)}
        style={{ width: 46, height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1D6BFF', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'inherit' }}>
        +
      </button>
    </div>
  )
}

export default function QuoteScreen({ editorData, onConfirm, onBack }) {
  const [quality, setQuality] = useState('superior')
  const [quantities, setQuantities] = useState({})
  const [showOtros, setShowOtros] = useState(false)

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }, [])
  const minDate = useMemo(() => addBusinessDays(today, 3), [])
  const [selectedDate, setSelectedDate] = useState('')

  const delivDate = new Date(selectedDate + 'T00:00:00')
  const bussDays = selectedDate ? countBusinessDays(today, delivDate) : 0
  const tier = bussDays > 0 ? tierForDays(bussDays) : null
  const tooSoon = bussDays > 0 && bussDays < 3

  const totalUnits = Object.values(quantities).reduce((a, b) => a + b, 0)

  const locations = useMemo(() => {
    if (!editorData?.colorsByArea) return []
    return Object.entries(editorData.colorsByArea).map(([areaId, colors]) => {
      const isSleeve = areaId.startsWith('manga')
      const cm2 = isSleeve ? 7.4 * 10.5 : 29.7 * 42
      return { name: areaId, cm2, colors }
    })
  }, [editorData?.colorsByArea])

  const quoteResult = useMemo(() => {
    if (totalUnits < 1) return null
    return calculateQuote({ quantity: totalUnits, quality, locations, deliverySurcharge: tier?.surcharge || 0 })
  }, [totalUnits, quality, locations, tier])

  const canContinue = totalUnits >= 10 && tier && !tooSoon
  const setQty = (size, val) => setQuantities(prev => ({ ...prev, [size]: val }))

  const hasOtroQty = OTHER_SIZES.some(sz => (quantities[sz] || 0) > 0)
  const showOtrosSection = showOtros || hasOtroQty

  return (
    <div style={{ minHeight: '100%', background: '#080F1E', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Cotización" onBack={onBack} step={3} totalSteps={4} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 160px' }}>

        {/* Design summary */}
        {editorData?.designs?.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <SLabel>Tu diseño</SLabel>
            <div style={{ ...s.surface, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {editorData.designs.map((d, i) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: '#FFFFFF', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                    {editorData.canvasSnapshot && i === 0
                      ? <img src={editorData.canvasSnapshot} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                      : <Icon name="image" size={20} color="#CCCCCC" />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#E8EEFF', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.filename}</div>
                    <div style={{ fontSize: 11, color: '#1D6BFF', fontWeight: 600, marginTop: 2 }}>{areaLabel(d.area)}</div>
                  </div>
                  {editorData.colorsByArea?.[d.area] && (
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#E8EEFF' }}>{editorData.colorsByArea[d.area]}</span>
                      <span style={{ fontSize: 11, color: '#7A96BF', display: 'block' }}>col.</span>
                    </div>
                  )}
                </div>
              ))}
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#7A96BF' }}>Remera</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 999, background: SHIRT_COLORS_REF[editorData?.shirtColor] || '#1E3A5F', border: '1px solid rgba(255,255,255,0.15)' }} />
                  <span style={{ color: '#E8EEFF', fontWeight: 600 }}>{SHIRT_COLORS_LABELS[editorData?.shirtColor] || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality */}
        <div style={{ marginBottom: 28 }}>
          <SLabel>Calidad de la remera</SLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {QUALITIES.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                style={{ flex: 1, padding: '12px 8px', fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer', lineHeight: 1.3, borderRadius: 10, transition: 'all 0.12s', border: quality === q.id ? '1.5px solid #1D6BFF' : '1px solid #1C3050', background: quality === q.id ? 'rgba(29,107,255,0.15)' : '#111E35', color: quality === q.id ? '#7AADFF' : '#8BAAC8' }}>
                {q.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#7A96BF', marginTop: 10, lineHeight: 1.5 }}>
            {QUALITIES.find(q => q.id === quality)?.desc}
          </div>
        </div>

        {/* Size quantities */}
        <div style={{ marginBottom: 20 }}>
          <SLabel>Cantidad por talle</SLabel>
          {totalUnits > 0 && totalUnits < 10 && (
            <div style={{ marginBottom: 12 }}>
              <Alert type="warn">Mínimo 10 unidades. Llevás {totalUnits}, faltan {10 - totalUnits}.</Alert>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STD_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
          </div>

          {!showOtrosSection && (
            <button onClick={() => setShowOtros(true)}
              style={{ marginTop: 10, width: '100%', padding: '13px', background: 'transparent', border: '1px dashed #1C3050', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#7A96BF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="layers" size={15} color="#7A96BF" />
              Otros talles (niños · 3XL · 4XL)
            </button>
          )}

          {showOtrosSection && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3D5878', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '10px 0 8px' }}>Talles niños</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {KIDS_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#3D5878', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '14px 0 8px' }}>Talles especiales</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {EXTRA_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
              </div>
            </div>
          )}

          <div style={{ textAlign: 'right', fontSize: 13, color: '#7A96BF', marginTop: 10 }}>
            Total: <strong style={{ color: '#E8EEFF' }}>{totalUnits} unidades</strong>
          </div>
        </div>

        {/* Delivery date */}
        <div style={{ marginBottom: 24 }}>
          <SLabel>¿Cuándo lo necesitás?</SLabel>
          <div style={{ ...s.surface, borderColor: tooSoon ? '#FF4D6A33' : '#1C3050', marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#7A96BF', display: 'block', marginBottom: 8 }}>Fecha de entrega deseada</label>
            <input type="date" value={selectedDate} min={toDateInput(minDate)}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: '100%', background: '#152035', border: '1px solid #1C3050', borderRadius: 10, padding: '13px 14px', fontSize: 15, color: selectedDate ? '#E8EEFF' : '#3D5878', fontFamily: "'DM Sans', sans-serif", outline: 'none', colorScheme: 'dark' }} />
            {tooSoon && <div style={{ marginTop: 10 }}><Alert type="error">Necesitamos al menos 3 días hábiles para producir tu pedido.</Alert></div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DELIVERY_TIERS.map(t => {
              const isActive = tier?.id === t.id && !tooSoon && selectedDate
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: isActive ? `1.5px solid ${t.color}` : '1px solid #1C3050', background: isActive ? `${t.color}10` : '#111E35', transition: 'all 0.2s' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 999, flexShrink: 0, background: isActive ? t.color : '#1C3050', boxShadow: isActive ? `0 0 8px ${t.color}` : 'none', transition: 'all 0.2s' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? t.color : '#8BAAC8' }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: '#7A96BF', marginTop: 2 }}>{t.days} días hábiles</div>
                  </div>
                  {t.surcharge > 0
                    ? <Badge color={isActive ? t.color : '#3D5878'}>+{t.surcharge * 100}%</Badge>
                    : <Badge color={isActive ? t.color : '#3D5878'}>Sin recargo</Badge>
                  }
                </div>
              )
            })}
          </div>
          {selectedDate && bussDays > 0 && !tooSoon && tier && (
            <div style={{ textAlign: 'center', fontSize: 12, color: '#7A96BF', marginTop: 8 }}>
              {bussDays} días hábiles → modalidad <strong style={{ color: tier.color }}>{tier.label}</strong>
            </div>
          )}
        </div>

        {/* Price summary */}
        <div style={{ ...s.surface, padding: '18px 18px' }}>
          <SLabel>Resumen de precio</SLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Calidad', QUALITIES.find(q => q.id === quality)?.label || '—'],
              ['Remera (base)', quoteResult ? fmtGs(quoteResult.shirtPrice) : '—'],
              ['Impresión / uni.', quoteResult ? fmtGs(quoteResult.printPerPiece) : '—'],
              ['Entrega', tier ? `${tier.label}${tier.surcharge > 0 ? ' (+' + tier.surcharge * 100 + '%)' : ''}` : '—'],
              ['Precio / uni.', quoteResult ? fmtGs(quoteResult.finalPerPiece) : '—'],
              ['Cantidad', `${totalUnits} uds.`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#7A96BF' }}>{k}</span>
                <span style={{ fontSize: 13, color: '#E8EEFF', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            {quoteResult?.printBreakdown?.discountPct > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#14CC88' }}>Descuento multi-ubicación</span>
                <span style={{ fontSize: 13, color: '#14CC88', fontWeight: 500 }}>-{(quoteResult.printBreakdown.discountPct * 100).toFixed(0)}%</span>
              </div>
            )}
            <div style={{ height: 1, background: '#1C3050', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#E8EEFF' }}>Total estimado</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#1D6BFF' }}>{quoteResult ? fmtGs(quoteResult.total) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'sticky', bottom: 0, background: 'linear-gradient(to top, #080F1E 80%, transparent)', padding: '16px 18px 36px' }}>
        <Btn fullWidth disabled={!canContinue}
          onClick={() => onConfirm({ quality, delivery: tier?.id, deliveryDate: selectedDate, bussDays, tier, quantities, totalUnits, pricePerUnit: quoteResult?.finalPerPiece || 0, total: quoteResult?.total || 0, quoteResult, colorCount: editorData?.colorCount || 1, colorsByArea: editorData?.colorsByArea || {} })}>
          {canContinue
            ? 'Continuar →'
            : totalUnits < 10
              ? `Mínimo 10 unidades (faltan ${10 - totalUnits})`
              : tooSoon ? 'Elegí una fecha válida'
              : 'Seleccioná una fecha de entrega'}
        </Btn>
      </div>
    </div>
  )
}
