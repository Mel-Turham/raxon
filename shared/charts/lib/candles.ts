import {
  CANDLE_ZOOM,
  MOVING_AVERAGES,
  type MovingAverageKey,
} from "@/shared/config/chart"

export type Candle = {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
} & Partial<Record<MovingAverageKey, number>>

export const CANDLE_COUNT = CANDLE_ZOOM.max + 30

const movingAverage = (closes: number[], period: number) =>
  closes.map((_, index) => {
    if (index + 1 < period) return undefined
    let sum = 0
    for (let i = index + 1 - period; i <= index; i++) sum += closes[i]
    return sum / period
  })

export const withMovingAverages = (candles: Candle[]): Candle[] => {
  const closes = candles.map((candle) => candle.close)
  const averages = MOVING_AVERAGES.map(({ key, period }) => ({
    key,
    values: movingAverage(closes, period),
  }))

  return candles.map((candle, index) => {
    const next: Candle = { ...candle }
    for (const { key, values } of averages) next[key] = values[index]
    return next
  })
}
