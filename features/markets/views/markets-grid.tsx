import type { ReactNode } from "react"

import { LivePricesProvider } from "../state/live-prices"

type MarketsGridProps = {
  tickers: ReactNode
  movers: ReactNode
  sectors: ReactNode
  news: ReactNode
  insights: ReactNode
  sentiment: ReactNode
  stats: ReactNode
}

export const MarketsGrid = ({
  tickers,
  movers,
  sectors,
  news,
  insights,
  sentiment,
  stats,
}: MarketsGridProps) => (
  <LivePricesProvider>
    <main className="flex min-w-0 flex-col gap-3 p-4">
      {tickers}
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {movers}
        {sectors}
        <div className="flex flex-col *:flex-1 lg:col-span-2 xl:col-span-1">
          {news}
        </div>
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {insights}
        {sentiment}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats}</div>
    </main>
  </LivePricesProvider>
)
