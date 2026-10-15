import { ADDRESS_PATTERNS } from "../constants"
import type { AssetNetwork, WalletAsset } from "../types"
import { networkLabel } from "./network"
import { CRYPTO_AMOUNT } from "@/shared/lib/format"

export const withdrawalReceive = (amount: number, network: AssetNetwork) =>
  Math.max(0, amount - network.withdrawFee)

export const validateAddress = (address: string, network: AssetNetwork) =>
  ADDRESS_PATTERNS[network.id].test(address.trim())
    ? null
    : `Enter a valid ${networkLabel(network)} address.`

export const validateAmount = (
  amount: number,
  asset: WalletAsset,
  network: AssetNetwork
) => {
  if (!(amount > 0)) return "Enter an amount."
  if (amount > asset.balance) return `Insufficient ${asset.symbol} balance.`
  if (amount < network.minWithdraw) {
    return `Minimum withdrawal is ${CRYPTO_AMOUNT.format(network.minWithdraw)} ${asset.symbol}.`
  }
  return null
}
