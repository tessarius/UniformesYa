export const SHIRT_COLORS = [
  { id: 'blanco',      hex: '#F5F5F0', label: 'Blanco' },
  { id: 'negro',       hex: '#1A1A1A', label: 'Negro' },
  { id: 'gris',        hex: '#6B7280', label: 'Gris' },
  { id: 'azul_marino', hex: '#1E3A5F', label: 'Azul marino' },
  { id: 'rojo',        hex: '#9B1C1C', label: 'Rojo' },
  { id: 'verde',       hex: '#14532D', label: 'Verde' },
  { id: 'celeste',     hex: '#1E6FAA', label: 'Celeste' },
  { id: 'bordo',       hex: '#6B1C3C', label: 'Bordo' },
]

export const SHIRT_COLORS_REF = Object.fromEntries(SHIRT_COLORS.map(c => [c.id, c.hex]))
export const SHIRT_COLORS_LABELS = Object.fromEntries(SHIRT_COLORS.map(c => [c.id, c.label]))

export const AREAS = [
  { id: 'frente',    label: 'Frente',     short: 'Frente' },
  { id: 'espalda',   label: 'Espalda',    short: 'Espalda' },
  { id: 'manga_izq', label: 'Manga Izq.', short: 'M. Izq.' },
  { id: 'manga_der', label: 'Manga Der.', short: 'M. Der.' },
]

export const PRINT_AREAS = {
  frente:    { x: 75,  y: 80,  w: 140, h: 180 },
  espalda:   { x: 75,  y: 80,  w: 140, h: 180 },
  manga_izq: { x: 88,  y: 105, w: 90,  h: 118 },
  manga_der: { x: 88,  y: 105, w: 90,  h: 118 },
}

export const CANVAS_W = 290
export const CANVAS_H = 330

export const QUALITIES = [
  { id: 'economica', label: 'Economica', desc: 'Remera basica de algodon 160g' },
  { id: 'superior',  label: 'Superior',  desc: 'Algodon peinado 190g, mayor durabilidad' },
  { id: 'premium',   label: 'Premium',   desc: 'Algodon ring-spun 220g, tela premium' },
]

export const DELIVERY_TIERS = [
  { id: 'estandar', label: 'Estandar', days: 15, surcharge: 0.00, color: '#14CC88' },
  { id: 'rapido',   label: 'Rapido',   days: 7,  surcharge: 0.20, color: '#F59E0B' },
  { id: 'express',  label: 'Express',  days: 3,  surcharge: 0.40, color: '#FF4D6A' },
]

export const STD_SIZES   = ['S', 'M', 'L', 'XL', 'XXL']
export const KIDS_SIZES  = ['2', '4', '6', '8', '10', '12']
export const EXTRA_SIZES = ['3XL', '4XL']
export const OTHER_SIZES = [...KIDS_SIZES, ...EXTRA_SIZES]

export const ESTADO_CFG = {
  nuevo:         { label: 'Nuevo',         color: '#1D6BFF' },
  contactado:    { label: 'Contactado',    color: '#F59E0B' },
  en_produccion: { label: 'En produccion', color: '#8B5CF6' },
  completado:    { label: 'Completado',    color: '#14CC88' },
  cancelado:     { label: 'Cancelado',     color: '#FF4D6A' },
}

export const STORAGE_KEY = 'uniformesya_state'

export const fmtGs = (n) => 'Gs. ' + Math.round(n).toLocaleString('es-PY')

export const areaLabel = (id) => ({
  frente: 'Frente', espalda: 'Espalda', manga_izq: 'Manga Izq.', manga_der: 'Manga Der.'
}[id] || id)
