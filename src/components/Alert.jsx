import Icon from './Icon'

const configs = {
  warn:    { bg: '#2A1E0A', border: '#F59E0B33', icon: 'warning', color: '#F59E0B' },
  error:   { bg: '#2A0A12', border: '#FF4D6A33', icon: 'x',       color: '#FF4D6A' },
  info:    { bg: '#0A1830', border: '#1D6BFF33', icon: 'info',     color: '#7AADFF' },
  success: { bg: '#0A2118', border: '#14CC8833', icon: 'check',    color: '#14CC88' },
}

export default function Alert({ type = 'warn', children }) {
  const cfg = configs[type]
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: 13, color: cfg.color, lineHeight: 1.5 }}>
      <Icon name={cfg.icon} size={16} color={cfg.color} />
      <span>{children}</span>
    </div>
  )
}
