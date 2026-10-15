import { ANALYTICS_CHART_POINTS, ANALYTICS_RANGE_DAYS } from "../constants"
import type { AnalyticsRange, AnalyticsReport, AnalyticsSource } from "../types"
import {
  getAllocation,
  getAssetPerformance,
  getPnlBreakdown,
  getPortfolioPerformance,
  getSummary,
  getTradeStatistics,
  splitTradesByRange,
} from "./metrics"

export const buildAnalyticsReport = (
  source: AnalyticsSource,
  range: AnalyticsRange
): AnalyticsReport => {
  const history = source.portfolioHistory.slice(-ANALYTICS_RANGE_DAYS[range])
  const end = history.at(-1)?.date ?? new Date()
  const { current, previous, start } = splitTradesByRange(
    source.trades,
    range,
    end
  )

  return {
    range,
    summary: getSummary(current, previous, history),
    performance: getPortfolioPerformance(
      history,
      ANALYTICS_CHART_POINTS[range]
    ),
    allocation: getAllocation(source.allocation),
    breakdown: getPnlBreakdown(current, range, start),
    statistics: getTradeStatistics(current),
    assets: getAssetPerformance(current),
  }
}
