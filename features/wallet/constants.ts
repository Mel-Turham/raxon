import type { AssetNetwork, NetworkId } from "./types"

export const NETWORKS: Record<
  NetworkId,
  Omit<AssetNetwork, "minDeposit" | "minWithdraw" | "withdrawFee">
> = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    nativeSymbol: "BTC",
    arrivalMinutes: 30,
    confirmations: 2,
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    standard: "ERC20",
    nativeSymbol: "ETH",
    arrivalMinutes: 5,
    confirmations: 12,
  },
  bnb: {
    id: "bnb",
    name: "BNB Chain",
    standard: "BEP20",
    nativeSymbol: "BNB",
    arrivalMinutes: 1,
    confirmations: 15,
  },
  solana: {
    id: "solana",
    name: "Solana",
    standard: "SPL",
    nativeSymbol: "SOL",
    arrivalMinutes: 1,
    confirmations: 32,
  },
  tron: {
    id: "tron",
    name: "Tron",
    standard: "TRC20",
    nativeSymbol: "TRX",
    arrivalMinutes: 2,
    confirmations: 19,
  },
  polygon: {
    id: "polygon",
    name: "Polygon",
    nativeSymbol: "MATIC",
    arrivalMinutes: 3,
    confirmations: 128,
  },
}

export const NETWORK_IDS = Object.keys(NETWORKS) as NetworkId[]

export const POPULAR_ASSETS = ["BTC", "ETH", "USDT"] as const

export const DEPOSIT_METHODS = ["Crypto", "Card & bank"] as const

const EVM_ADDRESS = /^0x[a-fA-F0-9]{40}$/

export const ADDRESS_PATTERNS: Record<NetworkId, RegExp> = {
  bitcoin: /^(bc1[02-9ac-hj-np-z]{25,59}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/,
  ethereum: EVM_ADDRESS,
  bnb: EVM_ADDRESS,
  polygon: EVM_ADDRESS,
  solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  tron: /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
}

export const SWAP_FEE_RATE = 0.001
export const SWAP_MIN_USD = 10
export const SWAP_QUOTE_TTL_MS = 15_000
export const AMOUNT_PRESETS = [0.25, 0.5, 0.75, 1] as const

export const TRANSFER_NOTE_MAX = 140
