import {
  getPortfolioAssets,
  getPortfolioHistory,
  getPortfolioMetrics,
  getWalletHoldings,
  getWatchlist,
} from "@/lib/api/portfolio"

import { AssetsCard } from "./assets-card"
import { ConverterCard } from "./converter-card"
import { ExchangeCard } from "./exchange-card"
import { MetricCards } from "./metric-card"
import { PortfolioHistory } from "./portfolio-history"
import { Watchlist } from "./watchlist"

// Async Server Components, each streaming behind its own skeleton.

export const WatchlistSection = async () => {
  const { items, candidates } = await getWatchlist()
  return <Watchlist candidates={candidates} items={items} />
}

export const MetricsSection = async () => (
  <MetricCards metrics={await getPortfolioMetrics()} />
)

export const PortfolioHistorySection = async () => (
  <PortfolioHistory initialHistory={await getPortfolioHistory()} />
)

export const ExchangeSection = async () => (
  <ExchangeCard holdings={await getWalletHoldings()} />
)

export const AssetsSection = async () => (
  <AssetsCard assets={await getPortfolioAssets()} />
)

export const ConverterSection = async () => (
  <ConverterCard assets={await getPortfolioAssets()} />
)
