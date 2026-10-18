"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { marketQueries } from "../api/queries"
import { MarketInsights } from "../components/market-insights"
import { MarketNews } from "../components/market-news"
import { MarketSentiment } from "../components/market-sentiment"
import { MarketStatCard } from "../components/market-stat-card"
import { SectorPerformance } from "../components/sector-performance"
import { TickerStrip } from "../components/ticker-strip"
import { TopMovers } from "../components/top-movers"

export const LiveTickerStrip = () => (
  <TickerStrip tickers={useSuspenseQuery(marketQueries.tickers()).data} />
)

export const LiveTopMovers = () => (
  <TopMovers movers={useSuspenseQuery(marketQueries.movers()).data} />
)

export const LiveSectorPerformance = () => (
  <SectorPerformance sectors={useSuspenseQuery(marketQueries.sectors()).data} />
)

export const LiveMarketNews = () => (
  <MarketNews news={useSuspenseQuery(marketQueries.news()).data} />
)

export const LiveMarketInsights = () => (
  <MarketInsights insights={useSuspenseQuery(marketQueries.insights()).data} />
)

export const LiveMarketSentiment = () => (
  <MarketSentiment
    sentiment={useSuspenseQuery(marketQueries.sentiment()).data}
  />
)

export const LiveMarketStats = () => (
  <>
    {useSuspenseQuery(marketQueries.stats()).data.map((stat) => (
      <MarketStatCard key={stat.id} stat={stat} />
    ))}
  </>
)
