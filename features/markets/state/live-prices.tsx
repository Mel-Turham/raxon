"use client"

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import { LIVE_TICK_MS, LIVE_VOLATILITY } from "../constants"
import { liveFactor } from "../helpers/markets"

const LiveTickContext = createContext(0)

export const LivePricesProvider = ({ children }: { children: ReactNode }) => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) setTick((current) => current + 1)
    }, LIVE_TICK_MS)
    return () => window.clearInterval(timer)
  }, [])

  return <LiveTickContext value={tick}>{children}</LiveTickContext>
}

export const useLivePrice = (
  symbol: string,
  price: number,
  volatility = LIVE_VOLATILITY
) => {
  const tick = useContext(LiveTickContext)
  const factor = liveFactor(symbol, tick, volatility)
  const delta = factor - liveFactor(symbol, tick - 1, volatility)

  return {
    tick,
    factor,
    price: price * factor,
    delta: tick === 0 ? 0 : delta,
  }
}
