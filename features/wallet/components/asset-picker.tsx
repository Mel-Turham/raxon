"use client"

import { type ReactNode, useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { SharedElement } from "@/shared/components/molecules/step-transition"
import { POPULAR_ASSETS } from "../constants"
import type { WalletAsset } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"

const AMOUNT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 })
const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

type AssetPickerProps = {
  assets: WalletAsset[]
  label: string
  trailing?: ReactNode
  onSelect: (asset: WalletAsset) => void
}

export function AssetPicker({
  assets,
  label,
  trailing,
  onSelect,
}: AssetPickerProps) {
  const [query, setQuery] = useState("")
  const popular = assets.filter((asset) =>
    POPULAR_ASSETS.some((symbol) => symbol === asset.symbol)
  )

  return (
    <Command
      items={assets}
      itemToStringValue={(asset) => `${asset.name} ${asset.symbol}`}
      onValueChange={setQuery}
      value={query}
    >
      <CommandInput
        aria-label={label}
        autoFocus
        placeholder="Search asset…"
        trailing={trailing}
      />
      {!query && popular.length > 0 && (
        <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-3">
          <span className="text-[11px] text-muted-foreground">Popular</span>
          {popular.map((asset) => (
            <button
              className="flex h-7 items-center gap-1.5 bg-muted pr-2.5 pl-1.5 text-xs shadow-(--icon-surface-shadow) transition-colors hover:bg-muted/70"
              key={asset.symbol}
              onClick={() => onSelect(asset)}
              type="button"
            >
              <TokenAvatar className="size-5" symbol={asset.symbol} />
              {asset.symbol}
            </button>
          ))}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!query && (
          <CommandGroupLabel className="px-4 pb-0">
            All assets
          </CommandGroupLabel>
        )}
        <CommandEmpty>No asset matches “{query}”</CommandEmpty>
        <CommandList className="divide-y divide-foreground/8">
          {(asset: WalletAsset) => (
            <CommandItem
              key={asset.symbol}
              onClick={() => onSelect(asset)}
              value={asset}
            >
              <SharedElement id={`token:${asset.symbol}`}>
                <TokenAvatar className="size-8" symbol={asset.symbol} />
              </SharedElement>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-foreground">
                  {asset.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {asset.symbol}
                </span>
              </span>
              <span className="flex flex-col items-end font-mono text-xs tabular-nums">
                <span className="text-foreground">
                  {AMOUNT.format(asset.balance)}
                </span>
                <span className="text-muted-foreground">
                  {USD.format(asset.balance * asset.price)}
                </span>
              </span>
            </CommandItem>
          )}
        </CommandList>
      </div>
      <DialogHints
        hints={[
          { keys: ["↑", "↓"], label: "Navigate" },
          { keys: ["↵"], label: "Select" },
        ]}
      />
    </Command>
  )
}
