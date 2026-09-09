"use client"

import { useEffect, useState } from "react"

/**
 * Simulates the brief moment a data-service call takes so every screen can show
 * a real loading skeleton. Swapping in a network-backed service later means
 * replacing this with the request's own pending state.
 */
export function useLoad(delay = 550): boolean {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(t)
  }, [delay])
  return loading
}
