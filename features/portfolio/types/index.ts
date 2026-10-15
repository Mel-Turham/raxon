export type WatchlistItem = {
  pair: string
  base: string
  price: number

  change: number
}

export type PortfolioMetricKey =
  "portfolioValue" | "marginUsage" | "buyingPower" | "freeCollateral"

export type PortfolioMetric = {
  key: PortfolioMetricKey

  value: number

  assetAmount: number
  asset: string

  ratio: number

  change: number
}

export type WalletHolding = {
  symbol: string
  amount: number

  price: number
}

export type PortfolioAsset = {
  symbol: string
  name: string

  price: number

  change: number

  volume: number
}
