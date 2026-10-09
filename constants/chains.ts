import {
  type IconComponentProps,
  TokenBNB,
  TokenETH,
  TokenPOL,
  TokenSOL,
} from "@web3icons/react"
import type { ComponentType } from "react"

export const CHAIN_IDS = ["bnb", "ethereum", "solana", "polygon"] as const

export type ChainId = (typeof CHAIN_IDS)[number]

export const DEFAULT_CHAIN: ChainId = "bnb"

export const CHAINS: Record<
  ChainId,
  { label: string; icon: ComponentType<IconComponentProps> }
> = {
  bnb: { label: "BNB Chain", icon: TokenBNB },
  ethereum: { label: "Ethereum", icon: TokenETH },
  solana: { label: "Solana", icon: TokenSOL },
  polygon: { label: "Polygon", icon: TokenPOL },
}
