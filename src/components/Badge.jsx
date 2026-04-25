export default function Badge({ children, color = '#1D6BFF' }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: color + '22', color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </span>
  )
}
