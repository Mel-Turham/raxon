import {
  PORTFOLIO_CURRENT_VALUE,
  PORTFOLIO_DEFAULT_RANGE,
  type PortfolioRange,
} from "@/features/dashboard/constants"
import {
  type ChartPoint,
  toChartPoints,
} from "@/shared/charts/lib/chart-series"
import { randomWalk } from "@/shared/lib/random"
import { DAY, HOUR, MARKET_NOW, MINUTE } from "@/shared/lib/time"

export type PortfolioPoint = ChartPoint

export type PortfolioSegment = { start: Date; end: Date; label: string }

type RangeConfig = {
  segments: number
  pointsPerSegment: number
  stepMs: number
  label: Intl.DateTimeFormat
  comparison: string
}

const PLOT_BOTTOM_PADDING = 0.25

const utcFormat = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" })

const timeLabel = utcFormat({
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

const RANGE_CONFIG: Record<PortfolioRange, RangeConfig> = {
  "12H": {
    segments: 6,
    pointsPerSegment: 8,
    stepMs: 15 * MINUTE,
    label: timeLabel,
    comparison: "vs Last 12 hours",
  },
  "2H": {
    segments: 6,
    pointsPerSegment: 5,
    stepMs: 4 * MINUTE,
    label: timeLabel,
    comparison: "vs Last 2 hours",
  },
  "1D": {
    segments: 6,
    pointsPerSegment: 8,
    stepMs: 30 * MINUTE,
    label: timeLabel,
    comparison: "vs Last 24 hours",
  },
  "7D": {
    segments: 7,
    pointsPerSegment: 6,
    stepMs: 4 * HOUR,
    label: utcFormat({ weekday: "long" }),
    comparison: "vs Last 7 days",
  },
  "1M": {
    segments: 6,
    pointsPerSegment: 10,
    stepMs: 12 * HOUR,
    label: utcFormat({ month: "short", day: "numeric" }),
    comparison: "vs Last 30 days",
  },
  "1Y": {
    segments: 12,
    pointsPerSegment: 6,

    stepMs: (365 * DAY) / 72,
    label: utcFormat({ month: "short" }),
    comparison: "vs Last year",
  },
}

export const buildPortfolioSeries = (range: PortfolioRange) => {
  const { segments, pointsPerSegment, stepMs, label, comparison } =
    RANGE_CONFIG[range]
  const total = segments * pointsPerSegment
  const walk = randomWalk({
    seed: range,
    length: total + 1,
    start: PORTFOLIO_CURRENT_VALUE,
    volatility: 1_800,
    drift: 0.04,
  })

  const offset =
    range === PORTFOLIO_DEFAULT_RANGE
      ? PORTFOLIO_CURRENT_VALUE - walk[walk.length - 1]
      : 0
  const values = walk.map((value) => value + offset)
  const data = toChartPoints(values, {
    start: MARKET_NOW - total * stepMs,
    stepMs,
    bottomPadding: PLOT_BOTTOM_PADDING,
  })

  const segmentList: PortfolioSegment[] = Array.from(
    { length: segments },
    (_, i) => {
      const start = data[i * pointsPerSegment].date
      const end = data[(i + 1) * pointsPerSegment].date
      const middle = new Date((start.getTime() + end.getTime()) / 2)
      return { start, end, label: label.format(middle) }
    }
  )

  const first = values[0]
  const last = values[values.length - 1]
  const summary = {
    value: last,
    change: ((last - first) / first) * 100,
    comparison,
  }

  return { data, segments: segmentList, summary }
}

export type PortfolioSeries = ReturnType<typeof buildPortfolioSeries>
