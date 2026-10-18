import { Prefetched } from "@/shared/providers/prefetch"

import {
  getMarketInsights,
  getMarketMovers,
  getMarketNews,
  getMarketSentiment,
  getMarketStats,
  getMarketTickers,
  getSectorPerformance,
} from "../api/markets"
import { marketQueries } from "../api/queries"
import {
  LiveMarketInsights,
  LiveMarketNews,
  LiveMarketSentiment,
  LiveMarketStats,
  LiveSectorPerformance,
  LiveTickerStrip,
  LiveTopMovers,
} from "./connected"

export const TickerSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.tickers(),
        queryFn: getMarketTickers,
      }),
    ]}
  >
    <LiveTickerStrip />
  </Prefetched>
)

export const MoversSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.movers(),
        queryFn: getMarketMovers,
      }),
    ]}
  >
    <LiveTopMovers />
  </Prefetched>
)

export const SectorsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.sectors(),
        queryFn: getSectorPerformance,
      }),
    ]}
  >
    <LiveSectorPerformance />
  </Prefetched>
)

export const NewsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({ ...marketQueries.news(), queryFn: getMarketNews }),
    ]}
  >
    <LiveMarketNews />
  </Prefetched>
)

export const InsightsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.insights(),
        queryFn: getMarketInsights,
      }),
    ]}
  >
    <LiveMarketInsights />
  </Prefetched>
)

export const SentimentSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.sentiment(),
        queryFn: getMarketSentiment,
      }),
    ]}
  >
    <LiveMarketSentiment />
  </Prefetched>
)

export const StatsSection = () => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery({
        ...marketQueries.stats(),
        queryFn: getMarketStats,
      }),
    ]}
  >
    <LiveMarketStats />
  </Prefetched>
)
