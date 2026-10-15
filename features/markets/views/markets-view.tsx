import { Suspense } from "react"

import { MarketsGrid } from "./markets-grid"
import {
  InsightsSection,
  MoversSection,
  NewsSection,
  SectorsSection,
  SentimentSection,
  StatsSection,
  TickerSection,
} from "./sections"
import {
  MarketInsightsSkeleton,
  MarketNewsSkeleton,
  MarketSentimentSkeleton,
  MarketStatsSkeleton,
  SectorPerformanceSkeleton,
  TickerStripSkeleton,
  TopMoversSkeleton,
} from "./skeletons"

export function MarketsView() {
  return (
    <MarketsGrid
      insights={
        <Suspense fallback={<MarketInsightsSkeleton />}>
          <InsightsSection />
        </Suspense>
      }
      movers={
        <Suspense fallback={<TopMoversSkeleton />}>
          <MoversSection />
        </Suspense>
      }
      news={
        <Suspense fallback={<MarketNewsSkeleton />}>
          <NewsSection />
        </Suspense>
      }
      sectors={
        <Suspense fallback={<SectorPerformanceSkeleton />}>
          <SectorsSection />
        </Suspense>
      }
      sentiment={
        <Suspense fallback={<MarketSentimentSkeleton />}>
          <SentimentSection />
        </Suspense>
      }
      stats={
        <Suspense fallback={<MarketStatsSkeleton />}>
          <StatsSection />
        </Suspense>
      }
      tickers={
        <Suspense fallback={<TickerStripSkeleton />}>
          <TickerSection />
        </Suspense>
      }
    />
  )
}
