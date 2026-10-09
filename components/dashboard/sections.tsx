import {
  getBalance,
  getKpis,
  getMarketLeaders,
  getPortfolioSeries,
  getTopAssets,
  getTopGainers,
  getTransactions,
} from "@/lib/api/dashboard"

import { KpiCards } from "./kpi-cards"
import { MarketLeaders } from "./market-leaders"
import { MyBalance } from "./my-balance"
import { PortfolioValue } from "./portfolio-value"
import { RecentTransactions } from "./recent-transactions"
import { TopAssets } from "./top-assets"
import { TopGainers } from "./top-gainers"

// Async Server Components: each one fetches its own data and streams in
// independently behind its <Suspense> skeleton.

export const KpiSection = async () => <KpiCards items={await getKpis()} />

export const MarketLeadersSection = async () => (
  <MarketLeaders data={await getMarketLeaders()} />
)

export const PortfolioSection = async () => (
  <PortfolioValue initialSeries={await getPortfolioSeries()} />
)

export const TransactionsSection = async () => (
  <RecentTransactions transactions={await getTransactions()} />
)

export const BalanceSection = async () => (
  <MyBalance balance={await getBalance()} />
)

export const TopAssetsSection = async () => (
  <TopAssets assets={await getTopAssets()} />
)

export const TopGainersSection = async ({
  className,
}: {
  className?: string
}) => <TopGainers className={className} gainers={await getTopGainers()} />
