import Icon from './Icon'
import Btn from './Btn'
import SLabel from './SLabel'
import TShirtSVG from './TShirtSVG'

const steps = [
  { icon: 'layers',   label: 'Elegí tu item',        desc: 'Remera, hoodie, tote bag y más' },
  { icon: 'upload',   label: 'Subí tu diseño',        desc: 'PNG o SVG en alta calidad' },
  { icon: 'zap',      label: 'Cotizá al instante',    desc: 'Precio en tiempo real' },
  { icon: 'whatsapp', label: 'Solicitá por WhatsApp', desc: 'Confirmamos y producimos' },
]

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-full flex flex-col bg-dark-bg">
      {/* Hero */}
      <div className="pt-14 px-7 pb-10 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[320px] h-[320px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,107,255,0.18) 0%, transparent 70%)' }} />

        {/* Logo */}
        <div className="inline-flex items-center gap-3 mb-10 relative">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#1D6BFF,#0A3FCC)', boxShadow: '0 4px 20px rgba(29,107,255,0.5)' }}>
            <Icon name="zap" size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#E8EEFF', letterSpacing: '-0.03em' }}>UniformesYA</span>
        </div>

        {/* T-shirts */}
        <div className="flex justify-center mb-8 relative">
          {['#1A3A6B', '#1E1E1E', '#4A5568', '#8B1A1A'].map((c, i) => (
            <div key={i} style={{ marginLeft: i > 0 ? -12 : 0, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}>
              <TShirtSVG color={c} size={64} />
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#E8EEFF', lineHeight: 1.2, margin: '0 0 14px', letterSpacing: '-0.02em' }}>
          Diseñá tu remera y<br /><span style={{ color: '#1D6BFF' }}>cotizá al instante</span>
        </h1>
        <p style={{ fontSize: 16, color: '#7A96BF', lineHeight: 1.65, margin: '0 0 36px', maxWidth: 290, marginLeft: 'auto', marginRight: 'auto' }}>
          Subí tu diseño, ubicalo en la remera y recibí tu presupuesto en segundos.
        </p>
        <div style={{ maxWidth: 300, margin: '0 auto' }}>
          <Btn onClick={onStart} fullWidth>
            Empezar ahora
          </Btn>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 px-7 pb-6" style={{ paddingTop: 32 }}>
        <SLabel>Cómo funciona</SLabel>
        <div className="flex flex-col" style={{ gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < steps.length - 1 ? 24 : 0, position: 'relative' }}>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', left: 20, top: 40, width: 1, background: '#1C3050', height: 'calc(100% - 20px)' }} />
              )}
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111E35', border: '1px solid #1C3050', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                <Icon name={s.icon} size={18} color="#1D6BFF" />
              </div>
              <div style={{ paddingTop: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#E8EEFF', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: '#7A96BF', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 28px', borderTop: '1px solid #0E1A2E', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#3D5878', margin: 0 }}>
          Asunción, Paraguay · uniformesya@gmail.com
        </p>
      </div>
    </div>
  )
}
