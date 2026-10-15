export type NetworkId =
  "bitcoin" | "ethereum" | "bnb" | "solana" | "tron" | "polygon"

export type AssetNetwork = {
  id: NetworkId
  name: string
  standard?: string
  nativeSymbol: string
  arrivalMinutes: number
  confirmations: number
  minDeposit: number
  minWithdraw: number
  withdrawFee: number
}

export type WalletAsset = {
  symbol: string
  name: string
  balance: number
  price: number
  networks: AssetNetwork[]
}

export type DepositAddress = {
  address: string
  memo?: string
}

export type WithdrawalRequest = {
  symbol: string
  network: NetworkId
  address: string
  amount: number
}

export type WithdrawalReceipt = {
  reference: string
  receive: number
  fee: number
  arrivalMinutes: number
}

export type SwapRequest = {
  from: string
  to: string
  amount: number
}

export type SwapQuote = SwapRequest & {
  id: string
  rate: number
  fee: number
  receive: number
  expiresAt: number
}

export type SwapReceipt = {
  reference: string
  receive: number
}

export type TransferRecipient = {
  id: string
  name: string
  handle: string
  avatar: string
}

export type TransferRequest = {
  recipientId: string
  symbol: string
  amount: number
  note?: string
}

export type TransferReceipt = {
  reference: string
}
