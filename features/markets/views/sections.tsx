import {
  getMarketInsights,
  getMarketMovers,
  getMarketNews,
  getMarketSentiment,
  getMarketStats,
  getMarketTickers,
  getSectorPerformance,
} from "../api/markets"
import { MarketInsights } from "../components/market-insights"
import { MarketNews } from "../components/market-news"
import { MarketSentiment } from "../components/market-sentiment"
import { MarketStatCard } from "../components/market-stat-card"
import { SectorPerformance } from "../components/sector-performance"
import { TickerStrip } from "../components/ticker-strip"
import { TopMovers } from "../components/top-movers"

export const TickerSection = async () => (
  <TickerStrip tickers={await getMarketTickers()} />
)

export const MoversSection = async () => (
  <TopMovers movers={await getMarketMovers()} />
)

export const SectorsSection = async () => (
  <SectorPerformance sectors={await getSectorPerformance()} />
)

export const NewsSection = async () => (
  <MarketNews news={await getMarketNews()} />
)

export const InsightsSection = async () => (
  <MarketInsights insights={await getMarketInsights()} />
)

export const SentimentSection = async () => (
  <MarketSentiment sentiment={await getMarketSentiment()} />
)

export const StatsSection = async () => (
  <>
    {(await getMarketStats()).map((stat) => (
      <MarketStatCard key={stat.id} stat={stat} />
    ))}
  </>
)
