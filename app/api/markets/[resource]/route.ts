import {
  getMarketInsights,
  getMarketMovers,
  getMarketNews,
  getMarketSentiment,
  getMarketStats,
  getMarketTickers,
  getSectorPerformance,
} from "@/features/markets/api/markets"

const LOADERS: Record<string, () => Promise<unknown>> = {
  tickers: getMarketTickers,
  movers: getMarketMovers,
  sectors: getSectorPerformance,
  news: getMarketNews,
  insights: getMarketInsights,
  sentiment: getMarketSentiment,
  stats: getMarketStats,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const load = LOADERS[(await params).resource]
  if (!load) return Response.json({ error: "Not found" }, { status: 404 })
  try {
    return Response.json(await load())
  } catch (error) {
    console.error(error)
    return Response.json({ error: "Upstream unavailable" }, { status: 502 })
  }
}
