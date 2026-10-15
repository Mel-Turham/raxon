import { Suspense } from "react"

import { DashboardGrid } from "./dashboard-grid"
import {
  BalanceSection,
  KpiSection,
  MarketLeadersSection,
  PortfolioSection,
  TopAssetsSection,
  TopGainersSection,
  TransactionsSection,
} from "./sections"
import {
  KpiCardsSkeleton,
  MarketLeadersSkeleton,
  MyBalanceSkeleton,
  PortfolioValueSkeleton,
  RecentTransactionsSkeleton,
  TopAssetsSkeleton,
  TopGainersSkeleton,
} from "./skeletons"

export function DashboardView() {
  return (
    <DashboardGrid
      kpis={
        <Suspense fallback={<KpiCardsSkeleton />}>
          <KpiSection />
        </Suspense>
      }
      marketLeaders={
        <Suspense fallback={<MarketLeadersSkeleton />}>
          <MarketLeadersSection />
        </Suspense>
      }
      portfolio={
        <Suspense fallback={<PortfolioValueSkeleton />}>
          <PortfolioSection />
        </Suspense>
      }
      transactions={
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <TransactionsSection />
        </Suspense>
      }
      balance={
        <Suspense fallback={<MyBalanceSkeleton />}>
          <BalanceSection />
        </Suspense>
      }
      topAssets={
        <Suspense fallback={<TopAssetsSkeleton />}>
          <TopAssetsSection />
        </Suspense>
      }
      topGainers={
        <Suspense fallback={<TopGainersSkeleton />}>
          <TopGainersSection />
        </Suspense>
      }
    />
  )
}
