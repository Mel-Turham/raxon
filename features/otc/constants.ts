export const OTC_SIDES = ["Buy", "Sell"] as const
export const OTC_BASE_ASSETS = ["BTC", "ETH"] as const
export const OTC_QUOTE_ASSETS = ["USDT", "USDC"] as const

export const OTC_SETTLEMENTS = [
  { value: "instant", label: "Instant", eta: "Under 5 min" },
  { value: "same-day", label: "Same day", eta: "Before 18:00 UTC" },
  { value: "t+1", label: "T+1", eta: "Next business day" },
] as const

export const OTC_SIZE_PRESETS = [25, 50, 75, 100] as const

export const OTC_QUOTE_TTL_SECONDS = 30

export const OTC_ACTIVITY_FILTERS = ["All", "Completed", "Expired"] as const

export const OTC_STEPS = [
  {
    title: "Request a quote",
    description: "Choose the pair, size and how you want to settle.",
  },
  {
    title: "Review the firm price",
    description: "The desk locks a price for 30 seconds, fees included.",
  },
  {
    title: "Confirm and settle",
    description: "Funds are exchanged and credited to your wallet.",
  },
] as const
