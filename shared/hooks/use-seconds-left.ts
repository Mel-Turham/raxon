"use client"

import { useEffect, useState } from "react"

const TICK_MS = 250

export function useSecondsLeft(deadline: number | null) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!deadline) return
    const timer = window.setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= deadline) window.clearInterval(timer)
    }, TICK_MS)
    return () => window.clearInterval(timer)
  }, [deadline])

  return deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0
}
