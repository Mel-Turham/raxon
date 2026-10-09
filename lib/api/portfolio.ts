import "server-only"

import { cache } from "react"

import { PORTFOLIO_HISTORY_DEFAULT_RANGE } from "@/constants"
import {
  MOCK_PORTFOLIO_ASSETS,
  MOCK_PORTFOLIO_METRICS,
  MOCK_WALLET_HOLDINGS,
  MOCK_WATCHLIST,
  MOCK_WATCHLIST_CANDIDATES,
} from "@/lib/api/mock-portfolio-data"
import { request } from "@/lib/api/request"
import { buildPortfolioHistory } from "@/lib/portfolio-history"

export const getWatchlist = () =>
  request({ items: MOCK_WATCHLIST, candidates: MOCK_WATCHLIST_CANDIDATES })

export const getPortfolioMetrics = () => request(MOCK_PORTFOLIO_METRICS)

export const getPortfolioHistory = () =>
  request(buildPortfolioHistory(PORTFOLIO_HISTORY_DEFAULT_RANGE))

export const getWalletHoldings = () => request(MOCK_WALLET_HOLDINGS)

// cache(): the assets table and the converter share one request per render.
export const getPortfolioAssets = cache(() => request(MOCK_PORTFOLIO_ASSETS))
