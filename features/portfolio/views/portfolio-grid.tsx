import type { ReactNode } from "react"

import { BentoCell } from "@/shared/components/molecules/bento-cell"

type PortfolioGridProps = {
  watchlist: ReactNode
  actions: ReactNode
  metrics: ReactNode
  history: ReactNode
  exchange: ReactNode
  assets: ReactNode
  converter: ReactNode
}

export const PortfolioGrid = ({
  watchlist,
  actions,
  metrics,
  history,
  exchange,
  assets,
  converter,
}: PortfolioGridProps) => (
  <main className="flex flex-col gap-3 p-4">
    <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
      {watchlist}
      {actions}
    </div>
    {metrics}
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_372px]">
      <BentoCell>{history}</BentoCell>
      <BentoCell>{exchange}</BentoCell>
      <BentoCell>{assets}</BentoCell>
      <BentoCell>{converter}</BentoCell>
    </div>
  </main>
)
