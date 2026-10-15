import { ANALYTICS_RANGE_LABELS } from "../constants"
import type { AnalyticsReport } from "../types"

export const buildExportRows = ({
  range,
  summary,
  statistics,
  assets,
}: AnalyticsReport): (string | number)[][] => [
  ["Report", "Period", ANALYTICS_RANGE_LABELS[range]],
  ["Overview", "Net P&L (USD)", summary.netPnl.toFixed(2)],
  ["Overview", "Return on portfolio (%)", summary.roi.toFixed(2)],
  ["Overview", "Trading volume (USD)", summary.tradingVolume.toFixed(2)],
  [
    "Overview",
    "Trading volume change (%)",
    summary.tradingVolumeChange.toFixed(1),
  ],
  ["Overview", "Fees paid (USD)", summary.feesPaid.toFixed(2)],
  ["Overview", "Win rate (%)", summary.winRate.toFixed(1)],
  ["Overview", "Winning trades", summary.wins],
  ["Overview", "Losing trades", summary.losses],
  ["Overview", "Max drawdown (%)", summary.maxDrawdown.toFixed(2)],
  ["Statistics", "Average profit (USD)", statistics.averageProfit.toFixed(2)],
  ["Statistics", "Average loss (USD)", statistics.averageLoss.toFixed(2)],
  ["Statistics", "Reward / risk", statistics.rewardRisk.toFixed(2)],
  ["Statistics", "Profit factor", statistics.profitFactor.toFixed(2)],
  [
    "Statistics",
    "Average holding time (minutes)",
    statistics.averageHoldingMinutes,
  ],
  ["Statistics", "Largest win (USD)", statistics.largestWin.toFixed(2)],
  ["Statistics", "Largest loss (USD)", statistics.largestLoss.toFixed(2)],
  ...assets.map((asset) => [
    "Asset",
    `${asset.name} (${asset.symbol}) net P&L (USD)`,
    asset.netPnl.toFixed(2),
  ]),
]
