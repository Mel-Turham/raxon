import "server-only"

import type { SwapQuote } from "../types"

const quotes = new Map<string, SwapQuote>()

export const saveSwapQuote = (quote: SwapQuote) => {
  quotes.set(quote.id, quote)
}

export const takeSwapQuote = (id: string) => {
  const quote = quotes.get(id)
  quotes.delete(id)
  return quote
}
