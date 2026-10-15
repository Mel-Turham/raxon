export type AnalyticsRange = "1W" | "1M" | "3M" | "6M" | "1Y"

export type PortfolioPoint = {
  date: Date
  value: number
}

export type AnalyticsTrade = {
  id: string
  symbol: string
  name: string
  closedAt: Date
  pnl: number
  fee: number
  volume: number
  holdingMinutes: number
}

export type AllocationSource = {
  name: string
  symbol?: string
  value: number
  color: string
}

export type AnalyticsSource = {
  portfolioHistory: PortfolioPoint[]
  allocation: AllocationSource[]
  trades: AnalyticsTrade[]
}

export type AnalyticsSummaryData = {
  netPnl: number
  roi: number
  tradingVolume: number
  tradingVolumeChange: number
  feesPaid: number
  wins: number
  losses: number
  winRate: number
  totalTrades: number
  maxDrawdown: number
}

export type PortfolioInterval = PortfolioPoint & {
  change: number
}

export type PortfolioPerformanceData = {
  intervals: PortfolioInterval[]
  startValue: number
  endValue: number
  change: number
  changePercent: number
}

export type AllocationItem = AllocationSource & {
  percentage: number
}

export type PnlBucket = {
  date: Date
  pnl: number
}

export type PnlBreakdown = {
  unit: "day" | "week" | "month"
  buckets: PnlBucket[]
  total: number
  profitable: number
  best: number
  worst: number
}

export type TradeStatisticsData = {
  averageProfit: number
  averageLoss: number
  rewardRisk: number
  profitFactor: number
  averageHoldingMinutes: number
  largestWin: number
  largestLoss: number
}

export type AssetPerformance = {
  name: string
  symbol: string
  trades: number
  volume: number
  netPnl: number
  winRate: number
  share: number
}

export type AnalyticsReport = {
  range: AnalyticsRange
  summary: AnalyticsSummaryData
  performance: PortfolioPerformanceData
  allocation: AllocationItem[]
  breakdown: PnlBreakdown
  statistics: TradeStatisticsData
  assets: AssetPerformance[]
}
