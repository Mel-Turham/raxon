"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

type TradePairContextValue = {
  pair: string
  setPair: (pair: string) => void
}

const TradePairContext = createContext<TradePairContextValue | null>(null)

export const TradePairProvider = ({
  initialPair,
  children,
}: {
  initialPair: string
  children: ReactNode
}) => {
  const [pair, setPair] = useState(initialPair)
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
