"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

import { type Candle, withMovingAverages } from "@/shared/charts/lib/candles"
import type { CandleTimeframe } from "@/shared/config/chart"
import { useBinanceStream } from "@/shared/hooks/use-binance-stream"
import {
  klineStream,
  type RawStreamKline,
  toStreamCandle,
} from "../api/binance"
import { tradeQueries } from "../api/queries"
import type { Trade } from "../types"

const withLastTrade = (candles: Candle[], trade: Trade | undefined) => {
  const last = candles.at(-1)
  if (!last || !trade || new Date(trade.executedAt) < last.date) return candles
  return withMovingAverages([
    ...candles.slice(0, -1),
    {
      ...last,
      close: trade.price,
      high: Math.max(last.high, trade.price),
      low: Math.min(last.low, trade.price),
    },
  ])
}

export const useLiveCandles = (pair: string, timeframe: CandleTimeframe) => {
  const queryClient = useQueryClient()
  const candlesQuery = tradeQueries.candles(pair, timeframe)
  const { data } = useQuery(candlesQuery)
  const { data: trades } = useQuery(tradeQueries.trades(pair))
  const lastTrade = trades?.[0]

  useBinanceStream([klineStream(pair, timeframe)], (_, raw) => {
    const candle = toStreamCandle(raw as RawStreamKline)
    queryClient.setQueryData(candlesQuery.queryKey, (current) => {
      if (!current) return current
      const last = current.at(-1)
      const kept =
        last?.date.getTime() === candle.date.getTime()
          ? current.slice(0, -1)
          : current.slice(1)
      return withMovingAverages([...kept, candle])
    })
  })

  return useMemo(
    () => (data ? withLastTrade(data, lastTrade) : null),
    [data, lastTrade]
  )
}
