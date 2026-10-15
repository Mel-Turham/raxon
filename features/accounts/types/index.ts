import type { ACCOUNT_COLORS } from "../constants"

export type AccountType = "spot" | "margin" | "futures"

export type MarginMode = "cross" | "isolated"

export type AccountColor = (typeof ACCOUNT_COLORS)[number]

export type AccountFunding = {
  symbol: string
  amount: number
}

export type CreateAccountRequest = {
  type: AccountType
  name: string
  color: AccountColor
  leverage: number
  marginMode: MarginMode
  funding?: AccountFunding
  riskAccepted: boolean
  code: string
}

export type CreatedAccount = {
  uid: string
  type: AccountType
  name: string
  color: AccountColor
  leverage: number
  marginMode: MarginMode
  funding?: AccountFunding
}
