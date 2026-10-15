import type {
  Balance,
  Kpi,
  MarketLeadersByPeriod,
  TopAsset,
  TopGainer,
  Transaction,
} from "@/features/dashboard/types"

import { DAY, HOUR, MARKET_NOW } from "@/shared/lib/time"

export const MOCK_KPIS: Kpi[] = [
  { name: "Bitcoin", pair: "BTC/USDT", price: 12_540, change: 3.1 },
  { name: "Litecoin", pair: "LTC/USDT", price: 135.1, change: 0.8 },
  { name: "Ripple", pair: "XRP/USDT", price: 0.72, change: -1.2 },
  { name: "Ethereum", pair: "ETH/USDT", price: 1_040.5, change: 5.6 },
]

export const MOCK_MARKET_LEADERS: MarketLeadersByPeriod = {
  Week: {
    from: "June 24",
    to: "June 30",
    leaders: [
      {
        name: "Bitcoin",
        value: 10_284_310,
        change24h: 1_204,
        trend: 1.9,
        share: 46,
      },
      {
        name: "Ethereum",
        value: 3_412_870,
        change24h: 842,
        trend: 0.7,
        share: 32,
      },
      {
        name: "Litecoin",
        value: 182_540,
        change24h: 316,
        trend: -0.4,
        share: 22,
      },
    ],
  },
  Month: {
    from: "June 1",
    to: "June 30",
    leaders: [
      {
        name: "Bitcoin",
        value: 44_343_923,
        change24h: 2_384,
        trend: 3.1,
        share: 44,
      },
      {
        name: "Ethereum",
        value: 14_332_867,
        change24h: 2_384,
        trend: 2.4,
        share: 32,
      },
      {
        name: "Litecoin",
        value: 746_342,
        change24h: 1_434,
        trend: 1.3,
        share: 24,
      },
    ],
  },
}

const tradedAgo = (ms: number) => new Date(MARKET_NOW - ms).toISOString()

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 64_280.5,
    marketCap: 4_456.8e12,
    lastTradeAt: tradedAgo(2 * HOUR),
    metrics: {
      "1H": { change: 1.2, volume: 812.4e9 },
      "24H": { change: 34.5, volume: 18_435.7e9 },
      "7D": { change: 29.8, volume: 96_210.3e9 },
    },
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 520.4,
    marketCap: 8_548.1e9,
    lastTradeAt: tradedAgo(3 * DAY),
    metrics: {
      "1H": { change: -0.6, volume: 186.2e9 },
      "24H": { change: 36.7, volume: 4_453.3e9 },
      "7D": { change: 35.1, volume: 27_840.9e9 },
    },
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 4_320.75,
    marketCap: 3_542.5e12,
    lastTradeAt: tradedAgo(20 * HOUR),
    metrics: {
      "1H": { change: -2.4, volume: 1_352.8e9 },
      "24H": { change: -28.9, volume: 32_435.5e9 },
      "7D": { change: -31.2, volume: 211_604.1e9 },
    },
  },
  {
    symbol: "UTK",
    name: "Utrust",
    price: 520.4,
    marketCap: 8_568.1e9,
    lastTradeAt: tradedAgo(18 * DAY),
    metrics: {
      "1H": { change: 0.9, volume: 190.1e9 },
      "24H": { change: 32.1, volume: 4_546.3e9 },
      "7D": { change: 30.4, volume: 30_118.6e9 },
    },
  },
  {
    symbol: "QNT",
    name: "Quant",
    price: 520.4,
    marketCap: 88_443.1e9,
    lastTradeAt: tradedAgo(150 * DAY),
    metrics: {
      "1H": { change: 2.1, volume: 1_904.7e9 },
      "24H": { change: 37.4, volume: 45_635.3e9 },
      "7D": { change: 33.3, volume: 288_972.5e9 },
    },
  },
]

export const MOCK_BALANCE_BY_CHAIN: Balance["byChain"] = {
  bnb: 102_540,
  ethereum: 84_312.55,
  solana: 23_908.12,
  polygon: 6_420.8,
}

export const MOCK_TOP_ASSETS: TopAsset[] = [
  { symbol: "ETN", name: "Electroneum", price: 0.2724, change: 2.85 },
  { symbol: "SOL", name: "Solana", price: 145.67, change: 5.46 },
  { symbol: "BTC", name: "Bitcoin", price: 68_420, change: 2.85 },
  { symbol: "ETH", name: "Ethereum", price: 15.82, change: 3.12 },
  { symbol: "XRP", name: "Ripple", price: 0.62, change: 4.03 },
]

export const MOCK_TOP_GAINERS: TopGainer[] = [
  {
    symbol: "ROSE",
    marketCap: 274.8e9,
    price: 36.89,
    change: 12.99,
    momentum: "down",
  },
  {
    symbol: "JASPER",
    marketCap: 198.4e9,
    price: 25.43,
    change: 9.87,
    momentum: "up",
  },
  {
    symbol: "AZURE",
    marketCap: 145.6e9,
    price: 19.78,
    change: 7.45,
    momentum: "down",
  },
  {
    symbol: "EMBER",
    marketCap: 267.3e9,
    price: 33.52,
    change: 11.68,
    momentum: "down",
  },
]
