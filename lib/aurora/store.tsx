"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { getDeviceId } from "./device-id"
import type { DayItem, DayPlan } from "./types"

/**
 * Thin local-first data service. Everything is persisted to localStorage keyed
 * by the anonymous device id. This layer is intentionally isolated so a real
 * backend (e.g. Supabase) could swap in behind the same function signatures.
 */
const KEYS = {
  savedPlaces: "aurora.saved-places",
  savedEvents: "aurora.saved-events",
  plans: "aurora.saved-plans",
  myDay: "aurora.my-day",
  city: "aurora.city",
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — fail silently, UI still works in-memory
  }
}

interface AuroraContextValue {
  ready: boolean
  deviceId: string
  city: string
  setCity: (city: string) => void
  // connectivity
  browserOnline: boolean
  manualOffline: boolean
  setManualOffline: (v: boolean) => void
  /** effective online = real signal AND not in manual demo offline mode */
  online: boolean
  // saved places (the heart)
  savedPlaceIds: string[]
  isPlaceSaved: (id: string) => boolean
  togglePlace: (id: string) => void
  // saved events
  savedEventIds: string[]
  isEventSaved: (id: string) => boolean
  toggleEvent: (id: string) => void
  // working "my day" plan
  myDay: DayItem[]
  isInMyDay: (type: DayItem["type"], id: string) => boolean
  addToMyDay: (type: DayItem["type"], id: string) => void
  removeFromMyDay: (type: DayItem["type"], id: string) => void
  setMyDay: (items: DayItem[]) => void
  clearMyDay: () => void
  // saved day plans
  savedPlans: DayPlan[]
  savePlan: (plan: DayPlan) => void
  removePlan: (id: string) => void
}

const AuroraContext = createContext<AuroraContextValue | null>(null)

export function AuroraProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [deviceId, setDeviceId] = useState("server")
  const [city, setCityState] = useState("Dubai, UAE")
  const [browserOnline, setBrowserOnline] = useState(true)
  const [manualOffline, setManualOfflineState] = useState(false)
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([])
  const [savedEventIds, setSavedEventIds] = useState<string[]>([])
  const [myDay, setMyDayState] = useState<DayItem[]>([])
  const [savedPlans, setSavedPlans] = useState<DayPlan[]>([])

  // hydrate from localStorage on mount
  useEffect(() => {
    setDeviceId(getDeviceId())
    setCityState(readJSON(KEYS.city, "Dubai, UAE"))
    setSavedPlaceIds(readJSON<string[]>(KEYS.savedPlaces, []))
    setSavedEventIds(readJSON<string[]>(KEYS.savedEvents, []))
    setMyDayState(readJSON<DayItem[]>(KEYS.myDay, []))
    setSavedPlans(readJSON<DayPlan[]>(KEYS.plans, []))
    setBrowserOnline(navigator.onLine)
    setReady(true)
  }, [])

  // track real connectivity
  useEffect(() => {
    const on = () => setBrowserOnline(true)
    const off = () => setBrowserOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])

  const setCity = useCallback((next: string) => {
    setCityState(next)
    writeJSON(KEYS.city, next)
  }, [])

  const setManualOffline = useCallback((v: boolean) => setManualOfflineState(v), [])

  const togglePlace = useCallback((id: string) => {
    setSavedPlaceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      writeJSON(KEYS.savedPlaces, next)
      return next
    })
  }, [])

  const toggleEvent = useCallback((id: string) => {
    setSavedEventIds((prev) => {
      const next = prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
      writeJSON(KEYS.savedEvents, next)
      return next
    })
  }, [])

  const addToMyDay = useCallback((type: DayItem["type"], id: string) => {
    setMyDayState((prev) => {
      if (prev.some((i) => i.type === type && i.id === id)) return prev
      const next = [...prev, { type, id }]
      writeJSON(KEYS.myDay, next)
      return next
    })
  }, [])

  const removeFromMyDay = useCallback((type: DayItem["type"], id: string) => {
    setMyDayState((prev) => {
      const next = prev.filter((i) => !(i.type === type && i.id === id))
      writeJSON(KEYS.myDay, next)
      return next
    })
  }, [])

  const setMyDay = useCallback((items: DayItem[]) => {
    setMyDayState(items)
    writeJSON(KEYS.myDay, items)
  }, [])

  const clearMyDay = useCallback(() => {
    setMyDayState([])
    writeJSON(KEYS.myDay, [])
  }, [])

  const savePlan = useCallback((plan: DayPlan) => {
    setSavedPlans((prev) => {
      const next = [plan, ...prev.filter((p) => p.id !== plan.id)]
      writeJSON(KEYS.plans, next)
      return next
    })
  }, [])

  const removePlan = useCallback((id: string) => {
    setSavedPlans((prev) => {
      const next = prev.filter((p) => p.id !== id)
      writeJSON(KEYS.plans, next)
      return next
    })
  }, [])

  const value = useMemo<AuroraContextValue>(
    () => ({
      ready,
      deviceId,
      city,
      setCity,
      browserOnline,
      manualOffline,
      setManualOffline,
      online: browserOnline && !manualOffline,
      savedPlaceIds,
      isPlaceSaved: (id) => savedPlaceIds.includes(id),
      togglePlace,
      savedEventIds,
      isEventSaved: (id) => savedEventIds.includes(id),
      toggleEvent,
      myDay,
      isInMyDay: (type, id) => myDay.some((i) => i.type === type && i.id === id),
      addToMyDay,
      removeFromMyDay,
      setMyDay,
      clearMyDay,
      savedPlans,
      savePlan,
      removePlan,
    }),
    [
      ready,
      deviceId,
      city,
      setCity,
      browserOnline,
      manualOffline,
      setManualOffline,
      savedPlaceIds,
      togglePlace,
      savedEventIds,
      toggleEvent,
      myDay,
      addToMyDay,
      removeFromMyDay,
      setMyDay,
      clearMyDay,
      savedPlans,
      savePlan,
      removePlan,
    ],
  )

  return <AuroraContext.Provider value={value}>{children}</AuroraContext.Provider>
}

export function useAurora(): AuroraContextValue {
  const ctx = useContext(AuroraContext)
  if (!ctx) throw new Error("useAurora must be used within an AuroraProvider")
  return ctx
}
