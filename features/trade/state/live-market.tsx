"use client"

import { useQueryClient } from "@tanstack/react-query"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"

import {
  type RawDepth,
  type RawStreamTicker,
  type RawStreamTrade,
  toBinanceSymbol,
  toOrderBook,
  toStreamName,
  toTicker,
  toTrade,
} from "../api/binance"
import { tradeQueries } from "../api/queries"
import { useTradePair } from "../components/trade-pair-context"
import {
  LIVE_FLUSH_MS,
  MARKET_TRADES_LIMIT,
  TRADE_PAIR_NAMES,
  TRADE_PAIRS,
} from "../constants"
import {
  type StreamStatus,
  useBinanceStream,
} from "@/shared/hooks/use-binance-stream"
import type { MarketTicker, Trade } from "../types"

type Buffer = {
  pair: string
  tickers: Record<string, MarketTicker>
  depth: RawDepth | null
  trades: Trade[]
}

const emptyBuffer = (pair: string): Buffer => ({
  pair,
  tickers: {},
  depth: null,
  trades: [],
})

const LiveStatusContext = createContext<StreamStatus>("connecting")

export const LiveMarketProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()
  const { pair } = useTradePair()
  const pending = useRef(emptyBuffer(pair))
  const isDirty = useRef(false)

  const symbol = toStreamName(pair)
  const streams = useMemo(
    () => [
      ...TRADE_PAIRS.map((item) => `${toStreamName(item)}@ticker`),
      `${symbol}@depth20`,
      `${symbol}@trade`,
    ],
    [symbol]
  )

  const status = useBinanceStream(streams, (stream, data) => {
    if (pending.current.pair !== pair) pending.current = emptyBuffer(pair)
    const buffer = pending.current
    isDirty.current = true

    if (stream.endsWith("@ticker")) {
      const raw = data as RawStreamTicker
      const match = TRADE_PAIRS.find((item) => toBinanceSymbol(item) === raw.s)
      if (match) {
        buffer.tickers[match] = toTicker(match, TRADE_PAIR_NAMES[match], raw)
      }
      return
    }
    if (!stream.startsWith(`${symbol}@`)) return
    if (stream.endsWith("@depth20")) buffer.depth = data as RawDepth
    if (stream.endsWith("@trade")) {
      buffer.trades.unshift(toTrade(data as RawStreamTrade))
      buffer.trades.length = Math.min(buffer.trades.length, MARKET_TRADES_LIMIT)
    }
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!isDirty.current || document.hidden) return
      const buffer = pending.current
      isDirty.current = false
      pending.current = emptyBuffer(buffer.pair)

      const tickers = queryClient.setQueryData(
        tradeQueries.tickers().queryKey,
        (current) =>
          current?.map((ticker) => buffer.tickers[ticker.pair] ?? ticker)
      )
      const trades = buffer.trades.length
        ? queryClient.setQueryData(
            tradeQueries.trades(buffer.pair).queryKey,
            (current = []) =>
              [...buffer.trades, ...current].slice(0, MARKET_TRADES_LIMIT)
          )
        : undefined
      const ticker =
        buffer.tickers[buffer.pair] ??
        tickers?.find((item) => item.pair === buffer.pair)
      if (buffer.depth && ticker) {
        queryClient.setQueryData(
          tradeQueries.orderBook(buffer.pair).queryKey,
          toOrderBook(buffer.pair, buffer.depth, {
            lastPrice: trades?.[0]?.price ?? ticker.lastPrice,
            change24h: ticker.change24h,
          })
        )
      }
    }, LIVE_FLUSH_MS)
    return () => window.clearInterval(timer)
  }, [queryClient])

  return <LiveStatusContext value={status}>{children}</LiveStatusContext>
}

export const useLiveStatus = () => useContext(LiveStatusContext)
