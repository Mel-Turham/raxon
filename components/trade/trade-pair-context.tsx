"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type TradePairContextValue = {
  pair: string
  setPair: (pair: string) => void
}

const DEFAULT_PAIR = "BTC/USDT"

const TradePairContext = createContext<TradePairContextValue | null>(null)

/** Pair selected in the chart, shared with the order form. */
export const TradePairProvider = ({ children }: { children: ReactNode }) => {
  const [pair, setPair] = useState(DEFAULT_PAIR)
  return (
    <TradePairContext.Provider value={{ pair, setPair }}>
      {children}
    </TradePairContext.Provider>
  )
}

export const useTradePair = () => {
  const context = useContext(TradePairContext)
  if (!context) {
    throw new Error("useTradePair must be used inside <TradePairProvider>.")
  }
  return context
}
