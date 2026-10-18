import "server-only"

import type { PortfolioRange } from "@/features/dashboard/constants"
import { portfolioWindow } from "@/features/dashboard/helpers/portfolio-series"
import type {
  Balance,
  Kpi,
  MarketLeadersByPeriod,
  MarketLeadersSnapshot,
  TopAsset,
  TopGainer,
  Transaction,
} from "@/features/dashboard/types"
import { type CoinMarket, getCoinMarkets } from "@/shared/api/coingecko"
import {
  getPricedHoldings,
  getValueHistory,
  type PricedHolding,
} from "@/shared/account"
import { NON_TRADABLE_SYMBOLS } from "@/shared/config/coins"
import { DAY } from "@/shared/lib/time"
import {
  KPI_SYMBOLS,
  MARKET_LEADER_COUNT,
  TOP_ASSET_COUNT,
  TOP_GAINER_COUNT,
  TRANSACTION_COUNT,
} from "../constants"

const symbolOf = (coin: CoinMarket) => coin.symbol.toUpperCase()

const pct = (value: number | null | undefined) => value ?? 0

const getTradableCoins = async () =>
  (await getCoinMarkets()).filter(
    (coin) => !NON_TRADABLE_SYMBOLS.has(symbolOf(coin))
  )

export const getKpis = async (): Promise<Kpi[]> => {
  const coins = await getCoinMarkets()
  return KPI_SYMBOLS.flatMap((symbol) => {
    const coin = coins.find((item) => symbolOf(item) === symbol)
    return coin
      ? [
          {
            name: coin.name,
            pair: `${symbol}/USDT`,
            price: coin.current_price,
            change: pct(coin.price_change_percentage_24h),
          },
        ]
      : []
  })
}

const dayLabel = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
})

const leadersSnapshot = (
  coins: CoinMarket[],
  days: number,
  trendOf: (coin: CoinMarket) => number | null
): MarketLeadersSnapshot => {
  const leaders = coins.slice(0, MARKET_LEADER_COUNT)
  const totalCap = leaders.reduce((sum, coin) => sum + coin.market_cap, 0)
  const now = Date.now()
  return {
    from: dayLabel.format(now - days * DAY),
    to: dayLabel.format(now),
    leaders: leaders.map((coin) => ({
      name: coin.name,
      value: coin.market_cap,
      change24h: coin.market_cap_change_24h,
      trend: pct(trendOf(coin)),
      share: (coin.market_cap / totalCap) * 100,
    })),
  }
}

export const getMarketLeaders = async (): Promise<MarketLeadersByPeriod> => {
  const coins = await getTradableCoins()
  return {
    Week: leadersSnapshot(
      coins,
      7,
      (coin) => coin.price_change_percentage_7d_in_currency
    ),
    Month: leadersSnapshot(
      coins,
      30,
      (coin) => coin.price_change_percentage_30d_in_currency
    ),
  }
}

export const getTransactions = async (): Promise<Transaction[]> =>
  (await getTradableCoins()).slice(0, TRANSACTION_COUNT).map((coin) => ({
    symbol: symbolOf(coin),
    name: coin.name,
    price: coin.current_price,
    marketCap: coin.market_cap,
    lastTradeAt: coin.last_updated,
    metrics: {
      "1H": {
        change: pct(coin.price_change_percentage_1h_in_currency),
        volume: coin.total_volume,
      },
      "24H": {
        change: pct(coin.price_change_percentage_24h),
        volume: coin.total_volume,
      },
      "7D": {
        change: pct(coin.price_change_percentage_7d_in_currency),
        volume: coin.total_volume,
      },
    },
  }))

export const getTopAssets = async (): Promise<TopAsset[]> =>
  (await getTradableCoins()).slice(0, TOP_ASSET_COUNT).map((coin) => ({
    symbol: symbolOf(coin),
    name: coin.name,
    price: coin.current_price,
    change: pct(coin.price_change_percentage_24h),
  }))

export const getTopGainers = async (): Promise<TopGainer[]> =>
  [...(await getTradableCoins())]
    .sort(
      (a, b) =>
        pct(b.price_change_percentage_24h) - pct(a.price_change_percentage_24h)
    )
    .slice(0, TOP_GAINER_COUNT)
    .map((coin) => ({
      symbol: symbolOf(coin),
      marketCap: coin.market_cap,
      price: coin.current_price,
      change: pct(coin.price_change_percentage_24h),
      momentum:
        pct(coin.price_change_percentage_1h_in_currency) >= 0 ? "up" : "down",
    }))

export const getPortfolioValues = (range: PortfolioRange) => {
  const { interval, limit } = portfolioWindow(range)
  return getValueHistory(interval, limit)
}

export const getBalance = async (): Promise<Balance> => {
  const holdings = await getPricedHoldings()
  const sum = (pick: (holding: PricedHolding) => number) =>
    holdings.reduce((total, holding) => total + pick(holding), 0)
  return {
    total: sum((holding) => holding.value),
    available: sum((holding) => holding.free * holding.price),
    inOrders: sum((holding) => holding.locked * holding.price),
    updatedAt: new Date().toISOString(),
  }
}
