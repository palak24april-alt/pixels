"use client"

import { useEffect } from "react"
import { X, Heart, Star, MapPin, Clock, Plus, Check } from "lucide-react"
import { CATEGORY_ICON } from "./category-chips"
import { useAurora } from "@/lib/aurora/store"
import { distance, money, priceLevel } from "@/lib/aurora/format"
import type { Place } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

export function PlaceModal({ place, onClose }: { place: Place | null; onClose: () => void }) {
  const { isPlaceSaved, togglePlace, isInMyDay, addToMyDay, removeFromMyDay } = useAurora()

  useEffect(() => {
    if (!place) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [place, onClose])

  if (!place) return null
  const saved = isPlaceSaved(place.id)
  const inDay = isInMyDay("place", place.id)
  const Icon = CATEGORY_ICON[place.category]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={place.name}
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md overflow-hidden rounded-t-3xl border border-border sm:rounded-3xl animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 w-full">
          <img src={`/places/${place.id}.png`} alt={place.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-colors hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            <Icon className="h-3.5 w-3.5 text-accent" />
            {place.category}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-foreground text-balance">{place.name}</h2>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
                <Star className="h-4 w-4 fill-accent" />
                {place.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{place.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="Cost" value={`${money(place.cost)}${place.cost > 0 ? ` · ${priceLevel(place.priceLevel)}` : ""}`} />
            <Stat label="Duration" value={`${place.duration} min`} icon={<Clock className="h-3.5 w-3.5" />} />
            <Stat label="Distance" value={distance(place.distanceKm)} icon={<MapPin className="h-3.5 w-3.5" />} />
            <Stat label="Status" value={place.open ? "Open now" : "Closed"} />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => togglePlace(place.id)}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                saved ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-muted",
              )}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-primary-foreground")} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => (inDay ? removeFromMyDay("place", place.id) : addToMyDay("place", place.id))}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                inDay ? "bg-accent/20 text-accent" : "bg-primary/15 text-primary hover:bg-primary/25",
              )}
            >
              {inDay ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {inDay ? "In My Day" : "Add to Day"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 inline-flex items-center gap-1 font-medium text-foreground">
        {icon}
        {value}
      </div>
    </div>
  )
}
