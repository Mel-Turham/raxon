import type { PortfolioHistoryRange } from "@/features/portfolio/constants"
import type { HistoryValuePoint } from "@/features/portfolio/types"
import type { ChartPoint } from "@/shared/charts/lib/chart-series"

export type PortfolioHistoryPoint = ChartPoint & {
  activity: number
}

type RangeConfig = {
  interval: string
  points: number

  label: Intl.DateTimeFormatOptions
}

const RANGE_CONFIG: Record<PortfolioHistoryRange, RangeConfig> = {
  "1h": {
    interval: "1m",
    points: 60,
    label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  },
  "24h": {
    interval: "30m",
    points: 48,
    label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" },
  },
  "1w": {
    interval: "4h",
    points: 42,
    label: { weekday: "short", day: "2-digit", month: "short" },
  },
  "1m": {
    interval: "12h",
    points: 60,
    label: { day: "2-digit", month: "short" },
  },
  "1y": {
    interval: "1w",
    points: 52,
    label: { month: "short", year: "2-digit" },
  },
  All: {
    interval: "1M",
    points: 60,
    label: { month: "short", year: "numeric" },
  },
}

const PLOT_BOTTOM_PADDING = 0.6

export const historyWindow = (range: PortfolioHistoryRange) => {
  const { interval, points } = RANGE_CONFIG[range]
  return { interval, limit: points }
}

export const buildPortfolioHistory = (
  range: PortfolioHistoryRange,
  points: HistoryValuePoint[]
) => {
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const baseline = min - (Math.max(...values) - min) * PLOT_BOTTOM_PADDING
  const data: PortfolioHistoryPoint[] = points.map(
    ({ time, value, activity }) => ({
      date: new Date(time),
      value,
      plot: value - baseline,
      activity,
    })
  )

  const first = values[0] ?? 0
  const last = values.at(-1) ?? 0
  return {
    data,
    baseline,
    labelFormat: RANGE_CONFIG[range].label,
    summary: {
      value: last,
      change: first ? ((last - first) / first) * 100 : 0,
    },
  }
}

export type PortfolioHistory = ReturnType<typeof buildPortfolioHistory>
