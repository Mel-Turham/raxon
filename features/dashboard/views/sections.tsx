import {
  getBalance,
  getKpis,
  getMarketLeaders,
  getPortfolioSeries,
  getTopAssets,
  getTopGainers,
  getTransactions,
} from "@/features/dashboard/api/dashboard"
import { getTransferContacts } from "@/features/wallet/api/transfer"
import { getWalletAssets } from "@/features/wallet/api/wallet"

import { KpiCards } from "../components/kpi-cards"
import { MarketLeaders } from "../components/market-leaders"
import { MyBalance } from "../components/my-balance"
import { PortfolioValue } from "../components/portfolio-value"
import { RecentTransactions } from "../components/recent-transactions"
import { TopAssets } from "../components/top-assets"
import { TopGainers } from "../components/top-gainers"

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

export const TopAssetsSection = async () => (
  <TopAssets assets={await getTopAssets()} />
)

export const TopGainersSection = async ({
  className,
}: {
  className?: string
}) => <TopGainers className={className} gainers={await getTopGainers()} />
