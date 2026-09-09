"use client"

import { useState } from "react"
import { Compass, CalendarDays, Bookmark, Sparkles, WandSparkles, CloudOff, type LucideIcon } from "lucide-react"
import { StatusPill } from "./status-pill"
import { useAurora } from "@/lib/aurora/store"
import { cn } from "@/lib/utils"
import { HomeScreen } from "./screens/home"
import { ExploreScreen } from "./screens/explore"
import { BuildDayScreen } from "./screens/build-day"
import { EventsScreen } from "./screens/events"
import { SavedScreen } from "./screens/saved"

export type Tab = "home" | "explore" | "build" | "events" | "saved"

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "build", label: "Build My Day", icon: WandSparkles },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "saved", label: "Saved", icon: Bookmark },
]

export function AppShell() {
  const [tab, setTab] = useState<Tab>("home")
  const { online, manualOffline } = useAurora()

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      {/* top bar */}
      <header className="glass sticky top-0 z-30 border-b border-border">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setTab("home")}
            className="flex items-center gap-2"
            aria-label="AURORA home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-foreground">AURORA</span>
          </button>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  tab === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <StatusPill />
        </div>

        {!online && (
          <div className="flex items-center justify-center gap-2 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            <CloudOff className="h-3.5 w-3.5" />
            {manualOffline
              ? "Offline Mode — showing your cached, local-first data only"
              : "You're offline — saved places and itineraries still work"}
          </div>
        )}
      </header>

      {/* content */}
      <main className="flex-1 px-4 pb-28 pt-5 md:pb-10">
        {tab === "home" && <HomeScreen onNavigate={setTab} />}
        {tab === "explore" && <ExploreScreen />}
        {tab === "build" && <BuildDayScreen onNavigate={setTab} />}
        {tab === "events" && <EventsScreen />}
        {tab === "saved" && <SavedScreen onNavigate={setTab} />}
      </main>

      {/* mobile bottom nav */}
      <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors",
                tab === id ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-full items-center justify-center rounded-lg transition-colors",
                  tab === id && "bg-primary/15",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="leading-none">{label === "Build My Day" ? "My Day" : label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
