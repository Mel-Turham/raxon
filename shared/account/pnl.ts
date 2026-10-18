import type { AccountTrade } from "./types"

export type ClosedTrade = {
  id: string
  base: string
  closedAt: string
  pnl: number
  feeUsd: number
  volume: number
  holdingMinutes: number
}

type Lot = { amount: number; price: number; feePerUnit: number; time: number }

const MINUTE_MS = 60_000

export const closeTrades = (trades: AccountTrade[]): ClosedTrade[] => {
  const lots = new Map<string, Lot[]>()
  const closed: ClosedTrade[] = []

  for (const trade of trades) {
    const time = Date.parse(trade.executedAt)
    const queue = lots.get(trade.base) ?? []
    lots.set(trade.base, queue)

    if (trade.side === "buy") {
      queue.push({
        amount: trade.amount,
        price: trade.price,
        feePerUnit: trade.feeUsd / trade.amount,
        time,
      })
      continue
    }

    let remaining = trade.amount
    let costBasis = 0
    let buyFees = 0
    let heldMinutes = 0
    let matched = 0
    while (remaining > 0 && queue.length) {
      const lot = queue[0]
      const take = Math.min(lot.amount, remaining)
      costBasis += take * lot.price
      buyFees += take * lot.feePerUnit
      heldMinutes += take * ((time - lot.time) / MINUTE_MS)
      matched += take
      lot.amount -= take
      remaining -= take
      if (lot.amount <= 0) queue.shift()
    }
    if (!matched) continue

    const sellFee = trade.feeUsd * (matched / trade.amount)
    closed.push({
      id: trade.id,
      base: trade.base,
      closedAt: trade.executedAt,
      pnl: matched * trade.price - costBasis - buyFees - sellFee,
      feeUsd: buyFees + sellFee,
      volume: matched * trade.price,
      holdingMinutes: heldMinutes / matched,
    })
  }
  return closed
}
