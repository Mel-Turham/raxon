import { queryOptions } from "@tanstack/react-query"

import { getJson } from "@/shared/api/http"
import { MINUTE } from "@/shared/lib/time"
import type {
  MarketInsights,
  MarketMovers,
  MarketNewsItem,
  MarketSentimentOverview,
  MarketStat,
  MarketTicker,
  SectorPerformance,
} from "../types"

const marketQuery = <T>(resource: string, refetchInterval: number) =>
  queryOptions({
    queryKey: ["markets", resource],
    queryFn: () => getJson<T>(`/markets/${resource}`),
    refetchInterval,
  })

export const marketQueries = {
  tickers: () => marketQuery<MarketTicker[]>("tickers", MINUTE),
  movers: () => marketQuery<MarketMovers>("movers", MINUTE),
  sectors: () => marketQuery<SectorPerformance[]>("sectors", 10 * MINUTE),
  news: () => marketQuery<MarketNewsItem[]>("news", 10 * MINUTE),
  insights: () => marketQuery<MarketInsights>("insights", MINUTE),
  sentiment: () =>
    marketQuery<MarketSentimentOverview>("sentiment", 5 * MINUTE),
  stats: () => marketQuery<MarketStat[]>("stats", 5 * MINUTE),
}
