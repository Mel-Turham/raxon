"use server"

import { EXCHANGE_MODES, type ExchangeMode } from "@/constants"
import { getWalletHoldings } from "@/lib/api/portfolio"

export type ExchangeInput = {
  mode: ExchangeMode
  /** Assets sold by the swap. */
  symbols: string[]
  /** Required in Limit mode, in USD. */
  limitPrice?: number
}

export type ExchangeResult =
  { ok: true; reference: string } | { ok: false; error: string }

/** Validates an exchange request. Swap the mock for the exchange API later. */
export async function submitExchange(
  input: ExchangeInput
): Promise<ExchangeResult> {
  if (!EXCHANGE_MODES.includes(input.mode)) {
    return { ok: false, error: "Unknown exchange mode." }
  }
  if (new Set(input.symbols).size !== input.symbols.length) {
    return { ok: false, error: "Each asset can only be used once." }
  }
  if (input.mode === "Limit" && !((input.limitPrice ?? 0) > 0)) {
    return { ok: false, error: "Enter a limit price." }
  }

  const holdings = await getWalletHoldings()
  const missing = input.symbols.find(
    (symbol) => !holdings.some((holding) => holding.symbol === symbol)
  )
  if (missing) {
    return { ok: false, error: `${missing} is not in your wallet.` }
  }

  return { ok: true, reference: crypto.randomUUID().slice(0, 8) }
}
