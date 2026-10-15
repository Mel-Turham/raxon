import {
  Analytics01Icon,
  BitcoinCircleIcon,
  BitcoinReceiptIcon,
  ChartLineData01Icon,
  Database01Icon,
  DiscordIcon,
  FileSearchIcon,
  Moon02Icon,
  NewTwitterIcon,
  News01Icon,
  SlackIcon,
  TaxesIcon,
  TelegramIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"
import {
  ExchangeBinance,
  ExchangeBybit,
  ExchangeCoinbase,
  ExchangeKraken,
  ExchangeOkx,
  WalletLedger,
  WalletMetamask,
  WalletPhantom,
  WalletTrezor,
  WalletWalletConnect,
} from "@web3icons/react"
import type { ComponentType } from "react"

import { cn } from "@/shared/lib/utils"
import type { BrandLogoId } from "@/shared/types"

type Web3Icon = ComponentType<{ size?: number; variant?: "branded" }>

const WEB3_LOGOS: Partial<Record<BrandLogoId, Web3Icon>> = {
  binance: ExchangeBinance,
  coinbase: ExchangeCoinbase,
  kraken: ExchangeKraken,
  okx: ExchangeOkx,
  bybit: ExchangeBybit,
  metamask: WalletMetamask,
  ledger: WalletLedger,
  trezor: WalletTrezor,
  phantom: WalletPhantom,
  walletconnect: WalletWalletConnect,
}

const GLYPH_LOGOS: Partial<
  Record<BrandLogoId, { icon: HugeiconsIconProps["icon"]; color: string }>
> = {
  tradingview: { icon: ChartLineData01Icon, color: "#2962FF" },
  coingecko: { icon: BitcoinCircleIcon, color: "#8DC63F" },
  glassnode: { icon: Analytics01Icon, color: "currentColor" },
  defillama: { icon: Database01Icon, color: "#2F80ED" },
  messari: { icon: FileSearchIcon, color: "currentColor" },
  cryptopanic: { icon: News01Icon, color: "#E7543C" },
  x: { icon: NewTwitterIcon, color: "currentColor" },
  lunarcrush: { icon: Moon02Icon, color: "#7C5CFF" },
  telegram: { icon: TelegramIcon, color: "#26A5E4" },
  discord: { icon: DiscordIcon, color: "#5865F2" },
  slack: { icon: SlackIcon, color: "#E01E5A" },
  webhooks: { icon: WebhookIcon, color: "var(--primary)" },
  koinly: { icon: TaxesIcon, color: "#1FB57A" },
  cointracker: { icon: BitcoinReceiptIcon, color: "#3A6FF8" },
}

export function BrandLogo({
  logo,
  className,
}: {
  logo: BrandLogoId
  className?: string
}) {
  const Web3Logo = WEB3_LOGOS[logo]
  const glyph = GLYPH_LOGOS[logo]

  if (logo === "raxon") {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-10 shrink-0 items-center justify-center bg-primary",
          className
        )}
      >
        <span className="flex w-[38%] flex-col items-end gap-[8%]">
          <span className="aspect-[4/1] w-full bg-primary-foreground" />
          <span className="aspect-[4/1] w-full bg-primary-foreground" />
          <span className="aspect-[8/3] w-2/3 bg-primary-foreground" />
        </span>
      </span>
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center bg-muted text-foreground shadow-(--icon-surface-shadow)",
        className
      )}
    >
      {Web3Logo ? (
        <Web3Logo size={24} variant="branded" />
      ) : glyph ? (
        <HugeiconsIcon color={glyph.color} icon={glyph.icon} size={20} />
      ) : null}
    </span>
  )
}
