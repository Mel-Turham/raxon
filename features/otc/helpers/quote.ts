import { OTC_QUOTE_TTL_SECONDS } from "../constants"
import type {
  OtcActivity,
  OtcActivityStatus,
  OtcDashboardData,
  OtcQuote,
  OtcQuoteRequest,
  OtcSide,
} from "../types"

export const executionPrice = (
  referencePrice: number,
  spread: number,
  side: OtcSide
) => referencePrice * (side === "Buy" ? 1 + spread / 100 : 1 - spread / 100)

export const createReference = () =>
  `OTC-${crypto.randomUUID().slice(0, 7).toUpperCase()}`

export const buildQuote = (
  request: OtcQuoteRequest,
  data: Pick<OtcDashboardData, "prices" | "spread">
): OtcQuote => {
  const referencePrice = data.prices[request.baseAsset]
  const price = executionPrice(referencePrice, data.spread, request.side)
  const issuedAt = Date.now()

  return {
    ...request,
    id: createReference(),
    referencePrice,
    price,
    total: request.amount * price,
    spread: data.spread,
    issuedAt,
    expiresAt: issuedAt + OTC_QUOTE_TTL_SECONDS * 1000,
  }
}

export const quoteToActivity = (
  quote: OtcQuote,
  status: OtcActivityStatus,
  id = quote.id
): OtcActivity => ({
  id,
  baseAsset: quote.baseAsset,
  quoteAsset: quote.quoteAsset,
  side: quote.side,
  amount: quote.amount,
  price: quote.price,
  status,
  date: new Date().toISOString(),
})
