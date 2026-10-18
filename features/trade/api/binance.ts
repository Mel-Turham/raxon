import { binanceGet } from "@/shared/api/binance"
import { type Candle, withMovingAverages } from "@/shared/charts/lib/candles"
import type { CandleTimeframe } from "@/shared/config/chart"

import type { MarketTicker, OrderBook, Trade } from "../types"

export { BINANCE_WS_URL, binanceGet } from "@/shared/api/binance"

const BINANCE_INTERVALS: Record<CandleTimeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1h": "1h",
  "4h": "4h",
  "1D": "1d",
  "1W": "1w",
}

type RawLevel = [price: string, amount: string]

export type RawDepth = { bids: RawLevel[]; asks: RawLevel[] }

export type RawTicker = {
  symbol: string
  lastPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  priceChange: string
}

export type RawStreamTicker = {
  s: string
  c: string
  h: string
  l: string
  v: string
  q: string
  p: string
}

export type RawTrade = {
  id: number
  price: string
  qty: string
  time: number
  isBuyerMaker: boolean
}

export type RawStreamTrade = {
  t: number
  p: string
  q: string
  T: number
  m: boolean
}

type RawKline = [openTime: number, ...ohlcv: string[]]

export type RawStreamKline = {
  k: { t: number; o: string; h: string; l: string; c: string; v: string }
}

export const toBinanceSymbol = (pair: string) => pair.replace("/", "")

export const toStreamName = (pair: string) =>
  toBinanceSymbol(pair).toLowerCase()

const splitPair = (pair: string) => {
  const [base, quote] = pair.split("/")
  return { base, quote }
}

export const toTicker = (
  pair: string,
  name: string,
  raw: RawTicker | RawStreamTicker
): MarketTicker => {
  const isStream = "c" in raw
  return {
    pair,
    name,
    ...splitPair(pair),
    lastPrice: Number(isStream ? raw.c : raw.lastPrice),
    change24h: Number(isStream ? raw.p : raw.priceChange),
    high24h: Number(isStream ? raw.h : raw.highPrice),
    low24h: Number(isStream ? raw.l : raw.lowPrice),
    volumeBase24h: Number(isStream ? raw.v : raw.volume),
    volumeQuote24h: Number(isStream ? raw.q : raw.quoteVolume),
  }
}

const toLevels = (levels: RawLevel[]) =>
  levels.map(([price, amount]) => ({
    price: Number(price),
    amount: Number(amount),
  }))

export const toOrderBook = (
  pair: string,
  depth: RawDepth,
  ticker: Pick<MarketTicker, "lastPrice" | "change24h">
): OrderBook => ({
  ...splitPair(pair),
  asks: toLevels(depth.asks),
  bids: toLevels(depth.bids),
  lastPrice: ticker.lastPrice,
  lastChange: ticker.change24h,
})

export const toTrade = (raw: RawTrade | RawStreamTrade): Trade =>
  "t" in raw
    ? {
        id: String(raw.t),
        price: Number(raw.p),
        amount: Number(raw.q),
        side: raw.m ? "sell" : "buy",
        executedAt: new Date(raw.T).toISOString(),
      }
    : {
        id: String(raw.id),
        price: Number(raw.price),
        amount: Number(raw.qty),
        side: raw.isBuyerMaker ? "sell" : "buy",
        executedAt: new Date(raw.time).toISOString(),
      }

const toCandle = (
  time: number,
  [open, high, low, close, volume]: string[]
): Candle => ({
  date: new Date(time),
  open: Number(open),
  high: Number(high),
  low: Number(low),
  close: Number(close),
  volume: Number(volume),
})

export const toStreamCandle = ({ k }: RawStreamKline) =>
  toCandle(k.t, [k.o, k.h, k.l, k.c, k.v])

export const fetchCandles = async (
  pair: string,
  timeframe: CandleTimeframe,
  limit: number,
  signal?: AbortSignal
) => {
  const rows = await binanceGet<RawKline[]>(
    "/klines",
    {
      symbol: toBinanceSymbol(pair),
      interval: BINANCE_INTERVALS[timeframe],
      limit,
    },
    signal
  )
  return withMovingAverages(
    rows.map(([time, ...ohlcv]) => toCandle(time, ohlcv))
  )
}

export const klineStream = (pair: string, timeframe: CandleTimeframe) =>
  `${toStreamName(pair)}@kline_${BINANCE_INTERVALS[timeframe]}`
