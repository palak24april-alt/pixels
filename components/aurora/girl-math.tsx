"use client"

import { useState } from "react"
import { ChevronDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Purely cosmetic "Girl Math" justifier. Resets every session (local state,
 * never persisted). Does not change the real itinerary total anywhere.
 */
export function GirlMath({ cost }: { cost: number }) {
  const [open, setOpen] = useState(false)
  const [split, setSplit] = useState(false)
  const [wouldve, setWouldve] = useState(false)
  const [photos, setPhotos] = useState(1)

  let adjusted = cost
  if (split) adjusted = adjusted / 2
  if (wouldve) adjusted = Math.max(0, adjusted - 40)
  const perPhoto = adjusted / photos
  const changed = split || wouldve || photos > 1

  return (
    <div className="mt-2 rounded-xl border border-accent/20 bg-accent/5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-semibold text-accent"
      >
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>💅</span> Girl Math
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-3 px-3 pb-3 text-sm">
          <Toggle
            checked={split}
            onChange={setSplit}
            label="Split with a friend"
            hint="halved, obviously"
          />
          <Toggle
            checked={wouldve}
            onChange={setWouldve}
            label="Would've spent this anyway"
            hint="minus AED 40 baseline"
          />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Cost per photo</span>
              <span className="font-mono text-xs text-muted-foreground">{photos} pic{photos > 1 ? "s" : ""}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={photos}
              onChange={(e) => setPhotos(Number(e.target.value))}
              className="mt-1.5 w-full accent-[var(--color-accent)]"
              aria-label="Photos taken"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-background/40 px-3 py-2">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              real value
            </span>
            <span className="flex items-baseline gap-2">
              {changed && (
                <span className="text-xs text-muted-foreground line-through decoration-primary/70">AED {cost}</span>
              )}
              <span className="font-bold text-accent transition-all">
                AED {perPhoto.toFixed(perPhoto % 1 === 0 ? 0 : 2)}
                {photos > 1 && <span className="text-xs font-medium text-muted-foreground">/photo</span>}
              </span>
            </span>
          </div>
          <p className="text-xs italic text-muted-foreground">
            {changed ? "See? Basically free. This is fiscal responsibility." : "Toggle a little logic and watch it get cheaper."}
          </p>
        </div>
      )}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-2 text-left"
      aria-pressed={checked}
    >
      <span>
        <span className="text-foreground">{label}</span>
        <span className="ml-1.5 text-xs text-muted-foreground">{hint}</span>
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform",
            checked ? "left-0.5 translate-x-4" : "left-0.5",
          )}
        />
      </span>
    </button>
  )
}
