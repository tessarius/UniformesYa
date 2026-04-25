export default function TShirtSVG({ color = '#1E3A5F', size = 80 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 68 14 Q 100 46 132 14 L 196 46 L 178 92 L 152 80 L 152 212 L 48 212 L 48 80 L 22 92 L 4 46 Z"
        fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
      />
      <path
        d="M 68 14 Q 100 46 132 14 Q 116 12 100 12 Q 84 12 68 14 Z"
        fill="rgba(0,0,0,0.2)"
      />
    </svg>
  )
}
