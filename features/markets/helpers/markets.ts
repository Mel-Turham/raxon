import { MARKET_ROW_LIMIT } from "../constants"
import type {
  MarketMover,
  MarketMovers,
  MarketQuote,
  MarketSignal,
  MarketTone,
} from "../types"

type MoverSource = Omit<MarketMover, "change">

export const toMarketMover = (asset: MoverSource): MarketMover => ({
  ...asset,
  change: asset.price - asset.price / (1 + asset.changePercent / 100),
})

export const rankMovers = (assets: MoverSource[]): MarketMovers => {
  const movers = assets.map(toMarketMover)
  const byChange = [...movers].sort((a, b) => b.changePercent - a.changePercent)

  return {
    Active: [...movers]
      .sort((a, b) => b.volume - a.volume)
      .slice(0, MARKET_ROW_LIMIT),
    Gainers: byChange
      .filter((mover) => mover.changePercent > 0)
      .slice(0, MARKET_ROW_LIMIT),
    Losers: byChange
      .filter((mover) => mover.changePercent < 0)
      .reverse()
      .slice(0, MARKET_ROW_LIMIT),
  }
}

const quoteSpread = (quote: MarketQuote) => quote.ask - quote.bid

export const quoteSpreadBps = (quote: MarketQuote) =>
  (quoteSpread(quote) / quote.bid) * 10_000

export const sentimentLabel = (score: number) => {
  if (score >= 0.6) return "Positive"
  if (score <= 0.4) return "Negative"
  return "Neutral"
}

const changeTone = (value: number): MarketTone => {
  if (value > 0) return "up"
  if (value < 0) return "down"
  return "flat"
}

export const sentimentTone = (score: number): MarketTone =>
  changeTone(score >= 0.6 ? 1 : score <= 0.4 ? -1 : 0)

export const signalTone = (signal: MarketSignal): MarketTone =>
  changeTone(signal === "Bullish" ? 1 : signal === "Bearish" ? -1 : 0)

export const quoteChange = (quote: MarketQuote) =>
  ((quote.bid + quote.ask) / 2 / quote.previous - 1) * 100

export const liveChangePercent = (changePercent: number, factor: number) =>
  ((1 + changePercent / 100) * factor - 1) * 100

export const fearGreedLabel = (value: number) => {
  if (value >= 75) return "Extreme greed"
  if (value >= 55) return "Greed"
  if (value > 45) return "Neutral"
  if (value > 25) return "Fear"
  return "Extreme fear"
}
