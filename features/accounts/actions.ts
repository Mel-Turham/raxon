"use server"

import { z } from "zod"

import { getWalletAssets } from "@/features/wallet/api/wallet"
import { CURRENT_USER } from "@/shared/config"
import { maskEmail } from "@/features/wallet/helpers/transfer"
import { getAccountNames, saveAccountName } from "./api/accounts"
import {
  ACCOUNT_COLORS,
  ACCOUNT_TYPE_IDS,
  ACCOUNT_TYPES,
  DEMO_VERIFICATION_CODE,
  VERIFICATION_CODE_LENGTH,
} from "./constants"
import {
  normalizeAccountName,
  validateAccountName,
  validateFundingAmount,
} from "./helpers/account"
import type { CreateAccountRequest, CreatedAccount } from "./types"

export async function sendVerificationCode(): Promise<{ sentTo: string }> {
  return { sentTo: maskEmail(CURRENT_USER.email) }
}

export type CreateAccountResult =
  { ok: true; account: CreatedAccount } | { ok: false; error: string }

const createAccountSchema = z.object({
  type: z.enum(ACCOUNT_TYPE_IDS as [string, ...string[]]),
  name: z.string().max(64),
  color: z.enum(ACCOUNT_COLORS),
  leverage: z.number().int().min(1),
  marginMode: z.enum(["cross", "isolated"]),
  funding: z
    .object({
      symbol: z.string().regex(/^[A-Z0-9]{2,10}$/),
      amount: z.number().finite().positive(),
    })
    .optional(),
  riskAccepted: z.boolean(),
  code: z.string().length(VERIFICATION_CODE_LENGTH).regex(/^\d+$/),
})

export async function createAccount(
  input: CreateAccountRequest
): Promise<CreateAccountResult> {
  const parsed = createAccountSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid account details." }

  const { color, leverage, marginMode, funding, riskAccepted, code } =
    parsed.data
  const type = parsed.data.type as CreateAccountRequest["type"]
  const config = ACCOUNT_TYPES[type]
  const name = normalizeAccountName(parsed.data.name)

  if (code !== DEMO_VERIFICATION_CODE) {
    return { ok: false, error: "Incorrect verification code." }
  }
  if (leverage > config.maxLeverage) {
    return { ok: false, error: `Max leverage is ${config.maxLeverage}×.` }
  }
  if (config.leveraged && !riskAccepted) {
    return { ok: false, error: "Please acknowledge the leverage risk." }
  }

  const nameError = validateAccountName(name, await getAccountNames())
  if (nameError) return { ok: false, error: nameError }

  if (funding) {
    const assets = await getWalletAssets()
    const asset = assets.find((item) => item.symbol === funding.symbol)
    if (!asset) return { ok: false, error: "Unsupported funding asset." }
    const fundingError = validateFundingAmount(funding.amount, asset.balance)
    if (fundingError) return { ok: false, error: fundingError }
  }

  saveAccountName(name)
  return {
    ok: true,
    account: {
      uid: String(
        (crypto.getRandomValues(new Uint32Array(1))[0] % 90_000_000) +
          10_000_000
      ),
      type,
      name,
      color,
      leverage: config.leveraged ? leverage : 1,
      marginMode,
      funding,
    },
  }
}
