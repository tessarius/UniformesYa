export default function Modal({ open, onClose, title, children, actions, noClose }) {
  if (!open) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={noClose ? undefined : onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 480, background: '#111E35', borderRadius: '20px 20px 0 0', padding: '8px 0 0', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 40, height: 4, background: '#1C3050', borderRadius: 2, margin: '0 auto 20px' }} />
        {title && (
          <div style={{ fontSize: 18, fontWeight: 700, color: '#E8EEFF', padding: '0 24px 16px', lineHeight: 1.3 }}>{title}</div>
        )}
        <div style={{ padding: '0 24px' }}>{children}</div>
        {actions && (
          <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>{actions}</div>
        )}
      </div>
    </div>
  )
}
