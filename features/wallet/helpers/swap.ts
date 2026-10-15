import { SWAP_FEE_RATE, SWAP_MIN_USD } from "../constants"
import type { WalletAsset } from "../types"

export const swapRate = (from: WalletAsset, to: WalletAsset) =>
  from.price / to.price

export const swapPreview = (
  amount: number,
  from: WalletAsset,
  to: WalletAsset
) => {
  const rate = swapRate(from, to)
  const gross = amount * rate
  const fee = gross * SWAP_FEE_RATE
  return { rate, fee, receive: Math.max(0, gross - fee) }
}

export const validateSwapAmount = (amount: number, from: WalletAsset) => {
  if (!(amount > 0)) return "Enter an amount."
  if (amount > from.balance) return `Insufficient ${from.symbol} balance.`
  if (amount * from.price < SWAP_MIN_USD) {
    return `Minimum swap is $${SWAP_MIN_USD}.`
  }
  return null
}

export const RATE = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 6,
})
