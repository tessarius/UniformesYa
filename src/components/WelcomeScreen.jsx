import Icon from './Icon'
import Btn from './Btn'
import SLabel from './SLabel'
import TShirtSVG from './TShirtSVG'

const steps = [
  { icon: 'layers',   label: 'Elegi tu item',        desc: 'Remera, hoodie, tote bag y mas' },
  { icon: 'upload',   label: 'Subi tu diseno',        desc: 'PNG o SVG en alta calidad' },
  { icon: 'zap',      label: 'Cotiza al instante',    desc: 'Precio en tiempo real' },
  { icon: 'whatsapp', label: 'Solicita por WhatsApp', desc: 'Confirmamos y producimos' },
]

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-full flex flex-col bg-dark-bg">
      {/* Hero */}
      <div className="pt-12 px-6 pb-8 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-15 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(29,107,255,0.18)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="inline-flex items-center gap-2.5 mb-8 relative">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-[0_4px_20px_rgba(29,107,255,0.5)]">
            <Icon name="zap" size={20} color="#fff" />
          </div>
          <span className="text-[22px] font-extrabold text-text-primary tracking-tight">UniformesYA</span>
        </div>

        {/* T-shirts */}
        <div className="flex justify-center mb-7 relative">
          {['#1A3A6B', '#1E1E1E', '#4A5568', '#8B1A1A'].map((c, i) => (
            <div key={i} className={`${i > 0 ? '-ml-3' : ''} drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]`}>
              <TShirtSVG color={c} size={60} />
            </div>
          ))}
        </div>

        <h1 className="text-[28px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">
          Disena tu remera y<br /><span className="text-accent">cotiza al instante</span>
        </h1>
        <p className="text-[15px] text-text-secondary leading-relaxed mb-8 max-w-[280px] mx-auto">
          Subi tu diseno, ubicalo en la remera y recibi tu presupuesto en segundos.
        </p>
        <Btn onClick={onStart} className="max-w-[280px] mx-auto">
          Empezar ahora
        </Btn>
      </div>

      {/* Steps */}
      <div className="flex-1 px-6 pt-8 flex flex-col">
        <SLabel>Como funciona</SLabel>
        <div className="flex flex-col">
          {steps.map((s, i) => (
            <div key={i} className={`flex gap-4 ${i < steps.length - 1 ? 'pb-5' : ''} relative`}>
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-10 w-px bg-dark-border" style={{ height: 'calc(100% - 20px)' }} />
              )}
              <div className="w-10 h-10 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center shrink-0 relative z-[1]">
                <Icon name={s.icon} size={18} color="#1D6BFF" />
              </div>
              <div className="pt-2">
                <div className="text-[15px] font-semibold text-text-primary mb-0.5">{s.label}</div>
                <div className="text-[13px] text-text-secondary">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-dark-border-subtle text-center">
        <p className="text-xs text-text-muted m-0">
          Asuncion, Paraguay · uniformesya@gmail.com
        </p>
      </div>
    </div>
  )
}
