import type { FxRate, MarketAsset, NewListing } from "@/lib/api/types"

// Temporary payloads until the external API is plugged in.

export const MOCK_NEW_LISTINGS: NewListing[] = [
  { symbol: "CLND", name: "Colend", price: 0.06971, change: -0.77 },
  { symbol: "BOOP", name: "Boop", price: 0.3176, change: 40.78 },
  { symbol: "H1", name: "Haven1", price: 0.03007, change: -0.01 },
  { symbol: "CNDL", name: "CandleTV", price: 0.00058, change: 17.43 },
  { symbol: "TOKERO", name: "Tokero", price: 0.08607, change: 21.01 },
]

const change = (d: number, w: number, m: number, y: number, all: number) => ({
  "1D": d,
  "1W": w,
  "1M": m,
  "1Y": y,
  ALL: all,
})

export const MOCK_MARKET_ASSETS: MarketAsset[] = [
  {
    rank: 1,
    symbol: "BTC",
    name: "Bitcoin",
    price: 101_491,
    fdv: 2_131.4e9,
    volume: 21.3e9,
    change: change(1.5, 4.2, 9.8, 112.4, 1_820.5),
    categories: ["Trending", "Most Visited"],
  },
  {
    rank: 2,
    symbol: "ETH",
    name: "Ethereum",
    price: 1_643.32,
    fdv: 219.1e9,
    volume: 9.2e9,
    change: change(2.17, -3.4, -12.6, -28.1, 410.2),
    categories: ["Most Visited"],
  },
  {
    rank: 3,
    symbol: "USDT",
    name: "Tether",
    price: 0.99,
    fdv: 139.4e9,
    volume: 36.2e9,
    change: change(-0.01, 0.02, -0.03, 0.01, -0.4),
    categories: [],
  },
  {
    rank: 4,
    symbol: "BNB",
    name: "Binance Coin",
    price: 591.79,
    fdv: 83.32e9,
    volume: 1.36e9,
    change: change(-0.91, 2.6, 5.1, 21.7, 6_120.9),
    categories: ["Trending"],
  },
  {
    rank: 5,
    symbol: "SOL",
    name: "Solana",
    price: 129.79,
    fdv: 88.1e9,
    volume: 1.5e9,
    change: change(0.17, 6.3, -8.2, 54.6, 2_310.4),
    categories: ["Trending", "Most Visited"],
  },
  {
    rank: 6,
    symbol: "XRP",
    name: "XRP",
    price: 0.62,
    fdv: 61.9e9,
    volume: 2.41e9,
    change: change(3.42, 7.9, 14.3, 38.2, 9_800.1),
    categories: ["Trending"],
  },
  {
    rank: 7,
    symbol: "ADA",
    name: "Cardano",
    price: 0.45,
    fdv: 30.82e9,
    volume: 0.66e9,
    change: change(1.8, -1.2, -6.4, -18.9, 1_260.3),
    categories: [],
  },
  {
    rank: 8,
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.33,
    fdv: 25.81e9,
    volume: 2.08e9,
    change: change(-1.5, -4.8, 11.2, 89.3, 41_200.7),
    categories: ["Most Visited"],
  },
  {
    rank: 9,
    symbol: "TRX",
    name: "TRON",
    price: 0.24,
    fdv: 21.4e9,
    volume: 0.71e9,
    change: change(0.64, 1.9, 3.3, 47.8, 1_120.6),
    categories: ["New"],
  },
  {
    rank: 10,
    symbol: "QNT",
    name: "Quant",
    price: 520.4,
    fdv: 7.6e9,
    volume: 0.21e9,
    change: change(-2.18, 8.4, 22.6, 130.4, 2_840.2),
    categories: ["New", "Trending"],
  },
]

export const MOCK_FX_RATES: FxRate[] = [
  { code: "USD", rate: 1 },
  { code: "EUR", rate: 0.92 },
  { code: "GBP", rate: 0.79 },
]
