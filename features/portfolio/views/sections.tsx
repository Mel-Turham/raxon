import {
  getPortfolioAssets,
  getPortfolioHistory,
  getPortfolioMetrics,
  getWalletHoldings,
  getWatchlist,
} from "@/features/portfolio/api/portfolio"
import { getAccountNames } from "@/features/accounts/api/accounts"
import { getWalletAssets } from "@/features/wallet/api/wallet"

import { AssetsCard } from "../components/assets-card"
import { ConverterCard } from "../components/converter-card"
import { ExchangeCard } from "../components/exchange-card"
import { MetricCards } from "../components/metric-card"
import { PortfolioActions } from "../components/portfolio-actions"
import { PortfolioHistory } from "../components/portfolio-history"
import { Watchlist } from "../components/watchlist"

export const WatchlistSection = async () => {
  const { items, candidates } = await getWatchlist()
  return <Watchlist candidates={candidates} items={items} />
}

export const ActionsSection = async () => {
  const [walletAssets, accountNames] = await Promise.all([
    getWalletAssets(),
    getAccountNames(),
  ])
  return (
    <PortfolioActions accountNames={accountNames} walletAssets={walletAssets} />
  )
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
