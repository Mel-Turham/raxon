import type {
  ChainId,
  MarketCategory,
  MarketRange,
  MarketLeaderPeriod,
  TransactionInterval,
} from "@/constants"

/** Shapes returned by the dashboard API. Keep them serializable. */

export type Kpi = {
  name: string
  pair: string
  price: number
  change: number
}

export type MarketLeader = {
  name: string
  value: number
  change24h: number
  trend: number
  share: number
}

export type MarketLeadersSnapshot = {
  from: string
  to: string
  leaders: MarketLeader[]
}

export type MarketLeadersByPeriod = Record<
  MarketLeaderPeriod,
  MarketLeadersSnapshot
>

export type IntervalMetrics = {
  /** Price change over the interval, in %. */
  change: number
  /** Traded volume over the interval, in USD. */
  volume: number
}

export type Transaction = {
  symbol: string
  name: string
  price: number
  marketCap: number
  /** ISO date of the asset's last trade (drives the range tabs). */
  lastTradeAt: string
  metrics: Record<TransactionInterval, IntervalMetrics>
}

export type TransactionSortKey = "change" | "change7d" | "volume" | "marketCap"

export type Balance = {
  /** Wallet balance in USD, per chain. */
  byChain: Record<ChainId, number>
  /** ISO date of the last balance sync. */
  updatedAt: string
}

export type TopAsset = {
  symbol: string
  name: string
  price: number
  /** 24h change, in %. */
  change: number
}

export type TopGainer = {
  symbol: string
  marketCap: number
  price: number
  /** 24h change, in %. */
  change: number
  /** Rank movement since the previous period. */
  momentum: "up" | "down"
}

export type OrderBookLevel = {
  price: number
  amount: number
}

export type OrderBook = {
  base: string
  quote: string
  /** Sorted by ascending price. */
  asks: OrderBookLevel[]
  /** Sorted by descending price. */
  bids: OrderBookLevel[]
  lastPrice: number
  /** Last price change vs the previous trade, in quote currency. */
  lastChange: number
}

export type TradeSide = "buy" | "sell"

export type Trade = {
  id: string
  price: number
  amount: number
  side: TradeSide
  /** ISO date of execution. */
  executedAt: string
}

export type MarketTicker = {
  /** e.g. "BTC/USDT" */
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
  /** Spendable balance per asset (e.g. USDT, BTC). */
  balances: Record<string, number>
  /** Taker fee, as a fraction of the order size. */
  feeRate: number
}

export type OrderStatus = "open" | "filled" | "cancelled"

export type Order = {
  id: string
  /** e.g. "BTC/USDT" */
  pair: string
  side: TradeSide
  status: OrderStatus
  entryPrice: number
  /** Margin used, in quote currency. */
  margin: number
  /** Unrealised (open) or realised (closed) profit and loss, in %. */
  pnl: number
  amount: number
  /** Order value, in quote currency. */
  value: number
  /** ISO date of creation. */
  createdAt: string
}

export type WatchlistItem = {
  /** e.g. "BTC/USD" */
  pair: string
  base: string
  price: number
  /** 24h change, in %. */
  change: number
}

export type PortfolioMetricKey =
  "portfolioValue" | "marginUsage" | "buyingPower" | "freeCollateral"

export type PortfolioMetric = {
  key: PortfolioMetricKey
  /** Value in USD. */
  value: number
  /** Same value expressed in `asset`. */
  assetAmount: number
  asset: string
  /** Share of the account limit used, 0-100. */
  ratio: number
  /** 24h change of the value, in %. */
  change: number
}

export type WalletHolding = {
  symbol: string
  amount: number
  /** Unit price, in USD. */
  price: number
}

export type PortfolioAsset = {
  symbol: string
  name: string
  /** Last price, in USD. */
  price: number
  /** 24h change, in %. */
  change: number
  /** 24h traded volume, in USD. */
  volume: number
}

export type NewListing = {
  symbol: string
  name: string
  price: number
  /** 24h change, in %. */
  change: number
}

export type MarketAsset = {
  rank: number
  symbol: string
  name: string
  /** Price in USD. */
  price: number
  /** Fully diluted valuation, in USD. */
  fdv: number
  /** 24h volume, in USD. */
  volume: number
  /** Price change per range, in %. */
  change: Record<MarketRange, number>
  /** Lists the asset appears in, besides "Top". */
  categories: Exclude<MarketCategory, "Top">[]
}

export type FxRate = {
  /** ISO 4217 code, e.g. "EUR". */
  code: string
  /** Units of this currency per 1 USD. */
  rate: number
}

/** Every notification Raxon can send. */
export type NotificationType =
  | "security_login"
  | "transfer_request"
  | "order_filled"
  | "support_message"
  | "price_alert"
  | "statement_ready"

export type RequestDecision = "approved" | "declined"

type NotificationBase = {
  id: string
  /** ISO date. */
  createdAt: string
  read: boolean
  archived: boolean
}

export type AppNotification = NotificationBase &
  (
    | {
        type: "security_login"
        device: string
        location: string
        decision?: RequestDecision
      }
    | {
        type: "transfer_request"
        from: string
        amount: number
        asset: string
        decision?: RequestDecision
      }
    | {
        type: "order_filled"
        side: TradeSide
        amount: number
        asset: string
        price: number
      }
    | { type: "support_message"; agent: string; message: string }
    | {
        type: "price_alert"
        asset: string
        price: number
        direction: "above" | "below"
        tags: string[]
      }
    | {
        type: "statement_ready"
        period: string
        fileName: string
        sizeKb: number
      }
  )
