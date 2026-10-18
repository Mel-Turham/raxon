import { queryOptions } from "@tanstack/react-query"

import { CANDLE_COUNT } from "@/shared/charts/lib/candles"
import type { CandleTimeframe } from "@/shared/config/chart"
import {
  MARKET_TRADES_LIMIT,
  TRADE_PAIR_NAMES,
  TRADE_PAIRS,
} from "../constants"
import {
  binanceGet,
  fetchCandles,
  type RawDepth,
  type RawTicker,
  type RawTrade,
  toBinanceSymbol,
  toOrderBook,
  toTicker,
  toTrade,
} from "./binance"

const fetchTickers = async (signal?: AbortSignal) => {
  const rows = await binanceGet<RawTicker[]>(
    "/ticker/24hr",
    { symbols: JSON.stringify(TRADE_PAIRS.map(toBinanceSymbol)) },
    signal
  )
  return TRADE_PAIRS.map((pair) => {
    const row = rows.find((item) => item.symbol === toBinanceSymbol(pair))
    if (!row) throw new Error(`Missing Binance ticker for ${pair}`)
    return toTicker(pair, TRADE_PAIR_NAMES[pair], row)
  })
}

export const tradeQueries = {
  tickers: () =>
    queryOptions({
      queryKey: ["trade", "tickers"],
      queryFn: ({ signal }) => fetchTickers(signal),
      staleTime: Infinity,
    }),
  orderBook: (pair: string) =>
    queryOptions({
      queryKey: ["trade", "order-book", pair],
      queryFn: async ({ signal }) => {
        const [depth, tickers] = await Promise.all([
          binanceGet<RawDepth>(
            "/depth",
            { symbol: toBinanceSymbol(pair), limit: 20 },
            signal
          ),
          fetchTickers(signal),
        ])
        const ticker = tickers.find((item) => item.pair === pair) ?? tickers[0]
        return toOrderBook(pair, depth, ticker)
      },
      staleTime: Infinity,
    }),
  trades: (pair: string) =>
    queryOptions({
      queryKey: ["trade", "trades", pair],
      queryFn: async ({ signal }) => {
        const rows = await binanceGet<RawTrade[]>(
          "/trades",
          { symbol: toBinanceSymbol(pair), limit: MARKET_TRADES_LIMIT },
          signal
        )
        return rows.map(toTrade).reverse()
      },
      staleTime: Infinity,
    }),
  candles: (pair: string, timeframe: CandleTimeframe) =>
    queryOptions({
      queryKey: ["trade", "candles", pair, timeframe],
      queryFn: ({ signal }) =>
        fetchCandles(pair, timeframe, CANDLE_COUNT, signal),
      staleTime: Infinity,
    }),
}
