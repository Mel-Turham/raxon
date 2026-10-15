import { ANALYTICS_RANGE_DAYS } from "../constants"
import type {
  AllocationItem,
  AllocationSource,
  AnalyticsRange,
  AnalyticsSummaryData,
  AnalyticsTrade,
  AssetPerformance,
  PnlBreakdown,
  PnlBucket,
  PortfolioPerformanceData,
  PortfolioPoint,
  TradeStatisticsData,
} from "../types"

const DAY_MS = 24 * 60 * 60 * 1000

const BUCKET_UNIT: Record<AnalyticsRange, PnlBreakdown["unit"]> = {
  "1W": "day",
  "1M": "day",
  "3M": "week",
  "6M": "week",
  "1Y": "month",
}

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0)

const percentChange = (current: number, previous: number) =>
  previous === 0 ? 0 : ((current - previous) / Math.abs(previous)) * 100

const startOfUtcDay = (date: Date) =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

export const splitTradesByRange = (
  trades: AnalyticsTrade[],
  range: AnalyticsRange,
  end: Date
) => {
  const span = ANALYTICS_RANGE_DAYS[range] * DAY_MS
  const endTime = startOfUtcDay(end) + DAY_MS
  const start = endTime - span
  const previousStart = start - span

  return {
    current: trades.filter(
      ({ closedAt }) =>
        closedAt.getTime() >= start && closedAt.getTime() < endTime
    ),
    previous: trades.filter(
      ({ closedAt }) =>
        closedAt.getTime() >= previousStart && closedAt.getTime() < start
    ),
    start: new Date(start),
  }
}

export const getMaxDrawdown = (points: PortfolioPoint[]) => {
  let peak = points[0]?.value ?? 0
  let drawdown = 0
  for (const { value } of points) {
    peak = Math.max(peak, value)
    if (peak > 0) drawdown = Math.min(drawdown, ((value - peak) / peak) * 100)
  }
  return drawdown
}

export const getSummary = (
  current: AnalyticsTrade[],
  previous: AnalyticsTrade[],
  history: PortfolioPoint[]
): AnalyticsSummaryData => {
  const netPnl = sum(current.map((trade) => trade.pnl))
  const tradingVolume = sum(current.map((trade) => trade.volume))
  const wins = current.filter((trade) => trade.pnl > 0).length
  const startValue = history[0]?.value ?? 0

  return {
    netPnl,
    roi: startValue === 0 ? 0 : (netPnl / startValue) * 100,
    tradingVolume,
    tradingVolumeChange: percentChange(
      tradingVolume,
      sum(previous.map((t) => t.volume))
    ),
    feesPaid: sum(current.map((trade) => trade.fee)),
    wins,
    losses: current.length - wins,
    winRate: current.length ? (wins / current.length) * 100 : 0,
    totalTrades: current.length,
    maxDrawdown: getMaxDrawdown(history),
  }
}

export const getPortfolioPerformance = (
  history: PortfolioPoint[],
  pointCount: number
): PortfolioPerformanceData => {
  const startValue = history[0]?.value ?? 0
  const endValue = history.at(-1)?.value ?? 0
  const change = endValue - startValue
  const count = Math.min(pointCount, history.length)
  const sampled =
    count === history.length || count < 2
      ? history
      : Array.from(
          { length: count },
          (_, index) =>
            history[Math.round((index * (history.length - 1)) / (count - 1))]
        )

  return {
    intervals: sampled.map((point, index) => ({
      ...point,
      change: point.value - (sampled[index - 1]?.value ?? startValue),
    })),
    startValue,
    endValue,
    change,
    changePercent: startValue === 0 ? 0 : (change / startValue) * 100,
  }
}

export const getAllocation = (
  allocation: AllocationSource[]
): AllocationItem[] => {
  const total = sum(allocation.map((item) => item.value))
  return allocation.map((item) => ({
    ...item,
    percentage: total === 0 ? 0 : (item.value / total) * 100,
  }))
}

const bucketKey = (time: number, unit: PnlBreakdown["unit"], start: number) => {
  if (unit === "day") return startOfUtcDay(new Date(time))
  if (unit === "week")
    return start + Math.floor((time - start) / (7 * DAY_MS)) * 7 * DAY_MS
  const date = new Date(time)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
}

export const getPnlBreakdown = (
  trades: AnalyticsTrade[],
  range: AnalyticsRange,
  start: Date
): PnlBreakdown => {
  const unit = BUCKET_UNIT[range]
  const startTime = start.getTime()
  const totals = new Map<number, number>()

  const days = ANALYTICS_RANGE_DAYS[range]
  for (let day = 0; day < days; day += 1) {
    totals.set(bucketKey(startTime + day * DAY_MS, unit, startTime), 0)
  }
  for (const trade of trades) {
    const key = bucketKey(trade.closedAt.getTime(), unit, startTime)
    totals.set(key, (totals.get(key) ?? 0) + trade.pnl)
  }

  const buckets: PnlBucket[] = [...totals.entries()]
    .sort(([a], [b]) => a - b)
    .map(([time, pnl]) => ({
      date: new Date(time),
      pnl: Math.round(pnl * 100) / 100,
    }))
  const values = buckets.map((bucket) => bucket.pnl)

  return {
    unit,
    buckets,
    total: sum(values),
    profitable: values.filter((value) => value > 0).length,
    best: values.length ? Math.max(...values) : 0,
    worst: values.length ? Math.min(...values) : 0,
  }
}

export const getTradeStatistics = (
  trades: AnalyticsTrade[]
): TradeStatisticsData => {
  const profits = trades.filter((t) => t.pnl > 0).map((t) => t.pnl)
  const losses = trades.filter((t) => t.pnl <= 0).map((t) => t.pnl)
  const grossProfit = sum(profits)
  const grossLoss = Math.abs(sum(losses))
  const averageProfit = profits.length ? grossProfit / profits.length : 0
  const averageLoss = losses.length ? -grossLoss / losses.length : 0

  return {
    averageProfit,
    averageLoss,
    rewardRisk: averageLoss === 0 ? 0 : averageProfit / Math.abs(averageLoss),
    profitFactor: grossLoss === 0 ? 0 : grossProfit / grossLoss,
    averageHoldingMinutes: trades.length
      ? Math.round(sum(trades.map((t) => t.holdingMinutes)) / trades.length)
      : 0,
    largestWin: profits.length ? Math.max(...profits) : 0,
    largestLoss: losses.length ? Math.min(...losses) : 0,
  }
}

export const getAssetPerformance = (
  trades: AnalyticsTrade[]
): AssetPerformance[] => {
  const groups = new Map<string, AnalyticsTrade[]>()
  for (const trade of trades) {
    groups.set(trade.symbol, [...(groups.get(trade.symbol) ?? []), trade])
  }
  const totalAbsPnl = sum(
    [...groups.values()].map((group) => Math.abs(sum(group.map((t) => t.pnl))))
  )

  return [...groups.values()]
    .map((group) => {
      const netPnl = sum(group.map((t) => t.pnl))
      return {
        name: group[0].name,
        symbol: group[0].symbol,
        trades: group.length,
        volume: sum(group.map((t) => t.volume)),
        netPnl,
        winRate: (group.filter((t) => t.pnl > 0).length / group.length) * 100,
        share: totalAbsPnl === 0 ? 0 : (Math.abs(netPnl) / totalAbsPnl) * 100,
      }
    })
    .sort((a, b) => b.netPnl - a.netPnl)
}
