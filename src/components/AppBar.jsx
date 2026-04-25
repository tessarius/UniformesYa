import Icon from './Icon'

export default function AppBar({ title, onBack, step, totalSteps, rightAction }) {
  return (
    <div className="flex items-center px-4 py-3 gap-3 border-b border-dark-border-subtle bg-dark-bg sticky top-0 z-50">
      {onBack && (
        <button
          onClick={onBack}
          className="bg-dark-surface border-none w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer shrink-0"
        >
          <Icon name="arrow_left" size={18} color="#7A96BF" />
        </button>
      )}
      <div className="flex-1">
        <div className="text-base font-semibold text-text-primary">{title}</div>
        {step && (
          <div className="text-xs text-text-muted mt-px">Paso {step} de {totalSteps}</div>
        )}
      </div>
      {rightAction}
    </div>
  )
}
