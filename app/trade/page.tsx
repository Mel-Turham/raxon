import { Suspense } from "react"

import {
  AiInsightCard,
  MarketChartSection,
  MarketChartSkeleton,
  OrderBookSection,
  OrderBookSkeleton,
  OrderFormSection,
  OrderFormSkeleton,
  OrdersCardSkeleton,
  OrdersSection,
  RunningTradesSection,
  RunningTradesSkeleton,
  TradeGrid,
} from "@/components/trade"

export default function TradePage() {
  return (
    <TradeGrid
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
