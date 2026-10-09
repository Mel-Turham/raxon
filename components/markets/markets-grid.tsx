import type { ReactNode } from "react"

type MarketsGridProps = {
  newListings: ReactNode
  viewAll: ReactNode
  assetMarket: ReactNode
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-base font-medium">{children}</h2>
)

/** Markets page: newest listings strip, then the asset market table. */
export const MarketsGrid = ({
  newListings,
  viewAll,
  assetMarket,
}: MarketsGridProps) => (
  <main className="flex flex-col gap-3 p-4">
    <div className="flex items-center justify-between pt-1">
      <SectionTitle>Newest &amp; Most Traded Assets</SectionTitle>
      {viewAll}
    </div>
    {newListings}
    <div className="pt-3">
      <SectionTitle>Asset Market</SectionTitle>
    </div>
    {assetMarket}
  </main>
)
