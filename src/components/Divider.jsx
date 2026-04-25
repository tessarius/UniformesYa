export default function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-dark-border" />
      {label && (
        <span className="text-[11px] text-text-muted font-semibold tracking-wider uppercase">{label}</span>
      )}
      <div className="flex-1 h-px bg-dark-border" />
    </div>
  )
}
