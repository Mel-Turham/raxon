import type {
  MarketTicker,
  Order,
  OrderBook,
  Trade,
  TradeSide,
  TradingAccount,
} from "@/lib/api/types"
import { MARKET_NOW, MINUTE } from "@/lib/time"

// Temporary payloads until the external API is plugged in.

const level = (price: number, amount: number) => ({ price, amount })

export const MOCK_ORDER_BOOK: OrderBook = {
  base: "BTC",
  quote: "USDT",
  asks: [
    level(105_901.3, 0.00075),
    level(105_902.75, 0.16641),
    level(105_904.1, 0.34885),
    level(105_905.6, 0.58141),
    level(105_908.2, 0.16641),
    level(105_910.85, 0.09377),
    level(105_912.4, 0.00075),
  ],
  bids: [
    level(105_899.2, 0.60703),
    level(105_897.55, 0.217),
    level(105_895.1, 0.0601),
    level(105_893.8, 0.01463),
    level(105_890.25, 0.07997),
    level(105_888.6, 0.07997),
    level(105_885.4, 0.02691),
  ],
  lastPrice: 105_900.59,
  lastChange: 10,
}

const trade = (
  id: string,
  price: number,
  amount: number,
  side: TradeSide,
  minutesAgo: number
): Trade => ({
  id,
  price,
  amount,
  side,
  executedAt: new Date(MARKET_NOW - minutesAgo * MINUTE).toISOString(),
})

/** Latest trades on the market (Order Book > Trade history tab). */
export const MOCK_MARKET_TRADES: Trade[] = [
  trade("m1", 105_900.59, 0.01204, "buy", 0.2),
  trade("m2", 105_899.2, 0.0451, "sell", 0.6),
  trade("m3", 105_901.3, 0.00312, "buy", 1.1),
  trade("m4", 105_898.75, 0.1286, "sell", 1.9),
  trade("m5", 105_902.1, 0.0067, "buy", 2.4),
  trade("m6", 105_897.4, 0.2213, "sell", 3.2),
  trade("m7", 105_903.8, 0.0182, "buy", 4.5),
  trade("m8", 105_896.05, 0.0739, "sell", 5.1),
  trade("m9", 105_904.6, 0.0025, "buy", 6.8),
  trade("m10", 105_895.3, 0.3311, "sell", 7.4),
  trade("m11", 105_905.2, 0.0098, "buy", 8.9),
  trade("m12", 105_894.9, 0.0544, "sell", 9.6),
  trade("m13", 105_906.45, 0.0161, "buy", 11.2),
  trade("m14", 105_893.1, 0.0907, "sell", 12.5),
  trade("m15", 105_907.9, 0.0043, "buy", 13.8),
]

/** The user's open positions (Running trade card). */
export const MOCK_RUNNING_TRADES: Trade[] = [
  trade("r1", 32_121.53, 108, "buy", 8),
  trade("r2", 1_985.25, 99.5, "buy", 42),
  trade("r3", 95.5, 125.75, "sell", 100),
  trade("r4", 0.715, 76.2, "sell", 122),
  trade("r5", 105.3, 210, "buy", 182),
]

export const MOCK_TICKERS: MarketTicker[] = [
  {
    pair: "BTC/USDT",
    name: "Bitcoin",
    base: "BTC",
    quote: "USDT",
    lastPrice: 105_900.59,
    high24h: 107_250.9,
    low24h: 103_211.4,
    volumeBase24h: 235_676.77,
    volumeQuote24h: 24_957_812_340.5,
  },
  {
    pair: "ETH/USDT",
    name: "Ethereum",
    base: "ETH",
    quote: "USDT",
    lastPrice: 4_320.75,
    high24h: 4_412.3,
    low24h: 4_188.05,
    volumeBase24h: 1_204_331.2,
    volumeQuote24h: 5_203_996_118.4,
  },
  {
    pair: "SOL/USDT",
    name: "Solana",
    base: "SOL",
    quote: "USDT",
    lastPrice: 145.67,
    high24h: 151.2,
    low24h: 139.85,
    volumeBase24h: 18_455_102.6,
    volumeQuote24h: 2_688_331_250.9,
  },
]

export const MOCK_TRADING_ACCOUNT: TradingAccount = {
  balances: { USDT: 1_000, BTC: 0.0125, ETH: 0.42, SOL: 6.5 },
  feeRate: 0.008,
}

const order = (
  id: string,
  pair: string,
  side: Order["side"],
  status: Order["status"],
  values: Pick<Order, "entryPrice" | "margin" | "pnl" | "amount" | "value">,
  minutesAgo: number
): Order => ({
  id,
  pair,
  side,
  status,
  ...values,
  createdAt: new Date(MARKET_NOW - minutesAgo * MINUTE).toISOString(),
})

export const MOCK_ACTIVE_ORDERS: Order[] = [
  order(
    "o1",
    "BTC/USDT",
    "buy",
    "open",
    { entryPrice: 32_121.53, margin: 2, pnl: 4.2, amount: 108, value: 6 },
    35
  ),
  order(
    "o2",
    "BCN/USDT",
    "buy",
    "open",
    { entryPrice: 1_985.25, margin: 1.5, pnl: 1.8, amount: 99.5, value: 4 },
    72
  ),
  order(
    "o3",
    "CLO/USDT",
    "sell",
    "open",
    { entryPrice: 95.5, margin: 1.8, pnl: -2.6, amount: 125.75, value: 5 },
    118
  ),
  order(
    "o4",
    "CLOX/USDT",
    "buy",
    "open",
    { entryPrice: 0.715, margin: 1.6, pnl: 0.9, amount: 76.2, value: 5 },
    164
  ),
  order(
    "o5",
    "DMD/USDT",
    "sell",
    "open",
    { entryPrice: 105.3, margin: 2.5, pnl: -3.4, amount: 210, value: 4.5 },
    230
  ),
]

export const MOCK_ORDER_HISTORY: Order[] = [
  order(
    "h1",
    "ETH/USDT",
    "buy",
    "filled",
    {
      entryPrice: 4_288.4,
      margin: 3.2,
      pnl: 6.1,
      amount: 0.42,
      value: 1_801.13,
    },
    600
  ),
  order(
    "h2",
    "SOL/USDT",
    "sell",
    "filled",
    { entryPrice: 151.2, margin: 1.2, pnl: -1.4, amount: 6.5, value: 982.8 },
    1_440
  ),
  order(
    "h3",
    "BTC/USDT",
    "buy",
    "cancelled",
    { entryPrice: 103_950, margin: 0, pnl: 0, amount: 0.004, value: 415.8 },
    2_880
  ),
  order(
    "h4",
    "BCN/USDT",
    "sell",
    "filled",
    { entryPrice: 2_010.75, margin: 1.5, pnl: 2.3, amount: 40, value: 80.43 },
    4_320
  ),
  order(
    "h5",
    "DMD/USDT",
    "buy",
    "filled",
    { entryPrice: 98.6, margin: 2, pnl: 7.8, amount: 150, value: 14.79 },
    7_200
  ),
]
