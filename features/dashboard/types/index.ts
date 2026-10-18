import type { MarketLeaderPeriod } from "../constants/market-leaders"
import type { TransactionInterval } from "../constants/transactions"

export type Kpi = {
  name: string
  pair: string
  price: number
  change: number
}

export type MarketLeader = {
  name: string
  value: number
  change24h: number
  trend: number
  share: number
}

export type MarketLeadersSnapshot = {
  from: string
  to: string
  leaders: MarketLeader[]
}

export type MarketLeadersByPeriod = Record<
  MarketLeaderPeriod,
  MarketLeadersSnapshot
>

export type IntervalMetrics = {
  change: number

  volume: number
}

export type Transaction = {
  symbol: string
  name: string
  price: number
  marketCap: number

  lastTradeAt: string
  metrics: Record<TransactionInterval, IntervalMetrics>
}

export type TransactionSortKey = "change" | "change7d" | "volume" | "marketCap"

export type Balance = {
  total: number
  available: number
  inOrders: number

  updatedAt: string
}

export type TopAsset = {
  symbol: string
  name: string
  price: number

  change: number
}

export type TopGainer = {
  symbol: string
  marketCap: number
  price: number

  change: number

  momentum: "up" | "down"
}
