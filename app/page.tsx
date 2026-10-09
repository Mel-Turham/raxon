import { Suspense } from "react"

import {
  BalanceSection,
  DashboardGrid,
  KpiCardsSkeleton,
  KpiSection,
  MarketLeadersSection,
  MarketLeadersSkeleton,
  MyBalanceSkeleton,
  PortfolioSection,
  PortfolioValueSkeleton,
  RecentTransactionsSkeleton,
  TopAssetsSection,
  TopAssetsSkeleton,
  TopGainersSection,
  TopGainersSkeleton,
  TransactionsSection,
} from "@/components/dashboard"

export default function DashboardPage() {
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
