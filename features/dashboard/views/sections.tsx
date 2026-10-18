import {
  getBalance,
  getKpis,
  getMarketLeaders,
  getPortfolioValues,
  getTopAssets,
  getTopGainers,
  getTransactions,
} from "@/features/dashboard/api/dashboard"
import { Prefetched } from "@/shared/providers/prefetch"
import { PORTFOLIO_DEFAULT_RANGE } from "../constants"
import { getTransferContacts } from "@/features/wallet/api/transfer"
import { getWalletAssets } from "@/features/wallet/api/wallet"

import { dashboardQueries } from "../api/queries"
import { MyBalance } from "../components/my-balance"
import { PortfolioValue } from "../components/portfolio-value"
import {
  LiveKpiCards,
  LiveMarketLeaders,
  LiveRecentTransactions,
  LiveTopAssets,
  LiveTopGainers,
} from "./connected"

export const KpiSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({ ...dashboardQueries.kpis(), queryFn: getKpis }),
    ]}
  >
    <LiveKpiCards />
  </Prefetched>
)

export const MarketLeadersSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...dashboardQueries.leaders(),
        queryFn: getMarketLeaders,
      }),
    ]}
  >
    <LiveMarketLeaders />
  </Prefetched>
)

export const PortfolioSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...dashboardQueries.portfolio(PORTFOLIO_DEFAULT_RANGE),
        queryFn: () => getPortfolioValues(PORTFOLIO_DEFAULT_RANGE),
      }),
    ]}
  >
    <PortfolioValue />
  </Prefetched>
)

export const TransactionsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...dashboardQueries.transactions(),
        queryFn: getTransactions,
      }),
    ]}
  >
    <LiveRecentTransactions />
  </Prefetched>
)

export const BalanceSection = async () => {
  const [balance, walletAssets, transferContacts] = await Promise.all([
    getBalance(),
    getWalletAssets(),
    getTransferContacts(),
  ])

  return (
    <MyBalance
      balance={balance}
      transferContacts={transferContacts}
      walletAssets={walletAssets}
    />
  )
}

export const TopAssetsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...dashboardQueries.topAssets(),
        queryFn: getTopAssets,
      }),
    ]}
  >
    <LiveTopAssets />
  </Prefetched>
)

export const TopGainersSection = ({ className }: { className?: string }) => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...dashboardQueries.topGainers(),
        queryFn: getTopGainers,
      }),
    ]}
  >
    <LiveTopGainers className={className} />
  </Prefetched>
)
