import "server-only"

import {
  WATCHLIST_CANDIDATE_COUNT,
  WATCHLIST_DEFAULT,
  type PortfolioHistoryRange,
} from "@/features/portfolio/constants"
import { historyWindow } from "@/features/portfolio/helpers/portfolio-history"
import type {
  HistoryValuePoint,
  PortfolioAsset,
  PortfolioMetric,
  WalletHolding,
  WatchlistItem,
} from "@/features/portfolio/types"
import {
  getAccountTrades,
  getPricedHoldings,
  getValueHistory,
  type PricedHolding,
} from "@/shared/account"
import { type CoinMarket, getCoinMarkets } from "@/shared/api/coingecko"
import { NON_TRADABLE_SYMBOLS, STABLECOIN_SYMBOLS } from "@/shared/config/coins"

const toWatchlistItem = (coin: CoinMarket): WatchlistItem => ({
  pair: `${coin.symbol.toUpperCase()}/USD`,
  base: coin.symbol.toUpperCase(),
  price: coin.current_price,
  change: coin.price_change_percentage_24h ?? 0,
})

export const getWatchlist = async () => {
  const coins = (await getCoinMarkets()).filter(
    (coin) => !NON_TRADABLE_SYMBOLS.has(coin.symbol.toUpperCase())
  )
  const isDefault = (coin: CoinMarket) =>
    WATCHLIST_DEFAULT.includes(coin.symbol.toUpperCase())
  return {
    items: coins.filter(isDefault).map(toWatchlistItem),
    candidates: coins
      .filter((coin) => !isDefault(coin))
      .slice(0, WATCHLIST_CANDIDATE_COUNT)
      .map(toWatchlistItem),
  }
}

const weightedChange = (holdings: PricedHolding[]) => {
  const total = holdings.reduce((sum, holding) => sum + holding.value, 0)
  return total
    ? holdings.reduce(
        (sum, holding) => sum + holding.change24h * holding.value,
        0
      ) / total
    : 0
}

export const getPortfolioMetrics = async (): Promise<PortfolioMetric[]> => {
  const holdings = await getPricedHoldings()
  const total = holdings.reduce((sum, holding) => sum + holding.value, 0)
  const btcPrice = holdings.find((holding) => holding.symbol === "BTC")?.price
  const share = (value: number) => (total ? (value / total) * 100 : 0)

  const stables = holdings.filter((holding) =>
    STABLECOIN_SYMBOLS.has(holding.symbol)
  )
  const buyingPower = stables.reduce(
    (sum, holding) => sum + holding.free * holding.price,
    0
  )
  const locked = holdings.filter((holding) => holding.locked > 0)
  const inOrders = locked.reduce(
    (sum, holding) => sum + holding.locked * holding.price,
    0
  )
  const top = holdings[0]

  return [
    {
      key: "portfolioValue",
      value: total,
      assetAmount: btcPrice ? total / btcPrice : 0,
      asset: "BTC",
      ratio: total ? 100 : 0,
      change: weightedChange(holdings),
    },
    {
      key: "buyingPower",
      value: buyingPower,
      assetAmount: buyingPower,
      asset: "USD",
      ratio: share(buyingPower),
      change: 0,
    },
    {
      key: "inOrders",
      value: inOrders,
      assetAmount: locked[0]?.locked ?? 0,
      asset: locked[0]?.symbol ?? "USD",
      ratio: share(inOrders),
      change: weightedChange(locked),
    },
    {
      key: "topHolding",
      value: top?.value ?? 0,
      assetAmount: top?.amount ?? 0,
      asset: top?.symbol ?? "USD",
      ratio: share(top?.value ?? 0),
      change: top?.change24h ?? 0,
    },
  ]
}

export const getHistoryPoints = async (
  range: PortfolioHistoryRange
): Promise<HistoryValuePoint[]> => {
  const { interval, limit } = historyWindow(range)
  const [values, trades] = await Promise.all([
    getValueHistory(interval, limit),
    getAccountTrades(),
  ])
  const counts = values.map(({ time }, index) => {
    const end = values[index + 1]?.time ?? Number.POSITIVE_INFINITY
    return trades.filter((trade) => {
      const executed = Date.parse(trade.executedAt)
      return executed >= time && executed < end
    }).length
  })
  const busiest = Math.max(1, ...counts)
  return values.map((point, index) => ({
    ...point,
    activity: counts[index] / busiest,
  }))
}

export const getWalletHoldings = async (): Promise<WalletHolding[]> =>
  (await getPricedHoldings())
    .filter((holding) => holding.free > 0)
    .map(({ symbol, free, price }) => ({ symbol, amount: free, price }))

export const getPortfolioAssets = async (): Promise<PortfolioAsset[]> =>
  (await getPricedHoldings()).map((holding) => ({
    symbol: holding.symbol,
    name: holding.name,
    price: holding.price,
    change: holding.change24h,
    volume: holding.volume24h,
  }))
