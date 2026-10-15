import "server-only"

import { cache } from "react"

import { PORTFOLIO_HISTORY_DEFAULT_RANGE } from "@/features/portfolio/constants"
import { buildPortfolioHistory } from "@/features/portfolio/helpers/portfolio-history"
import {
  MOCK_PORTFOLIO_ASSETS,
  MOCK_PORTFOLIO_METRICS,
  MOCK_WALLET_HOLDINGS,
  MOCK_WATCHLIST,
  MOCK_WATCHLIST_CANDIDATES,
} from "@/features/portfolio/mocks/mock-portfolio-data"
import { request } from "@/shared/api/request"

export const getWatchlist = () =>
  request({ items: MOCK_WATCHLIST, candidates: MOCK_WATCHLIST_CANDIDATES })

export const getPortfolioMetrics = () => request(MOCK_PORTFOLIO_METRICS)

export const getPortfolioHistory = () =>
  request(buildPortfolioHistory(PORTFOLIO_HISTORY_DEFAULT_RANGE))

export const getWalletHoldings = () => request(MOCK_WALLET_HOLDINGS)

export const getPortfolioAssets = cache(() => request(MOCK_PORTFOLIO_ASSETS))
