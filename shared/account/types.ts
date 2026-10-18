export type AccountHolding = {
  symbol: string
  free: number
  locked: number
}

export type AccountNetwork = {
  network: "bitcoin" | "ethereum" | "bnb" | "solana" | "tron" | "polygon"
  minDeposit: number
  minWithdraw: number
  withdrawFee: number
}

export type AccountTrade = {
  id: string
  base: string
  quote: string
  side: "buy" | "sell"
  price: number
  amount: number
  feeUsd: number
  executedAt: string
}

export type AccountOrder = {
  id: string
  base: string
  quote: string
  side: "buy" | "sell"
  status: "open" | "filled" | "cancelled"
  price: number
  amount: number
  filled: number
  createdAt: string
}

export type AccountSource = {
  holdings: () => Promise<AccountHolding[]>
  trades: () => Promise<AccountTrade[]>
  openOrders: () => Promise<AccountOrder[]>
  orderHistory: () => Promise<AccountOrder[]>
  feeRate: () => Promise<number>
  networks: () => Promise<Record<string, AccountNetwork[]>>
}
