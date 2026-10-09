import {
  BarChartIcon,
  EyeIcon,
  Fire02Icon,
  PlantIcon,
} from "@hugeicons/core-free-icons"

export const MARKET_RANGES = ["1D", "1W", "1M", "1Y", "ALL"] as const

export type MarketRange = (typeof MARKET_RANGES)[number]

export const MARKET_CATEGORIES = [
  "Top",
  "Trending",
  "New",
  "Most Visited",
] as const

export type MarketCategory = (typeof MARKET_CATEGORIES)[number]

export const MARKET_CATEGORY_ICONS = {
  Top: BarChartIcon,
  Trending: Fire02Icon,
  New: PlantIcon,
  "Most Visited": EyeIcon,
} satisfies Record<MarketCategory, typeof BarChartIcon>

export const MARKET_FILTERS = [
  { value: "all", label: "All assets" },
  { value: "gainers", label: "Gainers" },
  { value: "losers", label: "Losers" },
] as const

export type MarketFilter = (typeof MARKET_FILTERS)[number]["value"]
