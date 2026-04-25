// Pricing logic from esquema-de-precios.md
// All prices in Guaranies (PYG)

const TIERS = [
  { min: 1,   max: 9,   base: 6800, rate: 7.9 },
  { min: 10,  max: 24,  base: 6800, rate: 7.9 },
  { min: 25,  max: 49,  base: 4740, rate: 5.5 },
  { min: 50,  max: 99,  base: 4270, rate: 5.0 },
  { min: 100, max: 199, base: 3710, rate: 4.3 },
  { min: 200, max: 499, base: 3150, rate: 3.7 },
]

const COLOR_FACTOR = [0, 1.00, 1.40, 1.70, 1.95, 2.15, 2.30]

const MULTI_LOC_DISCOUNT = [0, 0, 0.07, 0.12, 0.15, 0.17]

// Precios base de remera por calidad y tier de cantidad
const SHIRT_BASE_PRICE = [
  { min: 10,  max: 24,  economica: 30000, superior: 45000, premium: 90000 },
  { min: 25,  max: 49,  economica: 28000, superior: 42000, premium: 84000 },
  { min: 50,  max: 99,  economica: 26000, superior: 39000, premium: 78000 },
  { min: 100, max: 199, economica: 22000, superior: 33000, premium: 66000 },
  { min: 200, max: 499, economica: 18000, superior: 27000, premium: 54000 },
]

/**
 * Calculate the print cost for a given order.
 *
 * @param {number} quantity - Number of pieces
 * @param {Array<{name: string, cm2: number, colors: number}>} locations - Print locations
 * @returns {object} Pricing breakdown
 */
export function calculatePrintCost(quantity, locations) {
  const tier = TIERS.find(t => quantity >= t.min && quantity <= t.max)
  if (!tier) return null // quantity out of range

  let subtotal = 0
  let active = 0

  const breakdown = locations.map(loc => {
    const isActive = loc.colors > 0 && loc.cm2 > 0
    const price = isActive
      ? (tier.base + tier.rate * loc.cm2) * COLOR_FACTOR[Math.min(loc.colors, 6)]
      : 0
    if (isActive) active++
    subtotal += price
    return { ...loc, price, isActive }
  })

  const discountPct = MULTI_LOC_DISCOUNT[Math.min(active, 5)]
  const discountAmount = subtotal * discountPct
  const perPiece = subtotal - discountAmount
  const total = perPiece * quantity

  return {
    tier,
    breakdown,
    subtotalPerPiece: subtotal,
    activeLocations: active,
    discountPct,
    discountAmount,
    printPerPiece: perPiece,
    printTotal: total,
    quantity,
  }
}

/**
 * Get the base shirt price for a given quality and quantity.
 *
 * @param {string} quality - 'economica' | 'superior' | 'premium'
 * @param {number} quantity - Number of pieces
 * @returns {number} Price per shirt in Guaranies
 */
export function getShirtBasePrice(quality, quantity) {
  const tier = SHIRT_BASE_PRICE.find(t => quantity >= t.min && quantity <= t.max)
  if (!tier) return 0
  return tier[quality] || 0
}

/**
 * Calculate the full quote including shirt + print + delivery.
 *
 * @param {object} params
 * @param {number} params.quantity - Total number of pieces
 * @param {string} params.quality - 'economica' | 'superior' | 'premium'
 * @param {Array<{name: string, cm2: number, colors: number}>} params.locations - Print locations
 * @param {number} params.deliverySurcharge - Delivery surcharge factor (0, 0.20, 0.40)
 * @returns {object} Full pricing breakdown
 */
export function calculateQuote({ quantity, quality, locations, deliverySurcharge = 0 }) {
  const shirtPrice = getShirtBasePrice(quality, quantity)
  const printResult = calculatePrintCost(quantity, locations)

  if (!printResult || shirtPrice === 0) return null

  const printPerPiece = printResult.printPerPiece
  const subtotalPerPiece = shirtPrice + printPerPiece
  const deliverySurchargeAmount = Math.round(subtotalPerPiece * deliverySurcharge)
  const finalPerPiece = subtotalPerPiece + deliverySurchargeAmount
  const total = finalPerPiece * quantity

  return {
    shirtPrice,
    printBreakdown: printResult,
    printPerPiece,
    subtotalPerPiece,
    deliverySurcharge,
    deliverySurchargeAmount,
    finalPerPiece,
    quantity,
    total,
  }
}
