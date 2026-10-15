"use server"

import { z } from "zod"
import { getWalletHoldings } from "@/features/portfolio/api/portfolio"
import type { ExchangeMode } from "@/features/portfolio/constants"

export type ExchangeInput = {
  mode: ExchangeMode

  symbols: string[]

  limitPrice?: number
}

export type ExchangeResult =
  { ok: true; reference: string } | { ok: false; error: string }

const MAX_SYMBOLS = 5

const exchangeSchema = z.object({
  mode: z.enum(["Swap", "Limit"]),
  symbols: z
    .array(z.string().min(1).max(16))
    .min(1, "Select at least one asset to sell.")
    .max(MAX_SYMBOLS, "Too many assets."),
  limitPrice: z.number().finite().positive().max(1_000_000_000).optional(),
})

export async function submitExchange(
  input: ExchangeInput
): Promise<ExchangeResult> {
  const parsed = exchangeSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid exchange request.",
    }
  }

  const { mode, symbols, limitPrice } = parsed.data

  if (new Set(symbols).size !== symbols.length) {
    return { ok: false, error: "Each asset can only be used once." }
  }
  if (mode === "Limit" && !(limitPrice != null && limitPrice > 0)) {
    return { ok: false, error: "Enter a limit price." }
  }

  const holdings = await getWalletHoldings()
  const missing = symbols.find(
    (symbol) => !holdings.some((holding) => holding.symbol === symbol)
  )
  if (missing) {
    return { ok: false, error: `${missing} is not in your wallet.` }
  }

  return { ok: true, reference: crypto.randomUUID().slice(0, 8) }
}
