"use server"

import { z } from "zod"
import { getTradingAccount } from "@/features/trade/api/trade"
import {
  type OrderSide,
  TIME_IN_FORCE,
  type TimeInForce,
} from "@/features/trade/constants"

export type PlaceOrderInput = {
  pair: string
  side: OrderSide

  size: number
  stopPrice: number
  timeInForce: TimeInForce
}

export type PlaceOrderResult =
  { ok: true; orderId: string } | { ok: false; error: string }

const MAX_ORDER_VALUE = 1_000_000_000

const placeOrderSchema = z.object({
  pair: z
    .string()
    .max(32)
    .regex(/^[A-Z0-9]{2,10}\/[A-Z0-9]{2,10}$/i, "Unknown trading pair."),
  side: z.enum(["Buy", "Sell"]),
  size: z.number().finite().positive().max(MAX_ORDER_VALUE),
  stopPrice: z.number().finite().positive().max(MAX_ORDER_VALUE),
  timeInForce: z.enum(
    TIME_IN_FORCE.map(({ value }) => value) as [TimeInForce, ...TimeInForce[]]
  ),
})

export async function placeOrder(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid order.",
    }
  }

  const { size, side } = parsed.data
  const quote = parsed.data.pair.split("/")[1]
  const { balances } = await getTradingAccount()
  if (side === "Buy" && size > (balances[quote] ?? 0)) {
    return { ok: false, error: `Insufficient ${quote} balance.` }
  }

  return { ok: true, orderId: crypto.randomUUID() }
}
