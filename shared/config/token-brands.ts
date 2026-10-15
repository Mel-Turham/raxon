import {
  type IconComponentProps,
  TokenADA,
  TokenBCN,
  TokenBNB,
  TokenBTC,
  TokenDMD,
  TokenDOGE,
  TokenETH,
  TokenETN,
  TokenMATIC,
  TokenQNT,
  TokenSOL,
  TokenTRX,
  TokenUSDC,
  TokenUSDT,
  TokenUTK,
  TokenXRP,
} from "@web3icons/react"
import type { ComponentType } from "react"

export type TokenBrand = {
  icon: ComponentType<IconComponentProps>
  background: string
  foreground: string
}

export const TOKEN_BRANDS: Record<string, TokenBrand> = {
  BTC: {
    icon: TokenBTC,
    background: "var(--token-btc)",
    foreground: "var(--token-foreground)",
  },
  SOL: {
    icon: TokenSOL,
    background: "var(--token-sol)",
    foreground: "var(--token-foreground)",
  },
  ETH: {
    icon: TokenETH,
    background: "var(--token-eth)",
    foreground: "var(--token-eth-foreground)",
  },
  UTK: {
    icon: TokenUTK,
    background: "var(--token-utk)",
    foreground: "var(--token-foreground)",
  },
  QNT: {
    icon: TokenQNT,
    background: "var(--token-qnt)",
    foreground: "var(--token-foreground)",
  },
  ETN: {
    icon: TokenETN,
    background: "var(--token-etn)",
    foreground: "var(--token-etn-foreground)",
  },
  XRP: {
    icon: TokenXRP,
    background: "var(--token-xrp)",
    foreground: "var(--token-foreground)",
  },
  BNB: {
    icon: TokenBNB,
    background: "var(--token-bnb)",
    foreground: "var(--token-foreground)",
  },
  MATIC: {
    icon: TokenMATIC,
    background: "var(--token-matic)",
    foreground: "var(--token-foreground)",
  },
  USDC: {
    icon: TokenUSDC,
    background: "var(--token-usdc)",
    foreground: "var(--token-foreground)",
  },
  USDT: {
    icon: TokenUSDT,
    background: "var(--token-usdt)",
    foreground: "var(--token-foreground)",
  },
  ADA: {
    icon: TokenADA,
    background: "var(--token-ada)",
    foreground: "var(--token-foreground)",
  },
  DOGE: {
    icon: TokenDOGE,
    background: "var(--token-doge)",
    foreground: "var(--token-foreground)",
  },
  TRX: {
    icon: TokenTRX,
    background: "var(--token-trx)",
    foreground: "var(--token-foreground)",
  },
  BCN: {
    icon: TokenBCN,
    background: "var(--token-bcn)",
    foreground: "var(--token-foreground)",
  },
  DMD: {
    icon: TokenDMD,
    background: "var(--token-dmd)",
    foreground: "var(--token-foreground)",
  },
}
