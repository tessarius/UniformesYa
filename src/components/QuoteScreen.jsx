import { useState, useMemo } from 'react'
import {
  QUALITIES, DELIVERY_TIERS, SHIRT_COLORS, SHIRT_COLORS_REF, SHIRT_COLORS_LABELS,
  STD_SIZES, KIDS_SIZES, EXTRA_SIZES, OTHER_SIZES, AREAS, PRINT_AREAS,
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

function SizeRow({ sz, value, onChange }) {
  return (
    <div className="flex items-center bg-dark-surface rounded-xl border border-dark-border overflow-hidden h-[52px]">
      <div className="w-[52px] shrink-0 flex items-center justify-center border-r border-dark-border h-full">
        <span className="text-sm font-bold text-text-primary">{sz}</span>
      </div>
      <button onClick={() => onChange(Math.max(0, (value || 0) - 1))}
        className="w-11 h-full bg-transparent border-none cursor-pointer text-text-secondary text-[22px] flex items-center justify-center shrink-0">
        −
      </button>
      <input type="number" min={0} value={value || ''}
        placeholder="0"
        onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="flex-1 bg-transparent border-none text-base font-semibold text-text-primary outline-none text-center p-0 min-w-0" />
      <button onClick={() => onChange((value || 0) + 1)}
        className="w-11 h-full bg-transparent border-none cursor-pointer text-accent text-[22px] flex items-center justify-center shrink-0">
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

  // Build locations from editorData for pricing
  const locations = useMemo(() => {
    if (!editorData?.colorsByArea) return []
    return Object.entries(editorData.colorsByArea).map(([areaId, colors]) => {
      const pa = PRINT_AREAS[areaId]
      // Calculate cm2 from the print area (convert canvas px to real cm)
      // Front/back: A3 (29.7 × 42 cm), Sleeves: A7 (7.4 × 10.5 cm)
      const isSleeve = areaId.startsWith('manga')
      const realW = isSleeve ? 7.4 : 29.7
      const realH = isSleeve ? 10.5 : 42
      const cm2 = realW * realH
      return { name: areaId, cm2, colors }
    })
  }, [editorData?.colorsByArea])

  // Calculate quote using real pricing
  const quoteResult = useMemo(() => {
    if (totalUnits < 1) return null
    return calculateQuote({
      quantity: totalUnits,
      quality,
      locations,
      deliverySurcharge: tier?.surcharge || 0,
    })
  }, [totalUnits, quality, locations, tier])

  const canContinue = totalUnits >= 10 && tier && !tooSoon

  const setQty = (size, val) => {
    setQuantities(prev => ({ ...prev, [size]: val }))
  }

  const hasOtroQty = OTHER_SIZES.some(s => (quantities[s] || 0) > 0)
  const showOtrosSection = showOtros || hasOtroQty

  return (
    <div className="min-h-full bg-dark-bg flex flex-col">
      <AppBar title="Cotizacion" onBack={onBack} step={3} totalSteps={4} />

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-[140px]">

        {/* Design summary */}
        {editorData?.designs?.length > 0 && (
          <div className="mb-6">
            <SLabel>Tu diseno</SLabel>
            <div className="bg-dark-surface border border-dark-border rounded-[14px] p-3 flex flex-col gap-2.5">
              {editorData.designs.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white shrink-0 flex items-center justify-center overflow-hidden border border-black/5">
                    {editorData.canvasSnapshot && i === 0
                      ? <img src={editorData.canvasSnapshot} className="w-full h-full object-contain" alt="" />
                      : <Icon name="image" size={20} color="#CCCCCC" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-text-primary font-medium overflow-hidden text-ellipsis whitespace-nowrap">{d.filename}</div>
                    <div className="text-[11px] text-accent font-semibold mt-0.5">{areaLabel(d.area)}</div>
                  </div>
                  {editorData.colorsByArea?.[d.area] && (
                    <div className="shrink-0 text-right">
                      <span className="text-[13px] font-bold text-text-primary">{editorData.colorsByArea[d.area]}</span>
                      <span className="text-[11px] text-text-secondary block">col.</span>
                    </div>
                  )}
                </div>
              ))}
              <Divider />
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Remera</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border border-white/15"
                    style={{ background: SHIRT_COLORS_REF[editorData?.shirtColor] || '#1E3A5F' }} />
                  <span className="text-text-primary font-semibold">{SHIRT_COLORS_LABELS[editorData?.shirtColor] || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quality */}
        <div className="mb-6">
          <SLabel>Calidad de la remera</SLabel>
          <div className="flex gap-2">
            {QUALITIES.map(q => (
              <button key={q.id} onClick={() => setQuality(q.id)}
                className={`
                  flex-1 py-2.5 px-1.5 font-semibold text-[13px] cursor-pointer leading-tight rounded-[10px] transition-all
                  ${quality === q.id
                    ? 'border-[1.5px] border-accent bg-accent/15 text-[#7AADFF]'
                    : 'border border-dark-border bg-dark-surface text-text-dim'
                  }
                `}>
                {q.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-text-secondary mt-2 leading-relaxed">
            {QUALITIES.find(q => q.id === quality)?.desc}
          </div>
        </div>

        {/* Size quantities */}
        <div className="mb-4">
          <SLabel>Cantidad por talle</SLabel>
          {totalUnits > 0 && totalUnits < 10 && (
            <div className="mb-2.5">
              <Alert type="warn">Minimo 10 unidades. Llevas {totalUnits}, faltan {10 - totalUnits}.</Alert>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            {STD_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
          </div>

          {!showOtrosSection && (
            <button onClick={() => setShowOtros(true)}
              className="mt-2 w-full py-3 bg-transparent border border-dashed border-dark-border rounded-xl cursor-pointer text-[13px] font-semibold text-text-secondary flex items-center justify-center gap-2">
              <Icon name="layers" size={15} color="#7A96BF" />
              Otros talles (ninos · 3XL · 4XL)
            </button>
          )}

          {showOtrosSection && (
            <div className="mt-2">
              <div className="text-[11px] font-bold text-text-muted tracking-wider uppercase my-2">Talles ninos</div>
              <div className="flex flex-col gap-1.5">
                {KIDS_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
              </div>
              <div className="text-[11px] font-bold text-text-muted tracking-wider uppercase my-3">Talles especiales</div>
              <div className="flex flex-col gap-1.5">
                {EXTRA_SIZES.map(sz => <SizeRow key={sz} sz={sz} value={quantities[sz] || 0} onChange={v => setQty(sz, v)} />)}
              </div>
            </div>
          )}

          <div className="text-right text-[13px] text-text-secondary mt-2">
            Total: <strong className="text-text-primary">{totalUnits} unidades</strong>
          </div>
        </div>

        {/* Delivery date */}
        <div className="mb-5">
          <SLabel>Cuando lo necesitas?</SLabel>
          <div className={`bg-dark-surface rounded-[14px] p-4 mb-2.5 border ${tooSoon ? 'border-danger/20' : 'border-dark-border'}`}>
            <label className="text-xs text-text-secondary block mb-2">Fecha de entrega deseada</label>
            <input type="date"
              value={selectedDate}
              min={toDateInput(minDate)}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-[#152035] border border-dark-border rounded-[10px] py-3 px-3.5 text-[15px] text-text-primary outline-none"
              style={{ colorScheme: 'dark' }} />
            {tooSoon && (
              <div className="mt-2.5">
                <Alert type="error">Necesitamos al menos 3 dias habiles para producir tu pedido.</Alert>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {DELIVERY_TIERS.map(t => {
              const isActive = tier?.id === t.id && !tooSoon && selectedDate
              return (
                <div key={t.id} className="flex items-center gap-3 py-3 px-3.5 rounded-xl transition-all"
                  style={{
                    border: isActive ? `1.5px solid ${t.color}` : '1px solid #1C3050',
                    background: isActive ? `${t.color}10` : '#111E35',
                  }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 transition-all"
                    style={{
                      background: isActive ? t.color : '#1C3050',
                      boxShadow: isActive ? `0 0 8px ${t.color}` : 'none',
                    }} />
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: isActive ? t.color : '#8BAAC8' }}>{t.label}</div>
                    <div className="text-xs text-text-secondary">{t.days} dias habiles</div>
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
            <div className="text-center text-xs text-text-secondary mt-2">
              {bussDays} dias habiles → modalidad <strong style={{ color: tier.color }}>{tier.label}</strong>
            </div>
          )}
        </div>

        {/* Price summary */}
        <div className="bg-dark-surface rounded-2xl border border-dark-border p-4">
          <SLabel>Resumen de precio</SLabel>
          <div className="flex flex-col gap-2">
            {[
              ['Calidad', QUALITIES.find(q => q.id === quality)?.label || '—'],
              ['Remera (base)', quoteResult ? fmtGs(quoteResult.shirtPrice) : '—'],
              ['Impresion / uni.', quoteResult ? fmtGs(quoteResult.printPerPiece) : '—'],
              ['Entrega', tier ? `${tier.label}${tier.surcharge > 0 ? ' (+' + tier.surcharge * 100 + '%)' : ''}` : '—'],
              ['Precio / uni.', quoteResult ? fmtGs(quoteResult.finalPerPiece) : '—'],
              ['Cantidad', `${totalUnits} uds.`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[13px] text-text-secondary">{k}</span>
                <span className="text-[13px] text-text-primary font-medium">{v}</span>
              </div>
            ))}
            {quoteResult?.printBreakdown?.discountPct > 0 && (
              <div className="flex justify-between">
                <span className="text-[13px] text-success">Descuento multi-ubicacion</span>
                <span className="text-[13px] text-success font-medium">-{(quoteResult.printBreakdown.discountPct * 100).toFixed(0)}%</span>
              </div>
            )}
            <div className="h-px bg-dark-border my-1" />
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-text-primary">Total estimado</span>
              <span className="text-lg font-extrabold text-accent">{quoteResult ? fmtGs(quoteResult.total) : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-gradient-to-t from-dark-bg from-80% to-transparent px-4 pt-4 pb-8">
        <Btn fullWidth disabled={!canContinue}
          onClick={() => onConfirm({
            quality,
            delivery: tier?.id,
            deliveryDate: selectedDate,
            bussDays,
            tier,
            quantities,
            totalUnits,
            pricePerUnit: quoteResult?.finalPerPiece || 0,
            total: quoteResult?.total || 0,
            quoteResult,
            colorCount: editorData?.colorCount || 1,
            colorsByArea: editorData?.colorsByArea || {},
          })}>
          {canContinue
            ? 'Continuar →'
            : totalUnits < 10
              ? `Minimo 10 unidades (faltan ${10 - totalUnits})`
              : tooSoon ? 'Elegi una fecha valida'
              : 'Selecciona una fecha de entrega'}
        </Btn>
      </div>
    </div>
  )
}
