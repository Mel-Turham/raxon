import type { AnalyticsRange } from "./types"

export const ANALYTICS_RANGES: readonly AnalyticsRange[] = [
  "1W",
  "1M",
  "3M",
  "6M",
  "1Y",
]

export const ANALYTICS_RANGE_DAYS: Record<AnalyticsRange, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 365,
}

export const ANALYTICS_RANGE_LABELS: Record<AnalyticsRange, string> = {
  "1W": "Last 7 days",
  "1M": "Last 30 days",
  "3M": "Last 90 days",
  "6M": "Last 6 months",
  "1Y": "Last 12 months",
}

export const ANALYTICS_DEFAULT_RANGE: AnalyticsRange = "1M"

export const ANALYTICS_CHART_POINTS: Record<AnalyticsRange, number> = {
  "1W": 7,
  "1M": 15,
  "3M": 21,
  "6M": 24,
  "1Y": 24,
}

export const parseAnalyticsRange = (value: unknown): AnalyticsRange =>
  ANALYTICS_RANGES.find((range) => range === value) ?? ANALYTICS_DEFAULT_RANGE

export const LOSS_COLOR = "var(--destructive)"
