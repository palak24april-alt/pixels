"use client"

import { useMemo, useState } from "react"
import { Search, MapPin, ChevronRight, CalendarClock, Gem, X } from "lucide-react"
import { CATEGORY_ICON, CategoryChips } from "../category-chips"
import { PlaceCard } from "../place-card"
import { PlaceModal } from "../place-modal"
import { PlaceCardSkeleton, EmptyState, Skeleton } from "../feedback"
import type { Tab } from "../app-shell"
import { CATEGORIES, EVENTS, PLACES } from "@/lib/aurora/data"
import { eventDate } from "@/lib/aurora/format"
import { money } from "@/lib/aurora/format"
import { useAurora } from "@/lib/aurora/store"
import { useLoad } from "@/lib/aurora/use-load"
import type { Category, Place } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

export function HomeScreen({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { city, online } = useAurora()
  const loading = useLoad()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category | "All">("All")
  const [selected, setSelected] = useState<Place | null>(null)

  const q = query.trim().toLowerCase()

  const popular = useMemo(() => {
    return PLACES.filter((p) => {
      const matchesCat = category === "All" || p.category === category
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [category, q])

  const hiddenGems = useMemo(() => PLACES.filter((p) => p.hiddenGem), [])
  const today = useMemo(() => EVENTS.filter((e) => e.today), [])

  // live search suggestions are an online-only enhancement
  const suggestions = useMemo(() => {
    if (!online || !q) return []
    return PLACES.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4)
  }, [online, q])

  return (
    <div className="space-y-8">
      {/* hero header */}
      <section className="animate-rise space-y-4">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm font-medium text-foreground"
          >
            <MapPin className="h-4 w-4 text-primary" />
            {city}
          </button>
          <span className="text-sm text-muted-foreground">Discover · Plan · Save</span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground text-balance sm:text-3xl">
            Your city, curated and offline-ready
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Find gems nearby and auto-build a day plan that follows this device — no account needed.
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places, food, culture…"
            className="w-full rounded-2xl border border-border bg-card/60 py-3 pl-11 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
              {suggestions.map((p) => {
                const Icon = CATEGORY_ICON[p.category]
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelected(p)
                      setQuery("")
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                    {p.name}
                    <span className="ml-auto text-xs text-muted-foreground">{p.category}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />
      </section>

      {/* Happening today */}
      <Section
        title="Happening Today"
        icon={CalendarClock}
        action={{ label: "All events", onClick: () => onNavigate("events") }}
      >
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : today.length === 0 ? (
          <EmptyState icon={CalendarClock} title="Nothing scheduled today" description="Check the Events tab for what's coming up this week." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {today.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onNavigate("events")}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 p-4 text-left transition-colors hover:border-primary/30"
              >
                <div>
                  <p className="font-semibold text-foreground">{e.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.venue} · {eventDate(e.date)} · {e.time}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-accent">{money(e.price)}</span>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Popular near you */}
      <Section title="Popular Near You" subtitle={online ? "Live activity updating" : "Live activity paused offline"}>
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : popular.length === 0 ? (
          <EmptyState icon={Search} title="No matches" description="Try a different category or clear your search." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((p, i) => (
              <PlaceCard key={p.id} place={p} showPulse pulseSeed={8 + ((i * 7) % 30)} />
            ))}
          </div>
        )}
      </Section>

      {/* Explore like a local */}
      <Section
        title="Explore Like a Local"
        icon={Gem}
        subtitle="Hidden gems most visitors miss"
        action={{ label: "Open map", onClick: () => onNavigate("explore") }}
      >
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hiddenGems.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        )}
      </Section>

      <PlaceModal place={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title: string
  subtitle?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: { label: string; onClick: () => void }
  children: React.ReactNode
}) {
  return (
    <section className="animate-rise space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            {Icon && <Icon className={cn("h-5 w-5 text-accent")} />}
            {title}
          </h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-primary hover:underline"
          >
            {action.label}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}
