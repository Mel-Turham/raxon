"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { AMOUNT_PRESETS } from "../constants"
import type { WalletAsset } from "../types"

type AssetChipProps = {
  asset: WalletAsset
  label: string
  onClick: () => void
}

export const AssetChip = ({ asset, label, onClick }: AssetChipProps) => (
  <button
    aria-label={label}
    className="flex h-7 shrink-0 items-center gap-1.5 bg-muted pr-2 pl-1.5 text-xs font-medium shadow-(--icon-surface-shadow) transition-colors hover:bg-muted/70"
    onClick={onClick}
    type="button"
  >
    <SharedElement id={`token:${asset.symbol}`}>
      <TokenAvatar className="size-5" symbol={asset.symbol} />
    </SharedElement>
    {asset.symbol}
    <HugeiconsIcon
      className="text-muted-foreground"
      icon={ArrowDown01Icon}
      size={12}
    />
  </button>
)

type AmountPresetsProps = {
  balance: number
  onSelect: (amount: string) => void
}

export const AmountPresets = ({ balance, onSelect }: AmountPresetsProps) => (
  <div className="flex gap-1.5">
    {AMOUNT_PRESETS.map((share) => (
      <button
        className="h-5 bg-muted px-1.5 text-[10px] text-muted-foreground shadow-(--icon-surface-shadow) transition-colors hover:bg-muted/70 hover:text-foreground"
        key={share}
        onClick={() => onSelect(String(Number((balance * share).toFixed(8))))}
        type="button"
      >
        {share === 1 ? "Max" : `${share * 100}%`}
      </button>
    ))}
  </div>
)
