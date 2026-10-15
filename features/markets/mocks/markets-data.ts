import { HOUR, MINUTE } from "@/shared/lib/time"
import type {
  MarketInsights,
  MarketNewsItem,
  MarketQuote,
  MarketSentimentOverview,
  MarketStat,
  MarketTicker,
  SectorPerformance,
} from "../types"

type MockMarketAsset = {
  symbol: string
  name: string
  price: number
  changePercent: number
  volume: number
  marketCap: number
}

export const MOCK_MARKET_ASSETS: MockMarketAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 66_980,
    changePercent: 2.14,
    volume: 31_420_000_000,
    marketCap: 1_321_000_000_000,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3_420.5,
    changePercent: 1.86,
    volume: 14_860_000_000,
    marketCap: 411_000_000_000,
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 152.4,
    changePercent: 4.12,
    volume: 3_910_000_000,
    marketCap: 70_400_000_000,
  },
  {
    symbol: "XRP",
    name: "XRP",
    price: 0.6214,
    changePercent: -0.84,
    volume: 1_720_000_000,
    marketCap: 34_600_000_000,
  },
  {
    symbol: "BNB",
    name: "BNB",
    price: 584.2,
    changePercent: 0.92,
    volume: 1_480_000_000,
    marketCap: 85_200_000_000,
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.1642,
    changePercent: 6.84,
    volume: 1_310_000_000,
    marketCap: 23_800_000_000,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    price: 0.4521,
    changePercent: -2.36,
    volume: 412_000_000,
    marketCap: 16_100_000_000,
  },
  {
    symbol: "TRX",
    name: "TRON",
    price: 0.1248,
    changePercent: -1.12,
    volume: 386_000_000,
    marketCap: 10_900_000_000,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    price: 0.7134,
    changePercent: -3.48,
    volume: 298_000_000,
    marketCap: 6_640_000_000,
  },
  {
    symbol: "QNT",
    name: "Quant",
    price: 104.62,
    changePercent: 5.27,
    volume: 84_000_000,
    marketCap: 1_530_000_000,
  },
  {
    symbol: "UTK",
    name: "xMoney",
    price: 0.0921,
    changePercent: -4.65,
    volume: 21_000_000,
    marketCap: 68_000_000,
  },
]

const MOCK_TICKER_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "BNB", "DOGE"]

export const buildMockTickers = (): MarketTicker[] =>
  MOCK_TICKER_SYMBOLS.flatMap((symbol) => {
    const asset = MOCK_MARKET_ASSETS.find((item) => item.symbol === symbol)
    return asset
      ? [
          {
            symbol: asset.symbol,
            name: asset.name,
            price: asset.price,
            change: asset.changePercent,
          },
        ]
      : []
  })

export const MOCK_SECTORS: SectorPerformance[] = [
  {
    id: "layer-1",
    name: "Layer 1",
    change24h: 2.31,
    change30d: 8.42,
    marketCap: 1_842_000_000_000,
    leaders: ["BTC", "ETH", "SOL"],
  },
  {
    id: "ai",
    name: "AI & Agents",
    change24h: 5.86,
    change30d: 21.4,
    marketCap: 38_600_000_000,
    leaders: ["FET", "TAO", "RNDR"],
  },
  {
    id: "memes",
    name: "Memecoins",
    change24h: 4.92,
    change30d: -6.18,
    marketCap: 61_200_000_000,
    leaders: ["DOGE", "SHIB", "PEPE"],
  },
  {
    id: "defi",
    name: "DeFi",
    change24h: -0.74,
    change30d: 3.65,
    marketCap: 92_400_000_000,
    leaders: ["UNI", "AAVE", "MKR"],
  },
  {
    id: "rwa",
    name: "Real-world assets",
    change24h: 1.18,
    change30d: 14.9,
    marketCap: 12_800_000_000,
    leaders: ["ONDO", "QNT", "PLUME"],
  },
  {
    id: "layer-2",
    name: "Layer 2",
    change24h: -2.05,
    change30d: -9.32,
    marketCap: 24_100_000_000,
    leaders: ["ARB", "OP", "MATIC"],
  },
  {
    id: "gaming",
    name: "Gaming",
    change24h: -1.36,
    change30d: -4.87,
    marketCap: 9_700_000_000,
    leaders: ["IMX", "GALA", "SAND"],
  },
]

export const buildMockNews = (now: number): MarketNewsItem[] => {
  const at = (offsetMs: number) => new Date(now - offsetMs).toISOString()
  return [
    {
      id: "news-etf-inflows",
      title: "Spot Bitcoin ETFs log a fifth day of net inflows",
      excerpt:
        "US funds added $612M as BTC reclaimed the $66K area, led by the largest issuers.",
      source: "CryptoPanic",
      publishedAt: at(18 * MINUTE),
      sentiment: 0.82,
      symbols: ["BTC"],
    },
    {
      id: "news-solana-upgrade",
      title: "Solana validators approve fee market upgrade",
      excerpt:
        "The change targets congestion during memecoin launches and goes live next epoch.",
      source: "The Block",
      publishedAt: at(1 * HOUR + 12 * MINUTE),
      sentiment: 0.74,
      symbols: ["SOL"],
    },
    {
      id: "news-eth-gas",
      title: "Ethereum gas fees hit a 2026 low as L2 activity climbs",
      excerpt:
        "Average mainnet fees fell under 2 gwei while rollups processed record volume.",
      source: "CoinDesk",
      publishedAt: at(2 * HOUR + 40 * MINUTE),
      sentiment: 0.61,
      symbols: ["ETH"],
    },
    {
      id: "news-xrp-unlock",
      title: "Large XRP escrow unlock lands on exchanges",
      excerpt:
        "Analysts flag short-term sell pressure as 300M XRP moved to trading venues.",
      source: "CryptoPanic",
      publishedAt: at(4 * HOUR + 5 * MINUTE),
      sentiment: 0.28,
      symbols: ["XRP"],
    },
  ]
}

