"use server"

import { z } from "zod"

import { getOtcDashboardData } from "./api/otc"
import { OTC_BASE_ASSETS, OTC_QUOTE_ASSETS, OTC_SIDES } from "./constants"
import { createReference } from "./helpers/quote"

export type ConfirmOtcTradeInput = {
  quoteId: string
  side: (typeof OTC_SIDES)[number]
  baseAsset: (typeof OTC_BASE_ASSETS)[number]
  quoteAsset: (typeof OTC_QUOTE_ASSETS)[number]
  amount: number
  total: number
  expiresAt: number
}

export type ConfirmOtcTradeResult =
  { ok: true; reference: string } | { ok: false; error: string }

const confirmSchema = z.object({
  quoteId: z.string().regex(/^OTC-[A-Z0-9]{7}$/),
  side: z.enum(OTC_SIDES),
  baseAsset: z.enum(OTC_BASE_ASSETS),
  quoteAsset: z.enum(OTC_QUOTE_ASSETS),
  amount: z.number().finite().positive(),
  total: z.number().finite().positive(),
  expiresAt: z.number().int().positive(),
})

export async function confirmOtcTrade(
  input: ConfirmOtcTradeInput
): Promise<ConfirmOtcTradeResult> {
  const parsed = confirmSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid quote." }

  const { side, baseAsset, quoteAsset, amount, total, expiresAt } = parsed.data
  if (Date.now() > expiresAt) {
    return { ok: false, error: "This quote has expired. Request a new one." }
  }

  const { balances } = await getOtcDashboardData()
  const [asset, required] =
    side === "Buy" ? [quoteAsset, total] : [baseAsset, amount]
  if (required > balances[asset]) {
    return { ok: false, error: `Insufficient ${asset} balance.` }
  }

  return { ok: true, reference: createReference() }
}
