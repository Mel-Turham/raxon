"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"

import { tradeQueries } from "../api/queries"
import { useTradePair } from "../components/trade-pair-context"

export const useTickers = () => useSuspenseQuery(tradeQueries.tickers()).data

export const useCurrentTicker = () => {
  const { pair } = useTradePair()
  const tickers = useTickers()
  return tickers.find((item) => item.pair === pair) ?? tickers[0]
}

export const useOrderBook = () => {
  const { pair } = useTradePair()
  return useQuery(tradeQueries.orderBook(pair)).data ?? null
}

export const useMarketTrades = () => {
  const { pair } = useTradePair()
  return useQuery(tradeQueries.trades(pair)).data ?? []
}
