"use client"

import { useMemo, useState } from "react"
import { Search, LayoutGrid, Map as MapIcon, X, SlidersHorizontal } from "lucide-react"
import { CategoryChips } from "../category-chips"
import { PlaceCard } from "../place-card"
import { PlaceModal } from "../place-modal"
import { MapGraphic } from "../map-graphic"
import { PlaceCardSkeleton, EmptyState, Skeleton } from "../feedback"
import { CATEGORIES, PLACES } from "@/lib/aurora/data"
import { useLoad } from "@/lib/aurora/use-load"
import type { Category, Place } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

type View = "grid" | "map"

export function ExploreScreen() {
  const loading = useLoad()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category | "All">("All")
  const [view, setView] = useState<View>("grid")
  const [selected, setSelected] = useState<Place | null>(null)

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    return PLACES.filter((p) => {
      const matchesCat = category === "All" || p.category === category
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [category, q])

  return (
    <div className="space-y-5">
      <div className="animate-rise space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Explore Dubai</h1>
            <p className="text-sm text-muted-foreground">{results.length} places to discover</p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
            <ViewToggle active={view === "grid"} onClick={() => setView("grid")} icon={LayoutGrid} label="Grid" />
            <ViewToggle active={view === "map"} onClick={() => setView("map")} icon={MapIcon} label="Map" />
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places…"
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
        </div>

        <CategoryChips categories={CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {view === "map" &&
        (loading ? (
          <Skeleton className="aspect-[4/3] w-full" />
        ) : (
          <div className="animate-rise space-y-2">
            <MapGraphic places={results} activeId={selected?.id} onSelect={setSelected} />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Tap any pin to open its place card. Filters above update the pins live.
            </p>
          </div>
        ))}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No places found"
          description="Nothing matches that filter yet. Try clearing your search or picking another category."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setCategory("All")
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PlaceCard key={p.id} place={p} />
          ))}
        </div>
      )}

      <PlaceModal place={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
