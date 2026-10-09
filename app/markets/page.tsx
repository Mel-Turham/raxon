import { Suspense } from "react"

import {
  AssetMarketSection,
  AssetMarketSkeleton,
  MarketsGrid,
  NewListingsSection,
  NewListingsSkeleton,
  ViewAllLink,
} from "@/components/markets"

export default function MarketsPage() {
  return (
    <MarketsGrid
      newListings={
        <Suspense fallback={<NewListingsSkeleton />}>
          <NewListingsSection />
        </Suspense>
      }
      viewAll={<ViewAllLink />}
      assetMarket={
        <Suspense fallback={<AssetMarketSkeleton />}>
          <AssetMarketSection />
        </Suspense>
      }
    />
  )
}
