import type {
  AnalyticsSource,
  AnalyticsTrade,
} from "@/features/analytics/types"

const HISTORY_LENGTH = 365
const RECENT_HISTORY_VALUES = [
  73_000, 74_200, 74_600, 74_300, 75_000, 76_300, 76_800, 77_400, 77_900,
  77_800, 78_600, 80_200, 79_800, 79_500, 76_200, 75_200, 75_800, 76_600,
  75_700, 76_400, 75_500, 74_900, 74_100, 74_800, 73_600, 74_200, 75_900,
  79_500, 80_300, 83_727.9,
] as const
const HISTORY_END = Date.UTC(2026, 9, 11)
const HISTORY_DAY_MS = 24 * 60 * 60 * 1000
const PREVIOUS_HISTORY_LENGTH = HISTORY_LENGTH - RECENT_HISTORY_VALUES.length

const previousHistory = Array.from(
  { length: PREVIOUS_HISTORY_LENGTH },
  (_, index) => {
    const progress = index / (PREVIOUS_HISTORY_LENGTH - 1)
    const trend = 52_000 + progress * 20_900
    const cycle = Math.sin(index * 0.17) * 1_350 + Math.cos(index * 0.31) * 520

    return {
      date: new Date(
        HISTORY_END - (HISTORY_LENGTH - index - 1) * HISTORY_DAY_MS
      ),
      value:
        index === PREVIOUS_HISTORY_LENGTH - 1
          ? RECENT_HISTORY_VALUES[0]
          : Math.round((trend + cycle) * 100) / 100,
    }
  }
)

const recentHistory = RECENT_HISTORY_VALUES.map((value, index) => ({
  date: new Date(
    HISTORY_END - (RECENT_HISTORY_VALUES.length - index - 1) * HISTORY_DAY_MS
  ),
  value,
}))

const portfolioHistory = [...previousHistory, ...recentHistory]

const TRADED_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", weight: 0.36, size: 1_100 },
  { symbol: "ETH", name: "Ethereum", weight: 0.26, size: 850 },
  { symbol: "SOL", name: "Solana", weight: 0.18, size: 520 },
  { symbol: "XRP", name: "Ripple", weight: 0.12, size: 380 },
  { symbol: "BNB", name: "BNB", weight: 0.08, size: 450 },
] as const
const TRADE_HISTORY_DAYS = HISTORY_LENGTH * 2
const TRADE_FEE_RATE = 0.001

const seededRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
}

const pickAsset = (roll: number) => {
  let threshold = 0
  for (const asset of TRADED_ASSETS) {
    threshold += asset.weight
    if (roll < threshold) return asset
  }
  return TRADED_ASSETS[0]
}

function generateTrades(): AnalyticsTrade[] {
  const random = seededRandom(42)
  const trades: AnalyticsTrade[] = []

  for (let day = TRADE_HISTORY_DAYS - 1; day >= 0; day -= 1) {
    const dayStart = HISTORY_END - day * HISTORY_DAY_MS
    const count = Math.floor(random() * 4)
    for (let index = 0; index < count; index += 1) {
      const asset = pickAsset(random())
      const volume = Math.round(asset.size * (0.5 + random() * 1.5) * 100) / 100
      const isWin = random() < 0.64
      const pnl = isWin
        ? volume * (0.04 + random() * 0.18)
        : -volume * (0.03 + random() * 0.16)
      trades.push({
        id: `T-${trades.length + 1}`,
        symbol: asset.symbol,
        name: asset.name,
        closedAt: new Date(dayStart + Math.floor(random() * HISTORY_DAY_MS)),
        pnl: Math.round(pnl * 100) / 100,
        fee: Math.round(volume * TRADE_FEE_RATE * 100) / 100,
        volume,
        holdingMinutes: Math.round(20 + random() * 700),
      })
    }
  }

  return trades
}

export const MOCK_ANALYTICS_SOURCE: AnalyticsSource = {
  portfolioHistory,
  allocation: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      value: 35_166,
      color: "var(--token-btc)",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      value: 23_443.8,
      color: "var(--token-eth)",
    },
    {
      name: "USDT",
      symbol: "USDT",
      value: 13_396.46,
      color: "var(--token-usdt)",
    },
    {
      name: "Solana",
      symbol: "SOL",
      value: 7_535.51,
      color: "var(--token-sol)",
    },
    {
      name: "Other",
      value: 4_186.13,
      color: "var(--muted-foreground)",
    },
  ],
  trades: generateTrades(),
}
