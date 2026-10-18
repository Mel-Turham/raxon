import type {
  MARKET_INSIGHT_SEGMENTS,
  MARKET_MOVER_TABS,
  MARKET_SIGNALS,
  MARKET_STAT_IDS,
} from "../constants"

export type MarketMoverTab = (typeof MARKET_MOVER_TABS)[number]
export type MarketInsightSegment = (typeof MARKET_INSIGHT_SEGMENTS)[number]
export type MarketSignal = (typeof MARKET_SIGNALS)[number]
export type MarketStatId = (typeof MARKET_STAT_IDS)[number]
export type MarketTone = "up" | "down" | "flat"

export type MarketTicker = {
  symbol: string
  name: string
  price: number
  change: number
}

export type MarketMover = {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}

export type MarketMovers = Record<MarketMoverTab, MarketMover[]>

export type SectorPerformance = {
  id: string
  name: string
  change24h: number
  marketCap: number
  leaders: string[]
}

export type MarketNewsItem = {
  id: string
  title: string
  excerpt: string
  source: string
  publishedAt: string
  sentiment: number
  symbols: string[]
}

export type MarketQuote = {
  pair: string
  base: string
  bid: number
  ask: number
  low: number
  high: number
  previous: number
}

export type MarketInsights = Record<MarketInsightSegment, MarketQuote[]>

export type MarketSentimentItem = {
  pair: string
  base: string
  signal: MarketSignal
  longShortRatio: number
  longPercent: number
}

export type MarketSentimentOverview = {
  updatedAt: string
  items: MarketSentimentItem[]
}

export type MarketStatRow = {
  label: string
  value: number
  change: number
}

export type MarketStat = {
  id: MarketStatId
  label: string
  value: number
  change: number
  rows: MarketStatRow[]
}
