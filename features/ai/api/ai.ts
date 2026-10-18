import "server-only"

import type { WalletAsset } from "@/features/wallet"
import { getWalletAssets } from "@/features/wallet/api/wallet"
import { type CoinMarket, getCoinMarkets } from "@/shared/api/coingecko"
import { getFearGreedHistory } from "@/shared/api/fear-greed"
import { groqJson } from "@/shared/api/groq"
import { STABLECOIN_SYMBOLS } from "@/shared/config/coins"
import { memoizeFor } from "@/shared/lib/memoize"
import { MINUTE } from "@/shared/lib/time"
import { AI_SIGNAL_SYMBOLS, SENTIMENT_HISTORY_DAYS } from "../constants"
import type {
  AiInsights,
  AiSignal,
  MarketSentiment,
  PortfolioHealth,
  SignalBias,
} from "../types"

const SIGNALS_TTL_MS = 30 * MINUTE
const MAJOR_SYMBOLS = new Set(["BTC", "ETH"])

const symbolOf = (coin: CoinMarket) => coin.symbol.toUpperCase()

const getSentiment = async (): Promise<MarketSentiment> => {
  const history = await getFearGreedHistory(SENTIMENT_HISTORY_DAYS)
  return { score: history[0] ?? 50, history: [...history].reverse() }
}

type RawSignal = { symbol: string; bias: SignalBias; confidence: number }

const getSignals = memoizeFor(SIGNALS_TTL_MS, async (): Promise<AiSignal[]> => {
  const coins = (await getCoinMarkets()).filter((coin) =>
    AI_SIGNAL_SYMBOLS.includes(symbolOf(coin))
  )
  const snapshot = coins.map((coin) => ({
    symbol: symbolOf(coin),
    price: coin.current_price,
    change1h: coin.price_change_percentage_1h_in_currency,
    change24h: coin.price_change_percentage_24h,
    change7d: coin.price_change_percentage_7d_in_currency,
    change30d: coin.price_change_percentage_30d_in_currency,
    volume24h: coin.total_volume,
  }))
  const { signals } = await groqJson<{ signals: RawSignal[] }>([
    {
      role: "system",
      content:
        'You are a crypto market analyst. From the price data, give a 24h directional bias per asset. Reply as JSON: {"signals": [{"symbol": string, "bias": "bullish" | "neutral" | "bearish", "confidence": integer 0-100}]}.',
    },
    { role: "user", content: JSON.stringify(snapshot) },
  ])

  return coins.flatMap((coin) => {
    const signal = signals.find((item) => item.symbol === symbolOf(coin))
    return signal
      ? [
          {
            symbol: symbolOf(coin),
            name: coin.name,
            bias: signal.bias,
            confidence: Math.round(signal.confidence),
            change: coin.price_change_percentage_24h ?? 0,
            horizon: "24h",
          },
        ]
      : []
  })
})

const clampScore = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)))

const percent = (share: number) => `${Math.round(share * 100)}%`

export const assessHealth = (assets: WalletAsset[]): PortfolioHealth => {
  const values = assets.map((asset) => ({
    symbol: asset.symbol,
    value: asset.balance * asset.price,
  }))
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1
  const shareOf = (match: (symbol: string) => boolean) =>
    values
      .filter((item) => match(item.symbol))
      .reduce((sum, item) => sum + item.value, 0) / total
  const largest = [...values].sort((a, b) => b.value - a.value)[0]
  const largestShare = (largest?.value ?? 0) / total
  const stableShare = shareOf((symbol) => STABLECOIN_SYMBOLS.has(symbol))
  const altShare = shareOf(
    (symbol) => !STABLECOIN_SYMBOLS.has(symbol) && !MAJOR_SYMBOLS.has(symbol)
  )

  const metrics = [
    {
      label: "Diversification",
      value: clampScore((1 - largestShare) * 140),
      hint: `${largest?.symbol ?? "One asset"} is ${percent(largestShare)} of your holdings.`,
    },
    {
      label: "Risk exposure",
      value: clampScore(100 - altShare * 100),
      hint: `${percent(altShare)} sits in assets outside BTC, ETH and stables.`,
    },
    {
      label: "Stablecoin buffer",
      value: clampScore((stableShare / 0.15) * 100),
      hint: `${percent(stableShare)} in stables; 10-20% cushions dips.`,
    },
  ]

  return {
    score: clampScore(
      metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length
    ),
    metrics,
  }
}

export const getAiInsights = async (): Promise<AiInsights> => {
  const [sentiment, signals, assets] = await Promise.all([
    getSentiment(),
    getSignals().catch(() => []),
    getWalletAssets(),
  ])
  return { sentiment, signals, health: assessHealth(assets) }
}
