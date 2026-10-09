import {
  getActiveOrders,
  getMarketTickers,
  getMarketTrades,
  getOrderBook,
  getOrderHistory,
  getRunningTrades,
  getTradingAccount,
} from "@/lib/api/trade"

import { MarketChart } from "./market-chart"
import { OrderBook } from "./order-book"
import { OrderForm } from "./order-form"
import { OrdersCard } from "./orders-card"
import { RunningTrades } from "./running-trades"

// Async Server Components, each streaming behind its own skeleton.

export const OrderBookSection = async () => {
  // Fetched in parallel: the book and its trade history share one card.
  const [book, trades] = await Promise.all([getOrderBook(), getMarketTrades()])
  return <OrderBook book={book} trades={trades} />
}

export const RunningTradesSection = async () => (
  <RunningTrades trades={await getRunningTrades()} />
)

export const MarketChartSection = async () => {
  // The order book is shared with OrderBookSection through cache().
  const [tickers, book] = await Promise.all([
    getMarketTickers(),
    getOrderBook(),
  ])
  return <MarketChart book={book} tickers={tickers} />
}

export const OrderFormSection = async () => {
  // Tickers are shared with MarketChartSection through cache().
  const [tickers, account] = await Promise.all([
    getMarketTickers(),
    getTradingAccount(),
  ])
  return <OrderForm account={account} tickers={tickers} />
}

export const OrdersSection = async () => {
  const [active, history] = await Promise.all([
    getActiveOrders(),
    getOrderHistory(),
  ])
  return <OrdersCard active={active} history={history} />
}
