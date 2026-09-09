import { eventById, PLACES, placeById } from "./data"
import type { BudgetTier, ComputedStop, DayItem, Interest, Place, TimeBudget } from "./types"

const TIME_BUDGET_MINUTES: Record<TimeBudget, number> = {
  "2h": 120,
  "4h": 240,
  "6h": 360,
  "Full day": 540,
}

const BUDGET_CAP: Record<BudgetTier, number> = {
  Free: 0,
  "Under AED 100": 100,
  "AED 100-300": 300,
  Any: Number.POSITIVE_INFINITY,
}

const TRAVEL_MINUTES = 20
const EVENT_DEFAULT_DURATION = 90

function whyItFits(place: Place, interests: Interest[]): string {
  const matched = place.tags.filter((t) => interests.includes(t))
  if (place.hiddenGem) return "A local-favourite hidden gem most visitors miss."
  if (place.cost === 0) return `Free ${matched[0]?.toLowerCase() ?? "spot"} that keeps the day light on the wallet.`
  if (matched.length > 0) return `Matches your love of ${matched.join(" & ").toLowerCase()}.`
  return "Highly rated and easy to slot into your route."
}

/**
 * Deterministic day plan: filter seeded places by interests + budget, sort by
 * rating, then greedily pack them into the time window. No AI / network calls.
 */
export function buildDayItems(options: {
  timeBudget: TimeBudget
  interests: Interest[]
  budget: BudgetTier
}): DayItem[] {
  const { timeBudget, interests, budget } = options
  const cap = BUDGET_CAP[budget]
  const totalMinutes = TIME_BUDGET_MINUTES[timeBudget]

  const candidates = PLACES.filter((p) => {
    const withinBudget = p.cost <= cap
    const matchesInterest = interests.length === 0 || p.tags.some((t) => interests.includes(t))
    return withinBudget && matchesInterest
  }).sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm)

  const items: DayItem[] = []
  let elapsed = 0

  for (const place of candidates) {
    if (elapsed + place.duration > totalMinutes) continue
    items.push({ type: "place", id: place.id })
    elapsed += place.duration + TRAVEL_MINUTES
    if (elapsed >= totalMinutes) break
  }

  return items
}

/** Turn an ordered list of day items into a timed timeline. */
export function computeTimeline(items: DayItem[], interests: Interest[] = []): ComputedStop[] {
  const stops: ComputedStop[] = []
  let elapsed = 0

  items.forEach((item, index) => {
    let name = "Unknown"
    let category: ComputedStop["category"] = "Attractions"
    let duration = EVENT_DEFAULT_DURATION
    let cost = 0
    let why = "A great stop on your route."

    if (item.type === "place") {
      const place = placeById(item.id)
      if (!place) return
      name = place.name
      category = place.category
      duration = place.duration
      cost = place.cost
      why = whyItFits(place, interests)
    } else {
      const event = eventById(item.id)
      if (!event) return
      name = event.name
      category = event.category
      cost = event.price
      why = `Live event at ${event.venue} — timed for ${event.time}.`
    }

    const isLast = index === items.length - 1
    stops.push({
      item,
      name,
      category,
      startMinute: elapsed,
      durationMinute: duration,
      travelToNextMinute: isLast ? 0 : TRAVEL_MINUTES,
      cost,
      why,
    })
    elapsed += duration + (isLast ? 0 : TRAVEL_MINUTES)
  })

  return stops
}

export function planTotalCost(stops: ComputedStop[]): number {
  return stops.reduce((sum, s) => sum + s.cost, 0)
}

export function formatClock(startMinute: number, base = 9 * 60): string {
  const total = base + startMinute
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}
