import Icon from './Icon'

export default function Btn({ children, onClick, variant = 'primary', disabled, icon, fullWidth, small, className = '', style: extraStyle = {} }) {
  const base = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 12, transition: 'all 0.15s', outline: 'none',
    fontSize: small ? 14 : 16,
    padding: small ? '10px 16px' : '16px 22px',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.4 : 1,
    ...extraStyle,
  }

  const variants = {
    primary: {
      background: disabled ? '#1C3050' : '#1D6BFF',
      color: '#fff',
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(29,107,255,0.35)',
    },
    secondary: {
      background: '#152035', color: '#8BAAC8',
      border: '1px solid #1C3050',
    },
    ghost: { background: 'transparent', color: '#7A96BF' },
    danger: { background: '#2A1020', color: '#FF4D6A', border: '1px solid rgba(255,77,106,0.2)' },
    success: { background: '#0D2A1F', color: '#14CC88', border: '1px solid rgba(20,204,136,0.2)' },
  }

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onClick={disabled ? undefined : onClick}
      className={className}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
