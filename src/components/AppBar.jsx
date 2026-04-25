import Icon from './Icon'

export default function AppBar({ title, onBack, step, totalSteps, rightAction }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '14px 18px', gap: 12,
      borderBottom: '1px solid #0E1A2E',
      background: '#080F1E',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: '#111E35', border: 'none',
          width: 38, height: 38, borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <Icon name="arrow_left" size={18} color="#7A96BF" />
        </button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#E8EEFF' }}>{title}</div>
        {step && (
          <div style={{ fontSize: 12, color: '#3D5878', marginTop: 2 }}>Paso {step} de {totalSteps}</div>
        )}
      </div>
      {rightAction}
    </div>
  )
}
