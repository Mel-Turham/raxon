import type { PortfolioRange } from "@/features/dashboard/constants"
import type { ChartPoint } from "@/shared/charts/lib/chart-series"

export type PortfolioPoint = ChartPoint

export type PortfolioSegment = { start: Date; end: Date; label: string }

export type ValuePoint = { time: number; value: number }

type RangeConfig = {
  interval: string
  segments: number
  pointsPerSegment: number
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
    interval: "15m",
    segments: 6,
    pointsPerSegment: 8,
    label: timeLabel,
    comparison: "vs Last 12 hours",
  },
  "2H": {
    interval: "5m",
    segments: 6,
    pointsPerSegment: 4,
    label: timeLabel,
    comparison: "vs Last 2 hours",
  },
  "1D": {
    interval: "30m",
    segments: 6,
    pointsPerSegment: 8,
    label: timeLabel,
    comparison: "vs Last 24 hours",
  },
  "7D": {
    interval: "4h",
    segments: 7,
    pointsPerSegment: 6,
    label: utcFormat({ weekday: "long" }),
    comparison: "vs Last 7 days",
  },
  "1M": {
    interval: "12h",
    segments: 6,
    pointsPerSegment: 10,
    label: utcFormat({ month: "short", day: "numeric" }),
    comparison: "vs Last 30 days",
  },
  "1Y": {
    interval: "1d",
    segments: 12,
    pointsPerSegment: 30,
    label: utcFormat({ month: "short" }),
    comparison: "vs Last year",
  },
}

export const portfolioWindow = (range: PortfolioRange) => {
  const { interval, segments, pointsPerSegment } = RANGE_CONFIG[range]
  return { interval, limit: segments * pointsPerSegment + 1 }
}

export const buildPortfolioSeries = (
  range: PortfolioRange,
  points: ValuePoint[]
) => {
  const { segments, label, comparison } = RANGE_CONFIG[range]
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const baseline = min - (Math.max(...values) - min) * PLOT_BOTTOM_PADDING
  const data: PortfolioPoint[] = points.map(({ time, value }) => ({
    date: new Date(time),
    value,
    plot: value - baseline,
  }))

  const perSegment = Math.max(1, Math.floor((data.length - 1) / segments))
  const segmentList: PortfolioSegment[] = Array.from(
    { length: Math.min(segments, Math.floor((data.length - 1) / perSegment)) },
    (_, i) => {
      const start = data[i * perSegment].date
      const end = data[(i + 1) * perSegment].date
      const middle = new Date((start.getTime() + end.getTime()) / 2)
      return { start, end, label: label.format(middle) }
    }
  )

  const first = values[0] ?? 0
  const last = values.at(-1) ?? 0
  const summary = {
    value: last,
    change: first ? ((last - first) / first) * 100 : 0,
    comparison,
  }

  return { data, segments: segmentList, summary }
}

export type PortfolioSeries = ReturnType<typeof buildPortfolioSeries>
