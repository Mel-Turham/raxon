import "server-only"

import {
  type AccountOrder,
  getAccountTrades,
  getFeeRate,
  getHoldings,
  getOpenOrders,
  getOrderHistory as getAccountOrderHistory,
} from "@/shared/account"
import type { Order, Trade, TradingAccount } from "../types"

const RECENT_TRADES = 5
const ORDER_HISTORY_LIMIT = 20

const toOrder = (order: AccountOrder): Order => ({
  id: order.id,
  pair: `${order.base}/${order.quote}`,
  side: order.side,
  status: order.status,
  entryPrice: order.price,
  filled: order.amount ? (order.filled / order.amount) * 100 : 0,
  amount: order.amount,
  value: order.price * order.amount,
  createdAt: order.createdAt,
})

const newestFirst = (a: Order, b: Order) =>
  b.createdAt.localeCompare(a.createdAt)

export const getRunningTrades = async (): Promise<Trade[]> =>
  (await getAccountTrades())
    .slice(-RECENT_TRADES)
    .reverse()
    .map(({ id, price, amount, side, executedAt }) => ({
      id,
      price,
      amount,
      side,
      executedAt,
    }))

export const getTradingAccount = async (): Promise<TradingAccount> => {
  const [holdings, feeRate] = await Promise.all([getHoldings(), getFeeRate()])
  return {
    balances: Object.fromEntries(
      holdings.map((holding) => [holding.symbol, holding.free])
    ),
    feeRate,
  }
}

export const getActiveOrders = async () =>
  (await getOpenOrders()).map(toOrder).sort(newestFirst)

export const getOrderHistory = async () =>
  (await getAccountOrderHistory())
    .map(toOrder)
    .sort(newestFirst)
    .slice(0, ORDER_HISTORY_LIMIT)
