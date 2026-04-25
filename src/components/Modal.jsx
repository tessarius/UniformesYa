export default function Modal({ open, onClose, title, children, actions, noClose }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-[4px]"
      onClick={noClose ? undefined : onClose}
    >
      <div
        className="w-full max-w-[480px] bg-dark-surface rounded-t-[20px] pt-2 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-5" />
        {title && (
          <div className="text-lg font-bold text-text-primary px-6 pb-4 leading-tight">{title}</div>
        )}
        <div className="px-6">{children}</div>
        {actions && (
          <div className="px-6 pt-5 pb-8 flex flex-col gap-2.5">{actions}</div>
        )}
      </div>
    </div>
  )
}
