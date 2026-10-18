import { env } from "@/shared/config/env"
import { createHttpClient, revalidate } from "./http"

export const BINANCE_WS_URL = env.binanceWsUrl

const spot = createHttpClient(env.binanceApiUrl)

type Params = Record<string, string | number>

export const binanceGet = async <T>(
  path: string,
  params?: Params,
  signal?: AbortSignal
) => (await spot.get<T>(path, { params, signal })).data

export const toUsdtSymbol = (symbol: string) => `${symbol.toUpperCase()}USDT`

export type PricePoint = { time: number; close: number }

type RawKline = [openTime: number, ...ohlcv: string[]]

export const binanceCloses = async (
  symbol: string,
  interval: string,
  limit: number
): Promise<PricePoint[]> => {
  const { data } = await spot.get<RawKline[]>("/klines", {
    params: { symbol, interval, limit },
    ...revalidate(300),
  })
  return data.map(([time, , , , close]) => ({ time, close: Number(close) }))
}
