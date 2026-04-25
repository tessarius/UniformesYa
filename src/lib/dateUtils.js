import { DELIVERY_TIERS } from './constants'

export function addBusinessDays(date, days) {
  const d = new Date(date)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) added++
  }
  return d
}

export function countBusinessDays(from, to) {
  let count = 0
  const d = new Date(from)
  d.setDate(d.getDate() + 1)
  while (d <= to) {
    if (d.getDay() !== 0 && d.getDay() !== 6) count++
    d.setDate(d.getDate() + 1)
  }
  return count
}

export function toDateInput(d) {
  return d.toISOString().split('T')[0]
}

export function tierForDays(days) {
  if (days >= 15) return DELIVERY_TIERS[0]
  if (days >= 7) return DELIVERY_TIERS[1]
  if (days >= 3) return DELIVERY_TIERS[2]
  return null
}
