import type { ReactNode } from "react"

import { BentoCell } from "@/components/shared/bento-cell"

type DashboardGridProps = {
  kpis: ReactNode
  marketLeaders: ReactNode
  portfolio: ReactNode
  transactions: ReactNode
  balance: ReactNode
  topAssets: ReactNode
  topGainers: ReactNode
}

export const DashboardGrid = ({
  kpis,
  marketLeaders,
  portfolio,
  transactions,
  balance,
  topAssets,
  topGainers,
}: DashboardGridProps) => {
  return (
    <main className="grid gap-3 p-4 xl:grid-cols-[minmax(0,1fr)_372px]">
      {/*LEFT COLUMN*/}
      <section className="flex min-w-0 flex-col gap-3">
        {kpis}
        <div className="grid gap-3 xl:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
          {marketLeaders}
          {portfolio}
        </div>
        <BentoCell className="flex-1">{transactions}</BentoCell>
      </section>

      {/*RIGHT BAR*/}
      <aside className="flex min-w-0 flex-col gap-3">
        {balance}
        {topAssets}
        <BentoCell className="flex-1">{topGainers}</BentoCell>
      </aside>
    </main>
  )
}
