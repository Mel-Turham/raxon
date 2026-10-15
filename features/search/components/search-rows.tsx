import { ArrowRight01Icon, Navigation03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { BrandLogo } from "@/shared/components/atoms/logos/brand-logo"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import {
  COMPACT_CURRENCY_FORMAT,
  PRICE_FORMAT,
  signedPercentFormat,
} from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import type { SearchAsset, SearchItem } from "../types"

const CHANGE_FORMAT = signedPercentFormat(2)

const ICON_BOX =
  "flex size-8 shrink-0 items-center justify-center border border-border bg-muted text-muted-foreground"

export const AssetChange = ({ value }: { value: number }) => (
  <AnimatedNumber
    className={cn(
      "font-mono text-xs tabular-nums",
      value >= 0 ? "text-success" : "text-destructive"
    )}
    format={CHANGE_FORMAT}
    suffix="%"
    value={value}
  />
)

const AssetRow = ({ asset }: { asset: SearchAsset }) => (
  <>
    <TokenAvatar className="size-8" symbol={asset.symbol} />
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate font-medium text-foreground">{asset.name}</span>
      <span className="text-xs text-muted-foreground">{asset.symbol}</span>
    </span>
    <span className="hidden w-44 flex-col text-xs text-muted-foreground sm:flex">
      <span>
        Market cap:{" "}
        <AnimatedNumber
          format={COMPACT_CURRENCY_FORMAT}
          value={asset.marketCap}
        />
      </span>
      <span>
        Vol (24h):{" "}
        <AnimatedNumber format={COMPACT_CURRENCY_FORMAT} value={asset.volume} />
      </span>
    </span>
    <span className="flex w-24 flex-col items-end">
      <AnimatedNumber
        className="font-mono text-sm text-foreground tabular-nums"
        format={PRICE_FORMAT}
        value={asset.price}
      />
      <AssetChange value={asset.changePercent} />
    </span>
  </>
)

export const SearchRow = ({ item }: { item: SearchItem }) => {
  switch (item.kind) {
    case "asset":
      return <AssetRow asset={item} />
    case "exchange":
      return (
        <>
          <BrandLogo className="size-8 shadow-none" logo={item.logo} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium text-foreground">
              {item.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {item.description}
            </span>
          </span>
          <span className="text-xs text-muted-foreground">Integration</span>
        </>
      )
    case "page":
      return (
        <>
          <span className={ICON_BOX}>
            <HugeiconsIcon icon={Navigation03Icon} size={15} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-medium text-foreground">
              {item.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {item.href}
            </span>
          </span>
          <HugeiconsIcon
            className="text-muted-foreground"
            icon={ArrowRight01Icon}
            size={16}
          />
        </>
      )
  }
}
