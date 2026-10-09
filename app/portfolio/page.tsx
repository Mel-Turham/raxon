import { Suspense } from "react"

import {
  AssetsCardSkeleton,
  AssetsSection,
  ConverterCardSkeleton,
  ConverterSection,
  ExchangeCardSkeleton,
  ExchangeSection,
  MetricCardsSkeleton,
  MetricsSection,
  PortfolioActions,
  PortfolioGrid,
  PortfolioHistorySection,
  PortfolioHistorySkeleton,
  WatchlistSection,
  WatchlistSkeleton,
} from "@/components/portfolio"

export default function PortfolioPage() {
  return (
    <PortfolioGrid
      watchlist={
        <Suspense fallback={<WatchlistSkeleton />}>
          <WatchlistSection />
        </Suspense>
      }
      actions={<PortfolioActions />}
      metrics={
        <Suspense fallback={<MetricCardsSkeleton />}>
          <MetricsSection />
        </Suspense>
      }
      history={
        <Suspense fallback={<PortfolioHistorySkeleton />}>
          <PortfolioHistorySection />
        </Suspense>
      }
      exchange={
        <Suspense fallback={<ExchangeCardSkeleton />}>
          <ExchangeSection />
        </Suspense>
      }
      assets={
        <Suspense fallback={<AssetsCardSkeleton />}>
          <AssetsSection />
        </Suspense>
      }
      converter={
        <Suspense fallback={<ConverterCardSkeleton />}>
          <ConverterSection />
        </Suspense>
      }
    />
  )
}
