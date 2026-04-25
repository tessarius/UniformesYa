export default function Badge({ children, color = '#1D6BFF' }) {
  return (
    <span
      className="inline-block text-[11px] font-bold py-[3px] px-2 rounded-md tracking-wide uppercase"
      style={{ background: color + '22', color }}
    >
      {children}
    </span>
  )
}
