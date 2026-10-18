import {
  getActiveOrders,
  getOrderHistory,
  getRunningTrades,
  getTradingAccount,
} from "@/features/trade/api/trade"
import { Prefetched } from "@/shared/providers/prefetch"

import { tradeQueries } from "../api/queries"
import { MarketChart } from "../components/market-chart"
import { OrderBook } from "../components/order-book"
import { OrderForm } from "../components/order-form"
import { OrdersCard } from "../components/orders-card"
import { RunningTrades } from "../components/running-trades"
import { DEFAULT_CANDLE_TIMEFRAME } from "../constants"

export const OrderBookSection = ({ pair }: { pair: string }) => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery(tradeQueries.orderBook(pair)),
      client.prefetchQuery(tradeQueries.trades(pair)),
    ]}
  >
    <OrderBook />
  </Prefetched>
)

export const RunningTradesSection = async () => (
  <RunningTrades trades={await getRunningTrades()} />
)

export const MarketChartSection = ({ pair }: { pair: string }) => (
  <Prefetched
    prefetch={(client) => [
      client.prefetchQuery(tradeQueries.tickers()),
      client.prefetchQuery(tradeQueries.orderBook(pair)),
      client.prefetchQuery(
        tradeQueries.candles(pair, DEFAULT_CANDLE_TIMEFRAME)
      ),
    ]}
  >
    <MarketChart />
  </Prefetched>
)

export const OrderFormSection = async () => (
  <Prefetched
    prefetch={(client) => [client.prefetchQuery(tradeQueries.tickers())]}
  >
    <OrderForm account={await getTradingAccount()} />
  </Prefetched>
)

export const OrdersSection = async () => {
  const [active, history] = await Promise.all([
    getActiveOrders(),
    getOrderHistory(),
  ])
  return <OrdersCard active={active} history={history} />
}
