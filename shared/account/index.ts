import "server-only"

import { connection } from "next/server"
import { cache } from "react"

import {
  binanceCloses,
  type PricePoint,
  toUsdtSymbol,
} from "@/shared/api/binance"
import { getCoinMarkets } from "@/shared/api/coingecko"
import { STABLECOIN_SYMBOLS } from "@/shared/config/coins"
import { demoAccount } from "./demo"

export type * from "./types"

const source = demoAccount

const perRequest = <Args extends unknown[], T>(
  load: (...args: Args) => Promise<T>
) =>
  cache(async (...args: Args) => {
    await connection()
    return load(...args)
  })

export const getHoldings = perRequest(source.holdings)
export const getAccountTrades = perRequest(source.trades)
export const getOpenOrders = perRequest(source.openOrders)
export const getOrderHistory = perRequest(source.orderHistory)
export const getFeeRate = perRequest(source.feeRate)
export const getNetworks = perRequest(source.networks)

export type PricedHolding = {
  symbol: string
  name: string
  amount: number
  free: number
  locked: number
  price: number
  change24h: number
  volume24h: number
  value: number
}

export const getPricedHoldings = perRequest(
  async (): Promise<PricedHolding[]> => {
    const [holdings, coins] = await Promise.all([
      getHoldings(),
      getCoinMarkets(),
    ])
    return holdings
      .map((holding) => {
        const coin = coins.find(
          (item) => item.symbol.toUpperCase() === holding.symbol
        )
        const isStable = STABLECOIN_SYMBOLS.has(holding.symbol)
        const price = coin?.current_price ?? (isStable ? 1 : 0)
        const amount = holding.free + holding.locked
        return {
          ...holding,
          name: coin?.name ?? holding.symbol,
          amount,
          price,
          change24h: coin?.price_change_percentage_24h ?? 0,
          volume24h: coin?.total_volume ?? 0,
          value: amount * price,
        }
      })
      .sort((a, b) => b.value - a.value)
  }
)

export type ValuePoint = { time: number; value: number }

export const getValueHistory = perRequest(
  async (interval: string, limit: number): Promise<ValuePoint[]> => {
    const holdings = await getPricedHoldings()
    const stableValue = holdings
      .filter((holding) => STABLECOIN_SYMBOLS.has(holding.symbol))
      .reduce((sum, holding) => sum + holding.value, 0)
    const volatile = holdings.filter(
      (holding) => !STABLECOIN_SYMBOLS.has(holding.symbol) && holding.amount > 0
    )
    const series = await Promise.all(
      volatile.map(async (holding) => ({
        amount: holding.amount,
        closes: await binanceCloses(
          toUsdtSymbol(holding.symbol),
          interval,
          limit
        ).catch((): PricePoint[] => []),
      }))
    )
    const timeline = series.reduce<PricePoint[]>(
      (longest, item) =>
        item.closes.length > longest.length ? item.closes : longest,
      []
    )
    if (!timeline.length) {
      return [{ time: Date.now(), value: stableValue }]
    }
    return timeline.map(({ time }, index) => ({
      time,
      value:
        stableValue +
        series.reduce((sum, { amount, closes }) => {
          const offset = timeline.length - closes.length
          const point = closes[index - offset]
          return sum + (point ? point.close * amount : 0)
        }, 0),
    }))
  }
)
