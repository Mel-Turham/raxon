import { getMarketAssets, getNewListings } from "@/lib/api/markets"

import { AssetMarket } from "./asset-market"
import { NewListings } from "./new-listings"

// Async Server Components, each streaming behind its own skeleton.

export const NewListingsSection = async () => (
  <NewListings listings={await getNewListings()} />
)

export const AssetMarketSection = async () => {
  const { assets, fxRates } = await getMarketAssets()
  return <AssetMarket assets={assets} fxRates={fxRates} />
}
