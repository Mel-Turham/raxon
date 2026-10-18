export const KPI_SYMBOLS = ["BTC", "LTC", "XRP", "ETH"]

export const MARKET_LEADER_COUNT = 3
export const TRANSACTION_COUNT = 10
export const TOP_ASSET_COUNT = 5
export const TOP_GAINER_COUNT = 4

export const BALANCE_VIEWS = [
  { id: "total", label: "Total" },
  { id: "available", label: "Available" },
  { id: "inOrders", label: "In orders" },
] as const

export type BalanceView = (typeof BALANCE_VIEWS)[number]["id"]
