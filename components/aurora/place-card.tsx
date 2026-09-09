"use client"

import { Heart, Star, MapPin, Clock, Plus, Check } from "lucide-react"
import { CATEGORY_ICON } from "./category-chips"
import { LivePulseBadge } from "./live-pulse-badge"
import { useAurora } from "@/lib/aurora/store"
import { distance, money, priceLevel } from "@/lib/aurora/format"
import type { Place } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

interface PlaceCardProps {
  place: Place
  /** show the live "nearby saved" badge (Home only, online only) */
  showPulse?: boolean
  pulseSeed?: number
}

export function PlaceCard({ place, showPulse = false, pulseSeed = 12 }: PlaceCardProps) {
  const { isPlaceSaved, togglePlace, isInMyDay, addToMyDay, removeFromMyDay, online } = useAurora()
  const saved = isPlaceSaved(place.id)
  const inDay = isInMyDay("place", place.id)
  const Icon = CATEGORY_ICON[place.category]

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/70 transition-colors hover:border-primary/30">
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={`/places/${place.id}.png`}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
          <Icon className="h-3.5 w-3.5 text-accent" />
          {place.category}
        </span>
        <button
          type="button"
          onClick={() => togglePlace(place.id)}
          aria-label={saved ? `Remove ${place.name} from saved` : `Save ${place.name}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-foreground backdrop-blur transition-transform hover:scale-110 active:scale-90"
        >
          <Heart
            key={saved ? "on" : "off"}
            className={cn("h-4 w-4 transition-colors", saved ? "animate-pop fill-primary text-primary" : "text-foreground")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-foreground text-balance">{place.name}</h3>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
              <Star className="h-3.5 w-3.5 fill-accent" />
              {place.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground text-pretty">{place.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{money(place.cost)}</span>
          {place.cost > 0 && <span className="text-accent">{priceLevel(place.priceLevel)}</span>}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {distance(place.distanceKm)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {place.duration}m
          </span>
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 font-medium",
              place.open ? "bg-emerald-400/10 text-emerald-300" : "bg-muted text-muted-foreground",
            )}
          >
            {place.open ? "Open" : "Closed"}
          </span>
        </div>

        {showPulse && online && (
          <div>
            <LivePulseBadge seed={pulseSeed} />
          </div>
        )}

        <button
          type="button"
          onClick={() => (inDay ? removeFromMyDay("place", place.id) : addToMyDay("place", place.id))}
          className={cn(
            "mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
            inDay
              ? "bg-accent/15 text-accent hover:bg-accent/25"
              : "bg-primary/15 text-primary hover:bg-primary/25",
          )}
        >
          {inDay ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {inDay ? "Added to My Day" : "Add to Day"}
        </button>
      </div>
    </article>
  )
}
