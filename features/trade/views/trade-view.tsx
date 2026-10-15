import { Suspense } from "react"

import { AiInsightCard } from "../components/ai-insight-card"
import {
  MarketChartSection,
  OrderBookSection,
  OrderFormSection,
  OrdersSection,
  RunningTradesSection,
} from "./sections"
import {
  MarketChartSkeleton,
  OrderBookSkeleton,
  OrderFormSkeleton,
  OrdersCardSkeleton,
  RunningTradesSkeleton,
} from "./skeletons"
import { TradeGrid } from "./trade-grid"

export function TradeView({ pair }: { pair: string }) {
  return (
    <TradeGrid
      initialPair={pair}
      orderBook={
        <Suspense fallback={<OrderBookSkeleton />}>
          <OrderBookSection />
        </Suspense>
      }
      marketChart={
        <Suspense fallback={<MarketChartSkeleton />}>
          <MarketChartSection />
        </Suspense>
      }
      orderForm={
        <Suspense fallback={<OrderFormSkeleton />}>
          <OrderFormSection />
        </Suspense>
      }
      runningTrades={
        <Suspense fallback={<RunningTradesSkeleton />}>
          <RunningTradesSection />
        </Suspense>
      }
      orders={
        <Suspense fallback={<OrdersCardSkeleton />}>
          <OrdersSection />
        </Suspense>
      }
      aiInsight={<AiInsightCard />}
    />
  )
}
