import { DAY, HOUR, MINUTE } from "@/shared/lib/time"

export const CHART_VIEWS = ["Candle", "Depth"] as const

export type ChartView = (typeof CHART_VIEWS)[number]

export const CANDLE_TIMEFRAMES = [
  "1m",
  "5m",
  "15m",
  "30m",
  "1h",
  "4h",
  "1D",
  "1W",
] as const

export type CandleTimeframe = (typeof CANDLE_TIMEFRAMES)[number]

export const DEFAULT_CANDLE_TIMEFRAME: CandleTimeframe = "1m"

export const CANDLE_DURATION: Record<CandleTimeframe, number> = {
  "1m": MINUTE,
  "5m": 5 * MINUTE,
  "15m": 15 * MINUTE,
  "30m": 30 * MINUTE,
  "1h": HOUR,
  "4h": 4 * HOUR,
  "1D": DAY,
  "1W": 7 * DAY,
}

export const MOVING_AVERAGES = [
  { key: "maFast", period: 7, color: "var(--chart-ma-fast)" },
  { key: "maSlow", period: 25, color: "var(--chart-ma-slow)" },
] as const

export type MovingAverageKey = (typeof MOVING_AVERAGES)[number]["key"]

export const CANDLE_ZOOM = { default: 72, min: 24, max: 120, step: 12 } as const
