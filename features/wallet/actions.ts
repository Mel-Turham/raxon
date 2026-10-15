"use server"

import { z } from "zod"

import { CURRENT_USER } from "@/shared/config"
import { saveSwapQuote, takeSwapQuote } from "./api/swap-quotes"
import { findTransferUser } from "./api/transfer"
import { getWalletAssets } from "./api/wallet"
import { NETWORK_IDS, SWAP_QUOTE_TTL_MS, TRANSFER_NOTE_MAX } from "./constants"
import { mockDepositAddress } from "./helpers/address"
import { swapPreview, validateSwapAmount } from "./helpers/swap"
import { isRecipientQuery, validateTransferAmount } from "./helpers/transfer"
import {
  validateAddress,
  validateAmount,
  withdrawalReceive,
} from "./helpers/withdraw"
import type {
  DepositAddress,
  NetworkId,
  SwapQuote,
  SwapReceipt,
  SwapRequest,
  TransferReceipt,
  TransferRecipient,
  TransferRequest,
  WithdrawalReceipt,
  WithdrawalRequest,
} from "./types"

export type DepositAddressResult =
  { ok: true; data: DepositAddress } | { ok: false; error: string }

const depositAddressSchema = z.object({
  symbol: z.string().regex(/^[A-Z0-9]{2,10}$/),
  network: z.enum(NETWORK_IDS as [string, ...string[]]),
})

export async function requestDepositAddress(input: {
  symbol: string
  network: string
}): Promise<DepositAddressResult> {
  const parsed = depositAddressSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid deposit request." }

  const { symbol, network } = parsed.data
  const assets = await getWalletAssets()
  const asset = assets.find((item) => item.symbol === symbol)
  const supported = asset?.networks.find((item) => item.id === network)
  if (!asset || !supported) {
    return { ok: false, error: `${symbol} is not supported on this network.` }
  }

  return {
    ok: true,
    data: {
      address: mockDepositAddress(CURRENT_USER.email, supported.id),
    },
  }
}

export type WithdrawalResult =
  { ok: true; receipt: WithdrawalReceipt } | { ok: false; error: string }

const withdrawalSchema = z.object({
  symbol: z.string().regex(/^[A-Z0-9]{2,10}$/),
  network: z.enum(NETWORK_IDS as [NetworkId, ...NetworkId[]]),
  address: z.string().trim().min(1).max(128),
  amount: z.number().finite().positive(),
})

export async function submitWithdrawal(
  input: WithdrawalRequest
): Promise<WithdrawalResult> {
  const parsed = withdrawalSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid withdrawal." }

  const { symbol, network: networkId, address, amount } = parsed.data
  const assets = await getWalletAssets()
  const asset = assets.find((item) => item.symbol === symbol)
  const network = asset?.networks.find((item) => item.id === networkId)
  if (!asset || !network) {
    return { ok: false, error: `${symbol} is not supported on this network.` }
  }

  const error =
    validateAddress(address, network) ?? validateAmount(amount, asset, network)
  if (error) return { ok: false, error }

  return {
    ok: true,
    receipt: {
      reference: `WD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      receive: withdrawalReceive(amount, network),
      fee: network.withdrawFee,
      arrivalMinutes: network.arrivalMinutes,
    },
  }
}

export type SwapQuoteResult =
  { ok: true; quote: SwapQuote } | { ok: false; error: string }

const swapQuoteSchema = z.object({
  from: z.string().regex(/^[A-Z0-9]{2,10}$/),
  to: z.string().regex(/^[A-Z0-9]{2,10}$/),
  amount: z.number().finite().positive(),
})

export async function getSwapQuote(
  input: SwapRequest
): Promise<SwapQuoteResult> {
  const parsed = swapQuoteSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid swap." }

  const { from: fromSymbol, to: toSymbol, amount } = parsed.data
  const assets = await getWalletAssets()
  const from = assets.find((item) => item.symbol === fromSymbol)
  const to = assets.find((item) => item.symbol === toSymbol)
  if (!from || !to || from === to) {
    return { ok: false, error: "This pair is not available." }
  }

  const error = validateSwapAmount(amount, from)
  if (error) return { ok: false, error }

  const quote: SwapQuote = {
    id: crypto.randomUUID(),
    from: fromSymbol,
    to: toSymbol,
    amount,
    ...swapPreview(amount, from, to),
    expiresAt: Date.now() + SWAP_QUOTE_TTL_MS,
  }
  saveSwapQuote(quote)
  return { ok: true, quote }
}

export type SwapResult =
  { ok: true; receipt: SwapReceipt } | { ok: false; error: string }

export async function submitSwap(quoteId: string): Promise<SwapResult> {
  const parsed = z.uuid().safeParse(quoteId)
  if (!parsed.success) return { ok: false, error: "Invalid quote." }

  const quote = takeSwapQuote(parsed.data)
  if (!quote || Date.now() > quote.expiresAt) {
    return { ok: false, error: "Quote expired. Refresh to get a new rate." }
  }

  return {
    ok: true,
    receipt: {
      reference: `SW-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      receive: quote.receive,
    },
  }
}

export type RecipientResult =
  { ok: true; recipient: TransferRecipient } | { ok: false; error: string }

export async function findRecipient(query: string): Promise<RecipientResult> {
  const parsed = z.string().trim().max(254).safeParse(query)
  if (!parsed.success || !isRecipientQuery(parsed.data)) {
    return { ok: false, error: "Enter an email or an 8-digit Raxon ID." }
  }
  if (parsed.data.toLowerCase() === CURRENT_USER.email.toLowerCase()) {
    return { ok: false, error: "You can't transfer to yourself." }
  }

  const recipient = await findTransferUser(parsed.data)
  if (!recipient) {
    return { ok: false, error: "No Raxon account found for this email or ID." }
  }
  return { ok: true, recipient }
}

export type TransferResult =
  { ok: true; receipt: TransferReceipt } | { ok: false; error: string }

const transferSchema = z.object({
  recipientId: z.string().regex(/^\d{8}$/),
  symbol: z.string().regex(/^[A-Z0-9]{2,10}$/),
  amount: z.number().finite().positive(),
  note: z.string().trim().max(TRANSFER_NOTE_MAX).optional(),
})

export async function submitTransfer(
  input: TransferRequest
): Promise<TransferResult> {
  const parsed = transferSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Invalid transfer." }

  const { recipientId, symbol, amount } = parsed.data
  const [recipient, assets] = await Promise.all([
    findTransferUser(recipientId),
    getWalletAssets(),
  ])
  const asset = assets.find((item) => item.symbol === symbol)
  if (!recipient || !asset) return { ok: false, error: "Invalid transfer." }

  const error = validateTransferAmount(amount, asset)
  if (error) return { ok: false, error }

  return {
    ok: true,
    receipt: {
      reference: `TR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    },
  }
}
