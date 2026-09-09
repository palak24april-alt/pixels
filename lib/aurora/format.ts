export function money(aed: number): string {
  if (aed === 0) return "Free"
  return `AED ${aed.toLocaleString()}`
}

export function distance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

export function priceLevel(level: number): string {
  return "$".repeat(Math.max(1, Math.min(4, level)))
}

export function eventDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
}
