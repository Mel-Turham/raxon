"use server"

import {
  ORDER_SIDES,
  type OrderSide,
  TIME_IN_FORCE,
  type TimeInForce,
} from "@/constants"
import { getTradingAccount } from "@/lib/api/trade"

export type PlaceOrderInput = {
  pair: string
  side: OrderSide
  /** Order size, in quote currency. */
  size: number
  stopPrice: number
  timeInForce: TimeInForce
}

export type PlaceOrderResult =
  { ok: true; orderId: string } | { ok: false; error: string }

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  if (!ORDER_SIDES.includes(input.side)) {
    return { ok: false, error: "Unknown order side." }
  }
  if (!TIME_IN_FORCE.some(({ value }) => value === input.timeInForce)) {
    return { ok: false, error: "Unknown time in force." }
  }
  if (!(input.size > 0) || !(input.stopPrice > 0)) {
    return { ok: false, error: "Size and stop price must be positive." }
  }

  const { balances } = await getTradingAccount()
  const [, quote] = input.pair.split("/")
  if (input.side === "Buy" && input.size > (balances[quote] ?? 0)) {
    return { ok: false, error: `Insufficient ${quote} balance.` }
  }

  return { ok: true, orderId: crypto.randomUUID() }
}
