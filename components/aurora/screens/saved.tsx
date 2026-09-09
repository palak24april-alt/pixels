"use client"

import { useMemo } from "react"
import {
  Bookmark,
  Heart,
  CalendarDays,
  Route,
  Trash2,
  Package,
  ShieldAlert,
  Coins,
  Info,
  WifiOff,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react"
import { PlaceCard } from "../place-card"
import { EmptyState } from "../feedback"
import type { Tab } from "../app-shell"
import { ESSENTIALS, EVENTS, PLACES } from "@/lib/aurora/data"
import { computeTimeline, formatDuration, planTotalCost } from "@/lib/aurora/day-builder"
import { eventDate, money } from "@/lib/aurora/format"
import { useAurora } from "@/lib/aurora/store"
import type { DayPlan } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

export function SavedScreen({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const {
    savedPlaceIds,
    savedEventIds,
    savedPlans,
    manualOffline,
    setManualOffline,
    toggleEvent,
    setMyDay,
  } = useAurora()

  const savedPlaces = useMemo(
    () => PLACES.filter((p) => savedPlaceIds.includes(p.id)),
    [savedPlaceIds],
  )
  const savedEvents = useMemo(
    () => EVENTS.filter((e) => savedEventIds.includes(e.id)),
    [savedEventIds],
  )

  const empty = savedPlaces.length === 0 && savedEvents.length === 0 && savedPlans.length === 0

  return (
    <div className="space-y-6">
      <header className="animate-rise">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Offline Passport</h1>
        <p className="text-sm text-muted-foreground">
          Everything here is stored on this device and renders with zero network calls.
        </p>
      </header>

      {/* Dubai Offline Pack */}
      <section className="animate-rise overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 to-accent/10 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Package className="h-5 w-5 text-primary" />
          Dubai Offline Pack
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <PackStat icon={Heart} value={savedPlaces.length} label="Places" />
          <PackStat icon={CalendarDays} value={savedEvents.length} label="Events" />
          <PackStat icon={Route} value={savedPlans.length} label="Itineraries" />
        </div>
      </section>

      {/* Manual offline toggle */}
      <section className="animate-rise flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 p-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              manualOffline ? "bg-amber-400/15 text-amber-300" : "bg-muted text-muted-foreground",
            )}
          >
            <WifiOff className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Offline Mode (demo)</p>
            <p className="text-xs text-muted-foreground">
              Hides live badges &amp; suggestions, shows an offline banner.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setManualOffline(!manualOffline)}
          role="switch"
          aria-checked={manualOffline}
          aria-label="Toggle demo offline mode"
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            manualOffline ? "bg-amber-400" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-background transition-transform",
              manualOffline ? "left-1 translate-x-5" : "left-1",
            )}
          />
        </button>
      </section>

      {empty && (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Tap the heart on any place or event, or build and save a day plan. It'll wait for you here — even offline."
          action={
            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Start exploring
            </button>
          }
        />
      )}

      {/* Saved itineraries */}
      {savedPlans.length > 0 && (
        <section className="animate-rise space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Route className="h-5 w-5 text-accent" />
            Saved Itineraries
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onOpen={() => {
                  setMyDay(plan.items)
                  onNavigate("build")
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Saved events */}
      {savedEvents.length > 0 && (
        <section className="animate-rise space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <CalendarDays className="h-5 w-5 text-accent" />
            Saved Events
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedEvents.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{e.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.venue} · {eventDate(e.date)} · {e.time}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleEvent(e.id)}
                  aria-label={`Remove ${e.name}`}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Saved places */}
      {savedPlaces.length > 0 && (
        <section className="animate-rise space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Heart className="h-5 w-5 text-accent" />
            Saved Places
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedPlaces.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </section>
      )}

      {/* Essentials */}
      <section className="animate-rise space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Info className="h-5 w-5 text-accent" />
          Dubai Essentials
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={Coins} label="Currency" value={ESSENTIALS.currency} />
          <InfoRow icon={ShieldAlert} label="Emergency" value={ESSENTIALS.emergency} />
        </div>
        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Local etiquette</p>
          <ul className="space-y-2">
            {ESSENTIALS.etiquette.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-pretty">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function PackStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
}) {
  return (
    <div className="rounded-xl bg-background/40 px-3 py-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <div className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  )
}

function PlanCard({ plan, onOpen }: { plan: DayPlan; onOpen: () => void }) {
  const stops = computeTimeline(plan.items, plan.interests ?? [])
  const total = planTotalCost(stops)
  const duration = stops.reduce((s, x) => s + x.durationMinute + x.travelToNextMinute, 0)
  const { removePlan } = useAurora()

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-foreground">{plan.name}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {stops.length} stops
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(duration)}
            </span>
            <span className="font-medium text-accent">{money(total)}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => removePlan(plan.id)}
          aria-label={`Delete ${plan.name}`}
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ul className="space-y-1 text-sm text-muted-foreground">
        {stops.slice(0, 3).map((s) => (
          <li key={`${s.item.type}-${s.item.id}`} className="truncate">
            · {s.name}
          </li>
        ))}
        {stops.length > 3 && <li className="text-xs">+ {stops.length - 3} more</li>}
      </ul>

      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/15 px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/25"
      >
        Open in My Day
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
