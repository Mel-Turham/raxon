import type { ReactNode } from "react"

import { BentoCell } from "@/shared/components/molecules/bento-cell"

import { TradePairProvider } from "../components/trade-pair-context"
import { LiveMarketProvider } from "../state/live-market"

type TradeGridProps = {
  initialPair: string
  orderBook: ReactNode
  marketChart: ReactNode
  orderForm: ReactNode
  runningTrades: ReactNode
  orders: ReactNode
  aiInsight: ReactNode
}

export const TradeGrid = ({
  initialPair,
  orderBook,
  marketChart,
  orderForm,
  runningTrades,
  orders,
  aiInsight,
}: TradeGridProps) => (
  <TradePairProvider initialPair={initialPair}>
    <LiveMarketProvider>
      <main className="grid gap-3 p-4 xl:grid-cols-[320px_minmax(0,1fr)_360px] xl:[grid-template-areas:'book_chart_form'_'trades_orders_ai']">
        <BentoCell className="xl:[grid-area:book]">{orderBook}</BentoCell>
        <BentoCell className="xl:[grid-area:chart]">{marketChart}</BentoCell>
        <BentoCell className="xl:[grid-area:form]">{orderForm}</BentoCell>
        <BentoCell className="xl:[grid-area:trades]">{runningTrades}</BentoCell>
        <BentoCell className="xl:[grid-area:orders]">{orders}</BentoCell>
        <BentoCell className="xl:[grid-area:ai]">{aiInsight}</BentoCell>
      </main>
    </LiveMarketProvider>
  </TradePairProvider>
)
