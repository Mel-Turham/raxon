import "server-only"

import { serverEnvConfig } from "@/shared/config/env.server"
import { createHttpClient, revalidate } from "./http"

const API_KEY = serverEnvConfig.coingeckoApiKey

const coingecko = createHttpClient(
  serverEnvConfig.coingeckoApiUrl,
  API_KEY ? { "x-cg-demo-api-key": API_KEY } : undefined
)

export type CoinMarket = {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  market_cap_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency: number | null
  price_change_percentage_24h_in_currency: number | null
  price_change_percentage_7d_in_currency: number | null
  price_change_percentage_30d_in_currency: number | null
  last_updated: string
}

export type CoinCategory = {
  id: string
  name: string
  market_cap: number | null
  market_cap_change_24h: number | null
  top_3_coins_id: string[]
}

export type GlobalMarket = {
  total_market_cap: Record<string, number>
  total_volume: Record<string, number>
  market_cap_percentage: Record<string, number>
  market_cap_change_percentage_24h_usd: number
}

const get = async <T>(path: string, seconds: number, params?: object) =>
  (await coingecko.get<T>(path, { params, ...revalidate(seconds) })).data

export const COIN_MARKETS_LIMIT = 100

export const getCoinMarkets = () =>
  get<CoinMarket[]>("/coins/markets", 60, {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: COIN_MARKETS_LIMIT,
    price_change_percentage: "1h,24h,7d,30d",
  })

export const getCoinCategories = () =>
  get<CoinCategory[]>("/coins/categories", 600, { order: "market_cap_desc" })

export const getGlobalMarket = async () =>
  (await get<{ data: GlobalMarket }>("/global", 300)).data
