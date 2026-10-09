import { PORTFOLIO_TOTAL_VALUE, type PortfolioHistoryRange } from "@/constants"
import { type ChartPoint, toChartPoints } from "@/lib/chart-series"
import { createRandom, randomWalk } from "@/lib/random"
import { DAY, HOUR, MARKET_NOW, MINUTE } from "@/lib/time"

export type PortfolioHistoryPoint = ChartPoint & {
  /** Trading activity, 0-1 (drawn as background bars). */
  activity: number
}

type RangeConfig = {
  points: number
  stepMs: number
  /** Axis label format for this range. */
  label: Intl.DateTimeFormatOptions
}

const RANGE_CONFIG: Record<PortfolioHistoryRange, RangeConfig> = {
  "1h": {
    points: 60,
    stepMs: MINUTE,
    label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  },
  "24h": {
    points: 48,
    stepMs: 30 * MINUTE,
    label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  },
  "1w": {
    points: 56,
    stepMs: 3 * HOUR,
    label: { weekday: "short", day: "2-digit", month: "short" },
  },
  "1m": {
    points: 60,
    stepMs: 12 * HOUR,
    label: { day: "2-digit", month: "short" },
  },
  "1y": {
    points: 52,
    stepMs: 7 * DAY,
    label: { month: "short", year: "2-digit" },
  },
  All: {
    points: 60,
    stepMs: 30 * DAY,
    label: { month: "short", year: "numeric" },
  },
}

// Leaves room under the line for the activity bars, as in the design.
const PLOT_BOTTOM_PADDING = 0.6

/**
 * Deterministic mock history ending on the current portfolio value.
 * Replace with the portfolio history endpoint later.
 */
export const buildPortfolioHistory = (range: PortfolioHistoryRange) => {
  const { points, stepMs, label } = RANGE_CONFIG[range]
  const walk = randomWalk({
    seed: `portfolio-${range}`,
    length: points,
    start: PORTFOLIO_TOTAL_VALUE,
    volatility: PORTFOLIO_TOTAL_VALUE * 0.03,
    drift: 0.06,
  })
  const offset = PORTFOLIO_TOTAL_VALUE - walk[walk.length - 1]
  const values = walk.map((value) => value + offset)
  const random = createRandom(`activity-${range}`)

  const data: PortfolioHistoryPoint[] = toChartPoints(values, {
    start: MARKET_NOW - (points - 1) * stepMs,
    stepMs,
    bottomPadding: PLOT_BOTTOM_PADDING,
  }).map((point) => ({ ...point, activity: 0.15 + random() * 0.85 }))

  const first = values[0]
  return {
    data,
    /** `plot = value - baseline`: lets the axis show real values. */
    baseline: data[0].value - data[0].plot,
    labelFormat: label,
    summary: {
      value: PORTFOLIO_TOTAL_VALUE,
      change: ((PORTFOLIO_TOTAL_VALUE - first) / first) * 100,
    },
  }
}

export type PortfolioHistory = ReturnType<typeof buildPortfolioHistory>
