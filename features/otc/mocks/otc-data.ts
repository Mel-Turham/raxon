import type { OtcDashboardData } from "../types"

export const MOCK_OTC_DATA: OtcDashboardData = {
  balances: {
    BTC: 4.2567,
    ETH: 28.42,
    USDT: 284_320.45,
    USDC: 146_220.18,
  },
  prices: {
    BTC: 66_980,
    ETH: 3_420.5,
  },
  spread: 0.12,
  desk: {
    volume30d: 2_846_310.4,
    volumeChange: 12.4,
    completedTrades: 18,
    avgSettlementMinutes: 4,
    minTicket: 50_000,
  },
  activity: [
    {
      id: "OTC-6F3A2B7",
      baseAsset: "BTC",
      quoteAsset: "USDT",
      side: "Buy",
      amount: 1.25,
      price: 67_060.38,
      status: "Completed",
      date: "2026-10-08T14:32:00Z",
    },
    {
      id: "OTC-9D4E1C2",
      baseAsset: "ETH",
      quoteAsset: "USDT",
      side: "Sell",
      amount: 18,
      price: 3_416.4,
      status: "Quote expired",
      date: "2026-10-07T11:17:00Z",
    },
    {
      id: "OTC-3B7F9D6",
      baseAsset: "BTC",
      quoteAsset: "USDC",
      side: "Sell",
      amount: 0.8,
      price: 66_899.62,
      status: "Completed",
      date: "2026-10-06T16:45:00Z",
    },
    {
      id: "OTC-1A8C5E4",
      baseAsset: "ETH",
      quoteAsset: "USDC",
      side: "Buy",
      amount: 42.5,
      price: 3_388.12,
      status: "Completed",
      date: "2026-10-03T09:08:00Z",
    },
  ],
}