const quote = (
  pair: string,
  price: number,
  spreadBps: number,
  rangePercent: number,
  previousPercent: number
): MarketQuote => {
  const half = (price * spreadBps) / 20_000
  return {
    pair,
    base: pair.split("/")[0],
    bid: price - half,
    ask: price + half,
    low: price * (1 - rangePercent / 100),
    high: price * (1 + (rangePercent * 0.6) / 100),
    previous: price * (1 - previousPercent / 100),
  }
}

export const MOCK_INSIGHTS: MarketInsights = {
  Spot: [
    quote("BTC/USDT", 66_980, 1.2, 2.4, 2.14),
    quote("ETH/USDT", 3_420.5, 2.1, 3.1, 1.86),
    quote("SOL/USDT", 152.4, 4.8, 5.6, 4.12),
    quote("BNB/USDT", 584.2, 3.4, 1.9, 0.92),
    quote("XRP/USDT", 0.6214, 9.6, 2.7, -0.84),
  ],
  Perpetuals: [
    quote("BTC-PERP", 67_012.5, 0.8, 2.6, 2.21),
    quote("ETH-PERP", 3_423.1, 1.6, 3.3, 1.94),
    quote("SOL-PERP", 152.62, 3.9, 5.9, 4.3),
    quote("DOGE-PERP", 0.1645, 12.4, 8.1, 6.91),
    quote("XRP-PERP", 0.6219, 8.2, 2.9, -0.77),
  ],
  Stablecoins: [
    quote("USDC/USDT", 1.0001, 1, 0.04, 0.01),
    quote("DAI/USDT", 0.9998, 2, 0.06, -0.01),
    quote("FDUSD/USDT", 0.9996, 3, 0.09, -0.03),
    quote("USDE/USDT", 1.0003, 4, 0.12, 0.02),
    quote("PYUSD/USDT", 0.9999, 5, 0.08, 0),
  ],
  DeFi: [
    quote("UNI/USDT", 9.84, 11, 4.2, -0.62),
    quote("AAVE/USDT", 142.3, 9, 3.8, 1.48),
    quote("MKR/USDT", 2_186, 14, 3.1, -1.21),
    quote("LDO/USDT", 1.86, 18, 5.4, -2.36),
    quote("CRV/USDT", 0.384, 24, 6.2, 3.05),
  ],
  "Layer 2": [
    quote("ARB/USDT", 0.912, 13, 4.9, -2.84),
    quote("OP/USDT", 1.746, 12, 4.4, -1.92),
    quote("MATIC/USDT", 0.7134, 10, 5.1, -3.48),
    quote("STRK/USDT", 0.538, 22, 6.8, -4.12),
    quote("IMX/USDT", 1.42, 19, 5.6, -1.36),
  ],
}

export const buildMockSentiment = (now: number): MarketSentimentOverview => ({
  updatedAt: new Date(now - 6 * MINUTE).toISOString(),
  items: [
    {
      pair: "BTC/USDT",
      base: "BTC",
      signal: "Bullish",
      longShortRatio: 1.86,
      longPercent: 65,
    },
    {
      pair: "ETH/USDT",
      base: "ETH",
      signal: "Bullish",
      longShortRatio: 1.42,
      longPercent: 59,
    },
    {
      pair: "SOL/USDT",
      base: "SOL",
      signal: "Bullish",
      longShortRatio: 2.12,
      longPercent: 68,
    },
    {
      pair: "XRP/USDT",
      base: "XRP",
      signal: "Bearish",
      longShortRatio: 0.74,
      longPercent: 43,
    },
    {
      pair: "DOGE/USDT",
      base: "DOGE",
      signal: "Neutral",
      longShortRatio: 1.04,
      longPercent: 51,
    },
  ],
})

export const MOCK_MARKET_STATS: MarketStat[] = [
  {
    id: "market-cap",
    label: "Total market cap",
    value: 2_412_000_000_000,
    change: 1.84,
    rows: [
      { label: "Bitcoin", value: 1_321_000_000_000, change: 2.14 },
      { label: "Ethereum", value: 411_000_000_000, change: 1.86 },
      { label: "Stablecoins", value: 168_000_000_000, change: 0.04 },
    ],
  },
  {
    id: "volume",
    label: "24h volume",
    value: 98_400_000_000,
    change: 12.6,
    rows: [
      { label: "Spot", value: 31_800_000_000, change: 8.4 },
      { label: "Derivatives", value: 58_200_000_000, change: 15.1 },
      { label: "DEX", value: 8_400_000_000, change: 9.7 },
    ],
  },
  {
    id: "btc-dominance",
    label: "BTC dominance",
    value: 54.8,
    change: 0.42,
    rows: [
      { label: "Bitcoin", value: 54.8, change: 0.42 },
      { label: "Ethereum", value: 17.1, change: -0.08 },
      { label: "Others", value: 28.1, change: -0.34 },
    ],
  },
  {
    id: "fear-greed",
    label: "Fear & Greed",
    value: 72,
    change: 4,
    rows: [
      { label: "Yesterday", value: 68, change: 0 },
      { label: "Last week", value: 61, change: 0 },
      { label: "Last month", value: 47, change: 0 },
    ],
  },
]
