import type { WalletAsset } from "../types"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RAXON_ID = /^\d{8}$/

export const isRecipientQuery = (query: string) =>
  EMAIL.test(query.trim()) || RAXON_ID.test(query.trim())

export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@")
  return `${name.slice(0, 1)}***@${domain}`
}

export const validateTransferAmount = (amount: number, asset: WalletAsset) => {
  if (!(amount > 0)) return "Enter an amount."
  if (amount > asset.balance) return `Insufficient ${asset.symbol} balance.`
  return null
}
