export default function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#1C3050' }} />
      {label && <span style={{ fontSize: 11, color: '#3D5878', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: '#1C3050' }} />
    </div>
  )
}
