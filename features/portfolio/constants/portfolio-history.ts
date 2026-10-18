export const PORTFOLIO_HISTORY_RANGES = [
  "1h",
  "24h",
  "1w",
  "1m",
  "1y",
  "All",
] as const

export type PortfolioHistoryRange = (typeof PORTFOLIO_HISTORY_RANGES)[number]

export const PORTFOLIO_HISTORY_DEFAULT_RANGE: PortfolioHistoryRange = "1w"

export const WATCHLIST_DEFAULT = ["BTC", "ETH"]

export const WATCHLIST_CANDIDATE_COUNT = 6

export const EXCHANGE_MODES = ["Swap", "Limit"] as const

export type ExchangeMode = (typeof EXCHANGE_MODES)[number]

export const ASSET_FILTERS = [
  { value: "all", label: "All assets" },
  { value: "gainers", label: "Gainers" },
  { value: "losers", label: "Losers" },
] as const

export type AssetFilter = (typeof ASSET_FILTERS)[number]["value"]
