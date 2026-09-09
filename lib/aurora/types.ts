export type Category =
  | "Food"
  | "Attractions"
  | "Events"
  | "Culture"
  | "Hidden Gems"
  | "Shopping"
  | "Outdoors"

export type Interest = "Food" | "Culture" | "Music" | "Art" | "Outdoors" | "Shopping" | "History"

export type BudgetTier = "Free" | "Under AED 100" | "AED 100-300" | "Any"

export type TimeBudget = "2h" | "4h" | "6h" | "Full day"

export interface Place {
  id: string
  name: string
  category: Category
  /** map position in percentage (0-100) over the stylized map graphic */
  coords: { x: number; y: number }
  /** typical spend per person in AED (0 = free) */
  cost: number
  /** typical visit duration in minutes */
  duration: number
  rating: number
  /** 1-4 price level */
  priceLevel: number
  /** approximate distance from a fixed demo location, in km */
  distanceKm: number
  open: boolean
  hiddenGem: boolean
  description: string
  /** interest tags used by the day builder */
  tags: Interest[]
}

export interface CityEvent {
  id: string
  name: string
  venue: string
  /** ISO date string */
  date: string
  time: string
  price: number
  category: Category
  distanceKm: number
  /** true when the event happens on the seeded "today" */
  today: boolean
}

/** A reference to something added to a day plan. */
export interface DayItem {
  type: "place" | "event"
  id: string
}

/** A saved day plan — an ordered set of places/events. Times are computed. */
export interface DayPlan {
  id: string
  name: string
  createdAt: number
  timeBudget?: TimeBudget
  interests?: Interest[]
  budget?: BudgetTier
  items: DayItem[]
}

/** A timeline row, derived from a DayItem at render time. */
export interface ComputedStop {
  item: DayItem
  name: string
  category: Category
  startMinute: number
  durationMinute: number
  travelToNextMinute: number
  cost: number
  why: string
}
