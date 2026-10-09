import "server-only"

import { cache } from "react"

import {
  MOCK_ACTIVE_ORDERS,
  MOCK_MARKET_TRADES,
  MOCK_ORDER_BOOK,
  MOCK_ORDER_HISTORY,
  MOCK_RUNNING_TRADES,
  MOCK_TICKERS,
  MOCK_TRADING_ACCOUNT,
} from "@/lib/api/mock-trade-data"
import { request } from "@/lib/api/request"

// cache(): sections that need the same data share one request per render.

export const getOrderBook = cache(() => request(MOCK_ORDER_BOOK))

export const getMarketTrades = () => request(MOCK_MARKET_TRADES)

export const getRunningTrades = () => request(MOCK_RUNNING_TRADES)

export const getMarketTickers = cache(() => request(MOCK_TICKERS))

export const getTradingAccount = () => request(MOCK_TRADING_ACCOUNT)

export const getActiveOrders = () => request(MOCK_ACTIVE_ORDERS)

export const getOrderHistory = () => request(MOCK_ORDER_HISTORY)
