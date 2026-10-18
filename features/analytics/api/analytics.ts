import "server-only"

import { cache } from "react"

import {
  getAccountTrades,
  getPricedHoldings,
  getValueHistory,
} from "@/shared/account"
import { closeTrades } from "@/shared/account/pnl"
import { buildAnalyticsReport } from "../helpers/report"
import type {
  AllocationSource,
  AnalyticsRange,
  AnalyticsSource,
} from "../types"

const HISTORY_DAYS = 366
const ALLOCATION_SLICES = 4
const TOKEN_COLORS = new Set([
  "ADA",
  "BNB",
  "BTC",
  "DOGE",
  "ETH",
  "MATIC",
  "SOL",
  "TRX",
  "USDC",
  "USDT",
  "XRP",
])

const colorOf = (symbol: string) =>
  TOKEN_COLORS.has(symbol)
    ? `var(--token-${symbol.toLowerCase()})`
    : "var(--chart-3)"

const getAnalyticsSource = cache(async (): Promise<AnalyticsSource> => {
  const [history, holdings, trades] = await Promise.all([
    getValueHistory("1d", HISTORY_DAYS),
    getPricedHoldings(),
    getAccountTrades(),
  ])
  const names = new Map(
    holdings.map((holding) => [holding.symbol, holding.name])
  )
  const held = holdings.filter((holding) => holding.value > 0)
  const rest = held.slice(ALLOCATION_SLICES)
  const allocation: AllocationSource[] = [
    ...held.slice(0, ALLOCATION_SLICES).map((holding) => ({
      name: holding.name,
      symbol: holding.symbol,
      value: holding.value,
      color: colorOf(holding.symbol),
    })),
    ...(rest.length
      ? [
          {
            name: "Other",
            value: rest.reduce((sum, holding) => sum + holding.value, 0),
            color: "var(--muted-foreground)",
          },
        ]
      : []),
  ]

  return {
    portfolioHistory: history.map(({ time, value }) => ({
      date: new Date(time),
      value,
    })),
    allocation,
    trades: closeTrades(trades).map((trade) => ({
      id: trade.id,
      symbol: trade.base,
      name: names.get(trade.base) ?? trade.base,
      closedAt: new Date(trade.closedAt),
      pnl: trade.pnl,
      fee: trade.feeUsd,
      volume: trade.volume,
      holdingMinutes: trade.holdingMinutes,
    })),
  }
})

export const getAnalyticsReport = cache(async (range: AnalyticsRange) =>
  buildAnalyticsReport(await getAnalyticsSource(), range)
)
