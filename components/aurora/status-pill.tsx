"use client"

import { Wifi, WifiOff } from "lucide-react"
import { useAurora } from "@/lib/aurora/store"
import { cn } from "@/lib/utils"

export function StatusPill() {
  const { online, manualOffline } = useAurora()

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
        online
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          : "border-amber-400/30 bg-amber-400/10 text-amber-300",
      )}
      aria-live="polite"
    >
      {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {online ? "Online" : manualOffline ? "Offline (demo)" : "Offline"}
    </span>
  )
}
