"use client"

import {
  ArrowLeft02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import type { AssetNetwork, WalletAsset } from "../types"
import { DialogHints } from "@/shared/components/molecules/dialog-hints"

type NetworkStepProps = {
  asset: WalletAsset
  note: string
  renderMeta: (network: AssetNetwork) => ReactNode
  onBack: () => void
  onSelect: (network: AssetNetwork) => void
}

export function NetworkStep({
  asset,
  note,
  renderMeta,
  onBack,
  onSelect,
}: NetworkStepProps) {
  const [query, setQuery] = useState("")

  return (
    <Command
      items={asset.networks}
      itemToStringValue={(network) =>
        `${network.name} ${network.standard ?? ""}`
      }
      onValueChange={setQuery}
      value={query}
    >
      <CommandInput
        aria-label={`Search network for ${asset.symbol}`}
        autoFocus
        leading={
          <Button
            aria-label="Back to assets"
            className="-ml-1.5 text-muted-foreground"
            onClick={onBack}
            size="icon-sm"
            variant="ghost"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          </Button>
        }
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !query) onBack()
        }}
        placeholder={`Select network for ${asset.symbol}…`}
        trailing={<Kbd>Esc</Kbd>}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CommandEmpty>No network matches “{query}”</CommandEmpty>
        <CommandList className="divide-y divide-foreground/8">
          {(network: AssetNetwork) => (
            <CommandItem
              key={network.id}
              onClick={() => onSelect(network)}
              value={network}
            >
              <TokenAvatar className="size-8" symbol={network.nativeSymbol} />
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate font-medium text-foreground">
                  {network.name}
                </span>
                {network.standard && (
                  <span className="bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {network.standard}
                  </span>
                )}
              </span>
              <span className="flex flex-col items-end text-xs">
                {renderMeta(network)}
              </span>
            </CommandItem>
          )}
        </CommandList>
      </div>
      <p className="flex items-center gap-2 border-t border-foreground/10 px-4 py-3 text-xs text-muted-foreground">
        <HugeiconsIcon
          className="shrink-0 text-primary"
          icon={InformationCircleIcon}
          size={15}
        />
        {note}
      </p>
      <DialogHints
        hints={[
          { keys: ["↑", "↓"], label: "Navigate" },
          { keys: ["↵"], label: "Select" },
          { keys: ["⌫"], label: "Back" },
        ]}
      />
    </Command>
  )
}
