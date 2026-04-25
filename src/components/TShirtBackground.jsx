import { CANVAS_W, CANVAS_H } from '../lib/constants'

export default function TShirtBackground({ color, area }) {
  const shadow = 'rgba(0,0,0,0.28)'
  const highlight = 'rgba(255,255,255,0.06)'

  if (area === 'manga_izq') return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      className="absolute top-0 left-0 pointer-events-none">
      <defs>
        <linearGradient id="slv_l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>
      <path d="M 30 50 C 30 50 200 30 250 45 L 260 180 C 260 195 240 210 220 210 L 50 230 C 30 230 20 215 20 200 Z" fill={color} />
      <path d="M 30 50 C 30 50 200 30 250 45 L 260 180 C 260 195 240 210 220 210 L 50 230 C 30 230 20 215 20 200 Z" fill="url(#slv_l)" />
      <path d="M 20 200 C 20 215 30 230 50 230 L 220 210 C 240 210 260 195 260 180 L 255 190 C 255 200 238 212 220 212 L 50 232 C 32 232 22 218 22 205 Z" fill={shadow} opacity="0.5" />
      <path d="M 30 50 C 90 42 160 36 250 45" stroke={highlight} strokeWidth="1" fill="none" />
      <ellipse cx="30" cy="55" rx="18" ry="12" fill={shadow} opacity="0.4" transform="rotate(-10 30 55)" />
    </svg>
  )

  if (area === 'manga_der') return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      className="absolute top-0 left-0 pointer-events-none">
      <defs>
        <linearGradient id="slv_r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>
      <path d="M 260 50 C 260 50 90 30 40 45 L 30 180 C 30 195 50 210 70 210 L 240 230 C 260 230 270 215 270 200 Z" fill={color} />
      <path d="M 260 50 C 260 50 90 30 40 45 L 30 180 C 30 195 50 210 70 210 L 240 230 C 260 230 270 215 270 200 Z" fill="url(#slv_r)" />
      <path d="M 270 200 C 270 215 260 230 240 230 L 70 210 C 50 210 30 195 30 180 L 35 190 C 35 200 52 212 70 212 L 240 232 C 258 232 268 218 268 205 Z" fill={shadow} opacity="0.5" />
      <path d="M 260 50 C 200 42 130 36 40 45" stroke={highlight} strokeWidth="1" fill="none" />
      <ellipse cx="260" cy="55" rx="18" ry="12" fill={shadow} opacity="0.4" transform="rotate(10 260 55)" />
    </svg>
  )

  return (
    <svg width={CANVAS_W} height={CANVAS_H} viewBox="0 0 290 330"
      className="absolute top-0 left-0 pointer-events-none">
      <defs>
        <linearGradient id="shirt_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        <linearGradient id="collar_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      <path d="M 96 18 Q 145 60 194 18 L 282 58 L 262 122 L 224 108 L 224 308 L 66 308 L 66 108 L 28 122 L 8 58 Z" fill={color} />
      <path d="M 96 18 Q 145 60 194 18 L 282 58 L 262 122 L 224 108 L 224 308 L 66 308 L 66 108 L 28 122 L 8 58 Z" fill="url(#shirt_grad)" />
      <path d="M 8 58 L 28 122 L 66 108 L 80 60 Z" fill={shadow} opacity="0.35" />
      <path d="M 282 58 L 262 122 L 224 108 L 210 60 Z" fill={shadow} opacity="0.20" />
      <path d="M 66 280 L 224 280 L 224 308 L 66 308 Z" fill={shadow} opacity="0.15" />
      <path d="M 96 18 Q 145 60 194 18 Q 168 14 145 14 Q 122 14 96 18 Z" fill="url(#collar_grad)" />
      <line x1="96" y1="18" x2="28" y2="122" stroke={highlight} strokeWidth="1" />
      <line x1="194" y1="18" x2="262" y2="122" stroke={highlight} strokeWidth="1" />
      {area === 'espalda' && (
        <text x="145" y="324" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.2)"
          fontFamily="DM Sans, sans-serif" fontWeight="600" letterSpacing="0.08em">ESPALDA</text>
      )}
    </svg>
  )
}
