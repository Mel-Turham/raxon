import "server-only"

import { PORTFOLIO_DEFAULT_RANGE } from "@/features/dashboard/constants"
import { buildPortfolioSeries } from "@/features/dashboard/helpers/portfolio-series"
import {
  MOCK_BALANCE_BY_CHAIN,
  MOCK_KPIS,
  MOCK_MARKET_LEADERS,
  MOCK_TOP_ASSETS,
  MOCK_TOP_GAINERS,
  MOCK_TRANSACTIONS,
} from "@/features/dashboard/mocks/mock-data"
import type { Balance } from "@/features/dashboard/types"
import { request } from "@/shared/api/request"

export const getKpis = () => request(MOCK_KPIS)

export const getMarketLeaders = () => request(MOCK_MARKET_LEADERS)

export const getPortfolioSeries = () =>
  request(buildPortfolioSeries(PORTFOLIO_DEFAULT_RANGE))

export const getTransactions = () => request(MOCK_TRANSACTIONS)

export const getBalance = async (): Promise<Balance> => {
  const byChain = await request(MOCK_BALANCE_BY_CHAIN)
  return { byChain, updatedAt: new Date().toISOString() }
}

export const getTopAssets = () => request(MOCK_TOP_ASSETS)

export const getTopGainers = () => request(MOCK_TOP_GAINERS)
