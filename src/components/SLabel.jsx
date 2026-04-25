export default function SLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: '#3D5878',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}
