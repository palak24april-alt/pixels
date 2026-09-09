"use client"

import { CATEGORY_ICON } from "./category-chips"
import type { Place } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

/**
 * Stylized, static illustrated map. Not a real cartographic map — it's a
 * decorative canvas whose only load-bearing elements are the category pins.
 * We intentionally skip live Mapbox to avoid demo-day API failures.
 */
export function MapGraphic({
  places,
  activeId,
  onSelect,
}: {
  places: Place[]
  activeId?: string
  onSelect: (place: Place) => void
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-[oklch(0.16_0.04_264)]">
      {/* dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(oklch(1 0 0 / 0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* waterfront band */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to top, oklch(0.5 0.09 220 / 0.28), transparent)",
        }}
      />
      {/* district glows */}
      <div aria-hidden className="absolute left-[50%] top-[48%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl" />
      <div aria-hidden className="absolute left-[20%] top-[65%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl" />

      <span className="absolute left-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground backdrop-blur">
        Dubai · illustrated map
      </span>

      {places.map((place) => {
        const Icon = CATEGORY_ICON[place.category]
        const active = place.id === activeId
        return (
          <button
            key={place.id}
            type="button"
            onClick={() => onSelect(place)}
            aria-label={`Open ${place.name}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${place.coords.x}%`, top: `${place.coords.y}%` }}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border shadow-lg transition-all group-hover:scale-110",
                active
                  ? "scale-110 border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-accent group-hover:border-primary/50",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {place.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
