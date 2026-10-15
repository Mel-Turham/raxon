export type OrderBookLevel = {
  price: number
  amount: number
}

export type OrderBook = {
  base: string
  quote: string

  asks: OrderBookLevel[]

  bids: OrderBookLevel[]
  lastPrice: number

  lastChange: number
}

export type TradeSide = "buy" | "sell"

export type Trade = {
  id: string
  price: number
  amount: number
  side: TradeSide

  executedAt: string
}

export type MarketTicker = {
  pair: string
  name: string
  base: string
  quote: string
  lastPrice: number
  high24h: number
  low24h: number
  volumeBase24h: number
  volumeQuote24h: number
}

export type TradingAccount = {
  balances: Record<string, number>

  feeRate: number
}

export type OrderStatus = "open" | "filled" | "cancelled"

export type Order = {
  id: string

  pair: string
  side: TradeSide
  status: OrderStatus
  entryPrice: number

  margin: number

  pnl: number
  amount: number

  value: number

  createdAt: string
}
