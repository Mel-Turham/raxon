export const MARKET_LEADER_PERIODS = ["Week", "Month"] as const

export type MarketLeaderPeriod = (typeof MARKET_LEADER_PERIODS)[number]

export const MARKET_LEADER_DEFAULT_PERIOD: MarketLeaderPeriod = "Month"

export const MARKET_LEADER_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
] as const
