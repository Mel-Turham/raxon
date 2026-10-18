import "server-only"

import { binanceCloses, toUsdtSymbol } from "@/shared/api/binance"
import { createRandom } from "@/shared/lib/random"
import { DAY } from "@/shared/lib/time"
import type {
  AccountHolding,
  AccountNetwork,
  AccountOrder,
  AccountSource,
  AccountTrade,
} from "./types"

const QUOTE = "USDT"
const FEE_RATE = 0.001
const HISTORY_DAYS = 365

const DEMO_HOLDINGS: Record<string, number> = {
  BTC: 0.4231,
  ETH: 2.1,
  SOL: 14.2,
  BNB: 3.05,
  USDT: 1_204,
  USDC: 860.5,
}

const TRADED_SYMBOLS = ["BTC", "ETH", "SOL", "BNB"]

const DEMO_OPEN_ORDERS = [
  { base: "BTC", side: "buy", offset: -0.04, share: 0.01 },
  { base: "ETH", side: "sell", offset: 0.06, share: 0.2 },
  { base: "SOL", side: "buy", offset: -0.05, share: 0.1 },
] as const

const network = (
  id: AccountNetwork["network"],
  minDeposit: number,
  withdrawFee: number
): AccountNetwork => ({
  network: id,
  minDeposit,
  withdrawFee,
  minWithdraw: withdrawFee * 2,
})

const DEMO_NETWORKS: Record<string, AccountNetwork[]> = {
  BTC: [network("bitcoin", 0.0001, 0.0002), network("bnb", 0.00001, 0.00001)],
  ETH: [network("ethereum", 0.005, 0.0012), network("bnb", 0.0005, 0.0001)],
  USDT: [
    network("ethereum", 10, 4),
    network("tron", 1, 1),
    network("bnb", 1, 0.3),
    network("solana", 1, 1),
  ],
  USDC: [
    network("ethereum", 10, 4),
    network("solana", 1, 1),
    network("polygon", 1, 0.5),
  ],
  SOL: [network("solana", 0.01, 0.008)],
  BNB: [network("bnb", 0.001, 0.0005)],
}

const latestClose = async (symbol: string) =>
  (await binanceCloses(toUsdtSymbol(symbol), "1d", 1)).at(-1)?.close ?? 0

const tradesFor = async (base: string): Promise<AccountTrade[]> => {
  const closes = (
    await binanceCloses(toUsdtSymbol(base), "1d", HISTORY_DAYS + 1)
  ).slice(0, -1)
  const random = createRandom(`demo-trades-${base}`)
  const target = DEMO_HOLDINGS[base]
  const trades: AccountTrade[] = []
  let position = 0
  let day = Math.floor(random() * 6)

  while (day < closes.length) {
    const { time, close } = closes[day]
    const isSell = position > target * 0.3 && random() < 0.42
    const amount = isSell
      ? position * (0.2 + random() * 0.4)
      : target * (0.08 + random() * 0.22)
    const price = close * (1 + (random() - 0.5) * 0.01)
    position += isSell ? -amount : amount
    trades.push({
      id: `${base}-${day}`,
      base,
      quote: QUOTE,
      side: isSell ? "sell" : "buy",
      price,
      amount,
      feeUsd: price * amount * FEE_RATE,
      executedAt: new Date(time + random() * DAY).toISOString(),
    })
    day += 4 + Math.floor(random() * 9)
  }
  return trades
}

const getTrades = async () =>
  (await Promise.all(TRADED_SYMBOLS.map(tradesFor)))
    .flat()
    .sort((a, b) => a.executedAt.localeCompare(b.executedAt))

const getOpenOrders = async (): Promise<AccountOrder[]> =>
  Promise.all(
    DEMO_OPEN_ORDERS.map(async ({ base, side, offset, share }, index) => {
      const amount = DEMO_HOLDINGS[base] * share
      return {
        id: `demo-open-${index}`,
        base,
        quote: QUOTE,
        side,
        status: "open",
        price: (await latestClose(base)) * (1 + offset),
        amount,
        filled: 0,
        createdAt: new Date(
          Date.now() - (index + 1) * 5 * 3_600_000
        ).toISOString(),
      }
    })
  )

const getHoldings = async (): Promise<AccountHolding[]> => {
  const orders = await getOpenOrders()
  const locked = new Map<string, number>()
  for (const order of orders) {
    const asset = order.side === "buy" ? order.quote : order.base
    const amount =
      order.side === "buy" ? order.price * order.amount : order.amount
    locked.set(asset, (locked.get(asset) ?? 0) + amount)
  }
  return Object.entries(DEMO_HOLDINGS).map(([symbol, total]) => {
    const reserved = Math.min(total, locked.get(symbol) ?? 0)
    return { symbol, free: total - reserved, locked: reserved }
  })
}

const getOrderHistory = async (): Promise<AccountOrder[]> =>
  (await getTrades()).map((trade, index) => ({
    id: `demo-order-${trade.id}`,
    base: trade.base,
    quote: trade.quote,
    side: trade.side,
    status: index % 7 === 3 ? "cancelled" : "filled",
    price: trade.price,
    amount: trade.amount,
    filled: index % 7 === 3 ? 0 : trade.amount,
    createdAt: trade.executedAt,
  }))

export const demoAccount: AccountSource = {
  holdings: getHoldings,
  trades: getTrades,
  openOrders: getOpenOrders,
  orderHistory: getOrderHistory,
  feeRate: async () => FEE_RATE,
  networks: async () => DEMO_NETWORKS,
}
