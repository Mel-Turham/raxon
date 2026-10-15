import "server-only"

import { request } from "@/shared/api/request"
import { rankMovers, toMarketMover } from "../helpers/markets"
import {
  MOCK_INSIGHTS,
  MOCK_MARKET_ASSETS,
  MOCK_MARKET_STATS,
  MOCK_SECTORS,
  buildMockNews,
  buildMockSentiment,
  buildMockTickers,
} from "../mocks/markets-data"

export const getMarketAssets = () =>
  request(MOCK_MARKET_ASSETS.map(toMarketMover))

export const getMarketTickers = () => request(buildMockTickers())

export const getMarketMovers = () => request(rankMovers(MOCK_MARKET_ASSETS))

export const getSectorPerformance = () => request(MOCK_SECTORS)

export const getMarketNews = () => request(buildMockNews(Date.now()))

export const getMarketInsights = () => request(MOCK_INSIGHTS)

export const getMarketSentiment = () => request(buildMockSentiment(Date.now()))

export const getMarketStats = () => request(MOCK_MARKET_STATS)
