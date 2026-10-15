import { Suspense } from "react"

import { PortfolioActions } from "../components/portfolio-actions"
import { PortfolioGrid } from "./portfolio-grid"
import {
  ActionsSection,
  AssetsSection,
  ConverterSection,
  ExchangeSection,
  MetricsSection,
  PortfolioHistorySection,
  WatchlistSection,
} from "./sections"
import {
  AssetsCardSkeleton,
  ConverterCardSkeleton,
  ExchangeCardSkeleton,
  MetricCardsSkeleton,
  PortfolioHistorySkeleton,
  WatchlistSkeleton,
} from "./skeletons"

export function PortfolioView() {
  return (
    <PortfolioGrid
      watchlist={
        <Suspense fallback={<WatchlistSkeleton />}>
          <WatchlistSection />
        </Suspense>
      }
      actions={
        <Suspense fallback={<PortfolioActions />}>
          <ActionsSection />
        </Suspense>
      }
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
