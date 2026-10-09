import {
  CANDLE_DURATION,
  CANDLE_ZOOM,
  type CandleTimeframe,
  MOVING_AVERAGES,
  type MovingAverageKey,
} from "@/constants"
import { createRandom } from "@/lib/random"
import { MARKET_NOW } from "@/lib/time"

export type Candle = {
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
} & Partial<Record<MovingAverageKey, number>>

// Enough history for the slowest average on the widest zoom.
const CANDLE_COUNT = CANDLE_ZOOM.max + 30

/** Simple moving average of the closes; undefined until `period` candles. */
const movingAverage = (closes: number[], period: number) =>
  closes.map((_, index) => {
    if (index + 1 < period) return undefined
    let sum = 0
    for (let i = index + 1 - period; i <= index; i++) sum += closes[i]
    return sum / period
  })

/**
 * Deterministic mock candles ending on `lastPrice`, so server and client
 * renders match. Replace with the exchange klines endpoint later.
 */
export const buildCandles = (
  pair: string,
  timeframe: CandleTimeframe,
  lastPrice: number
): Candle[] => {
  const random = createRandom(`${pair}-${timeframe}`)
  const step = CANDLE_DURATION[timeframe]
  const volatility = lastPrice * 0.004

  // Walk backwards from the last price so the chart ends on it.
  const closes: number[] = []
  let price = lastPrice
  for (let i = 0; i < CANDLE_COUNT; i++) {
    closes.unshift(price)
    price -= (random() - 0.5) * volatility * 2
  }

  const averages = MOVING_AVERAGES.map(({ key, period }) => ({
    key,
    values: movingAverage(closes, period),
  }))

  return closes.map((close, index) => {
    const open = index === 0 ? close : closes[index - 1]
    const wick = volatility * (0.3 + random())
    const candle: Candle = {
      date: new Date(MARKET_NOW - (CANDLE_COUNT - index) * step),
      open,
      close,
      high: Math.max(open, close) + wick * random(),
      low: Math.min(open, close) - wick * random(),
      volume: 20 + random() * 80,
    }
    for (const { key, values } of averages) candle[key] = values[index]
    return candle
  })
}
