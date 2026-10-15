import type {
  OTC_BASE_ASSETS,
  OTC_QUOTE_ASSETS,
  OTC_SETTLEMENTS,
  OTC_SIDES,
} from "../constants"

export type OtcSide = (typeof OTC_SIDES)[number]
export type OtcBaseAsset = (typeof OTC_BASE_ASSETS)[number]
export type OtcQuoteAsset = (typeof OTC_QUOTE_ASSETS)[number]
export type OtcAsset = OtcBaseAsset | OtcQuoteAsset
export type OtcSettlement = (typeof OTC_SETTLEMENTS)[number]["value"]
export type OtcActivityStatus = "Completed" | "Quote expired"

export type OtcActivity = {
  id: string
  baseAsset: OtcBaseAsset
  quoteAsset: OtcQuoteAsset
  side: OtcSide
  amount: number
  price: number
  status: OtcActivityStatus
  date: string
}

export type OtcQuoteRequest = {
  side: OtcSide
  baseAsset: OtcBaseAsset
  quoteAsset: OtcQuoteAsset
  amount: number
  settlement: OtcSettlement
}

export type OtcQuote = OtcQuoteRequest & {
  id: string
  referencePrice: number
  price: number
  total: number
  spread: number
  issuedAt: number
  expiresAt: number
}

export type OtcDeskStats = {
  volume30d: number
  volumeChange: number
  completedTrades: number
  avgSettlementMinutes: number
  minTicket: number
}

export type OtcDashboardData = {
  balances: Record<OtcAsset, number>
  prices: Record<OtcBaseAsset, number>
  spread: number
  desk: OtcDeskStats
  activity: OtcActivity[]
}
