export {
  CANDLE_DURATION,
  CANDLE_TIMEFRAMES,
  CANDLE_ZOOM,
  type CandleTimeframe,
  CHART_VIEWS,
  type ChartView,
  DEFAULT_CANDLE_TIMEFRAME,
  MOVING_AVERAGES,
  type MovingAverageKey,
} from "@/shared/config/chart"

export const TRADE_PAIRS = ["BTC/USDT", "ETH/USDT", "SOL/USDT"] as const

export const TRADE_PAIR_NAMES: Record<string, string> = {
  "BTC/USDT": "Bitcoin",
  "ETH/USDT": "Ethereum",
  "SOL/USDT": "Solana",
}

export const ORDER_BOOK_ROWS = 7
export const MARKET_TRADES_LIMIT = 15
export const LIVE_FLUSH_MS = 1000

export const DEFAULT_TRADE_PAIR = TRADE_PAIRS[0]

export const parseTradePair = (value: unknown): string =>
  TRADE_PAIRS.find((pair) => pair === value) ?? DEFAULT_TRADE_PAIR

export const tradePairHref = (pair: string) =>
  `/trade?pair=${encodeURIComponent(pair)}`

export const ORDER_SIDES = ["Buy", "Sell"] as const

export type OrderSide = (typeof ORDER_SIDES)[number]

export const TIME_IN_FORCE = [
  { value: "GTC", label: "Good till cancelled" },
  { value: "DAY", label: "Day" },
  { value: "WEEK", label: "Week" },
  { value: "MONTH", label: "Month" },
] as const

export type TimeInForce = (typeof TIME_IN_FORCE)[number]["value"]

export const ORDER_FORM_DEFAULTS = {
  side: "Buy" as OrderSide,

  size: 500,
  timeInForce: "WEEK" as TimeInForce,

  stopDistance: 0.02,
}

export const SIZE_MARKS = [0, 25, 50, 75, 100] as const

export const ORDER_TABS = ["Active Order", "Order History"] as const

export type OrderTab = (typeof ORDER_TABS)[number]
