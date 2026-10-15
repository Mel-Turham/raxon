import {
  getActiveOrders,
  getMarketTickers,
  getMarketTrades,
  getOrderBook,
  getOrderHistory,
  getRunningTrades,
  getTradingAccount,
} from "@/features/trade/api/trade"

import { MarketChart } from "../components/market-chart"
import { OrderBook } from "../components/order-book"
import { OrderForm } from "../components/order-form"
import { OrdersCard } from "../components/orders-card"
import { RunningTrades } from "../components/running-trades"

export const OrderBookSection = async () => {
  const [book, trades] = await Promise.all([getOrderBook(), getMarketTrades()])
  return <OrderBook book={book} trades={trades} />
}

export const RunningTradesSection = async () => (
  <RunningTrades trades={await getRunningTrades()} />
)

export const MarketChartSection = async () => {
  const [tickers, book] = await Promise.all([
    getMarketTickers(),
    getOrderBook(),
  ])
  return <MarketChart book={book} tickers={tickers} />
}

export const OrderFormSection = async () => {
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
