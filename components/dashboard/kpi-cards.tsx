import type { ReactNode } from "react"

import type { Kpi } from "@/lib/api/types"

import { KpiCard } from "./kpi-card"

export const KpiGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{children}</div>
)

export const KpiCards = ({ items }: { items: Kpi[] }) => {
  return (
    <KpiGrid>
      {items.map((item) => (
        <KpiCard key={item.pair} {...item} />
      ))}
    </KpiGrid>
  )
}
