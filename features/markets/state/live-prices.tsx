"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useBinanceStream } from "@/shared/hooks/use-binance-stream"
import { LIVE_TICK_MS } from "../constants"

type RawMiniTicker = { s: string; c: string }

type Prices = Record<string, number>

type LivePrices = {
  tick: number
  prices: Prices
  previous: Prices
  register: (symbol: string) => () => void
}

const QUOTE = "USDT"

const LivePricesContext = createContext<LivePrices | null>(null)

export const LivePricesProvider = ({ children }: { children: ReactNode }) => {
  const [symbols, setSymbols] = useState<string[]>([])
  const [state, setState] = useState({ tick: 0, prices: {}, previous: {} })
  const counts = useRef(new Map<string, number>())
  const pending = useRef<Prices>({})

  const register = useCallback((symbol: string) => {
    if (symbol === QUOTE) return () => {}
    const sync = () => setSymbols([...counts.current.keys()].sort())
    const count = counts.current.get(symbol) ?? 0
    counts.current.set(symbol, count + 1)
    if (count === 0) sync()
    return () => {
      const left = (counts.current.get(symbol) ?? 1) - 1
      if (left > 0) return counts.current.set(symbol, left)
      counts.current.delete(symbol)
      sync()
    }
  }, [])

  const streams = useMemo(
    () => symbols.map((symbol) => `${symbol.toLowerCase()}usdt@miniTicker`),
    [symbols]
  )

  useBinanceStream(streams, (_, data) => {
    const { s, c } = data as RawMiniTicker
    pending.current[s.slice(0, -QUOTE.length)] = Number(c)
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      const updates = pending.current
      if (document.hidden || Object.keys(updates).length === 0) return
      pending.current = {}
      setState((current) => ({
        tick: current.tick + 1,
        previous: current.prices,
        prices: { ...current.prices, ...updates },
      }))
    }, LIVE_TICK_MS)
    return () => window.clearInterval(timer)
  }, [])

  const value = useMemo(() => ({ ...state, register }), [state, register])

  return <LivePricesContext value={value}>{children}</LivePricesContext>
}

export const useLivePrice = (symbol: string, price: number) => {
  const context = useContext(LivePricesContext)
  if (!context) {
    throw new Error("useLivePrice must be used inside <LivePricesProvider>.")
  }
  const { register, prices, previous, tick } = context

  useEffect(() => register(symbol), [register, symbol])

  const live = prices[symbol] ?? price
  return {
    tick,
    factor: price ? live / price : 1,
    price: live,
    delta: live - (previous[symbol] ?? live),
  }
}
