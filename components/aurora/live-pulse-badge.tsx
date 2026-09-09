"use client"

import { useEffect, useRef, useState } from "react"
import { useAurora } from "@/lib/aurora/store"
import { cn } from "@/lib/utils"

/**
 * "X people nearby saved this" live-pulse badge.
 * Refreshes a mock number every 15-30s ONLY while online, and freezes at the
 * last value when offline. In production this would be a Supabase Realtime
 * subscription instead of a local interval.
 */
export function LivePulseBadge({ seed }: { seed: number }) {
  const { online } = useAurora()
  const [count, setCount] = useState(seed)
  const [bumped, setBumped] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!online) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      return
    }

    const schedule = () => {
      const delay = 15000 + Math.random() * 15000 // 15-30s
      timeoutRef.current = setTimeout(() => {
        setCount((prev) => {
          const drift = Math.floor(Math.random() * 7) - 2
          return Math.max(3, prev + drift)
        })
        setBumped(true)
        setTimeout(() => setBumped(false), 400)
        schedule()
      }, delay)
    }
    schedule()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [online])

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-xs font-semibold text-primary transition-transform",
        bumped && "scale-110",
      )}
      title={online ? "Live activity" : "Last seen before going offline"}
    >
      <span className={cn("text-sm leading-none", online && "animate-soft-pulse")} aria-hidden>
        🔥
      </span>
      <span className="tabular-nums">{count}</span>
      <span className="font-medium text-primary/80">nearby saved this</span>
    </span>
  )
}
