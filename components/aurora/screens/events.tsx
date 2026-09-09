"use client"

import { useMemo, useState } from "react"
import { CalendarDays, MapPin, Clock, Plus, Check, Heart } from "lucide-react"
import { CATEGORY_ICON } from "../category-chips"
import { EmptyState, Skeleton } from "../feedback"
import { EVENTS } from "@/lib/aurora/data"
import { distance, eventDate, money } from "@/lib/aurora/format"
import { useAurora } from "@/lib/aurora/store"
import { useLoad } from "@/lib/aurora/use-load"
import type { CityEvent } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

export function EventsScreen() {
  const loading = useLoad()
  const [filter, setFilter] = useState<"all" | "today">("all")

  const events = useMemo(() => {
    const list = filter === "today" ? EVENTS.filter((e) => e.today) : EVENTS
    return [...list].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [filter])

  return (
    <div className="space-y-5">
      <header className="animate-rise flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">What's on around Dubai this week</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
          {(["all", "today"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events today"
          description="Switch back to All to see everything happening this week."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }: { event: CityEvent }) {
  const { isEventSaved, toggleEvent, isInMyDay, addToMyDay, removeFromMyDay } = useAurora()
  const saved = isEventSaved(event.id)
  const inDay = isInMyDay("event", event.id)
  const Icon = CATEGORY_ICON[event.category]

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-4 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-2">
        <div>
          {event.today && (
            <span className="mb-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
              Today
            </span>
          )}
          <h3 className="font-semibold leading-tight text-foreground text-balance">{event.name}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleEvent(event.id)}
          aria-label={saved ? "Remove from saved" : "Save event"}
          aria-pressed={saved}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/60 transition-transform hover:scale-110 active:scale-90"
        >
          <Heart className={cn("h-4 w-4", saved ? "animate-pop fill-primary text-primary" : "text-muted-foreground")} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {eventDate(event.date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {event.time}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon className="h-3.5 w-3.5 text-accent" />
          {event.category}
        </span>
        <span>{distance(event.distanceKm)}</span>
        <span className="ml-auto font-semibold text-accent">{money(event.price)}</span>
      </div>

      <button
        type="button"
        onClick={() => (inDay ? removeFromMyDay("event", event.id) : addToMyDay("event", event.id))}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          inDay ? "bg-accent/15 text-accent hover:bg-accent/25" : "bg-primary/15 text-primary hover:bg-primary/25",
        )}
      >
        {inDay ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {inDay ? "Added to My Day" : "Add to My Day"}
      </button>
    </article>
  )
}
