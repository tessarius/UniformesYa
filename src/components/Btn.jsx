import Icon from './Icon'

const variantStyles = {
  primary: {
    base: 'text-white',
    enabled: 'bg-accent shadow-[0_4px_20px_rgba(29,107,255,0.35)]',
    disabled: 'bg-dark-border shadow-none',
  },
  secondary: {
    base: 'text-text-dim border border-dark-border bg-[#152035]',
    enabled: '',
    disabled: '',
  },
  ghost: {
    base: 'text-text-secondary bg-transparent',
    enabled: '',
    disabled: '',
  },
  danger: {
    base: 'text-danger border border-danger/20 bg-[#2A1020]',
    enabled: '',
    disabled: '',
  },
  success: {
    base: 'text-success border border-success/20 bg-[#0D2A1F]',
    enabled: '',
    disabled: '',
  },
}

export default function Btn({ children, onClick, variant = 'primary', disabled, icon, fullWidth, small, className = '' }) {
  const v = variantStyles[variant] || variantStyles.primary
  return (
    <button
      className={`
        flex items-center justify-center gap-2 font-semibold cursor-pointer
        border-none rounded-xl transition-all outline-none
        ${small ? 'text-sm py-2.5 px-4' : 'text-base py-[15px] px-5'}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${v.base}
        ${disabled ? v.disabled : v.enabled}
        ${className}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  )
}
