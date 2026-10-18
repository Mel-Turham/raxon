export const MARKET_MOVER_TABS = ["Active", "Gainers", "Losers"] as const

export const MARKET_INSIGHT_SEGMENTS = [
  "Spot",
  "Perpetuals",
  "Stablecoins",
  "DeFi",
  "Layer 2",
] as const

export const MARKET_SIGNALS = ["Bullish", "Neutral", "Bearish"] as const

export const MARKET_STAT_IDS = [
  "market-cap",
  "volume",
  "btc-dominance",
  "fear-greed",
] as const

export const MARKET_ROW_LIMIT = 5

export const LIVE_TICK_MS = 1_000

export const TICKER_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "BNB", "DOGE"]

export const INSIGHT_SYMBOLS = {
  Spot: ["BTC", "ETH", "SOL", "BNB", "XRP"],
  Perpetuals: ["BTC", "ETH", "SOL", "DOGE", "XRP"],
  Stablecoins: ["USDC", "FDUSD", "USDE", "TUSD", "USD1"],
  DeFi: ["UNI", "AAVE", "MKR", "LDO", "CRV"],
  "Layer 2": ["ARB", "OP", "POL", "STRK", "IMX"],
} as const

export const SENTIMENT_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "DOGE"]

export const MARKET_SECTORS = [
  { id: "layer-1", name: "Layer 1" },
  { id: "artificial-intelligence", name: "AI & Agents" },
  { id: "meme-token", name: "Memecoins" },
  { id: "decentralized-finance-defi", name: "DeFi" },
  { id: "real-world-assets-rwa", name: "Real-world assets" },
  { id: "layer-2", name: "Layer 2" },
  { id: "gaming", name: "Gaming" },
] as const
