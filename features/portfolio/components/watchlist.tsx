"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { WatchlistItem } from "@/features/portfolio/types"
import { CURRENCY_FORMAT } from "@/shared/lib/format"

const WatchlistTicker = ({ item }: { item: WatchlistItem }) => (
  <div className="flex items-center gap-2.5">
    <TokenAvatar symbol={item.base} className="size-9" />
    <div className="flex flex-col leading-tight">
      <span className="text-[11px] text-muted-foreground">{item.pair}</span>
      <span className="flex items-center gap-2">
        <AnimatedNumber
          className="font-mono text-sm font-medium tabular-nums"
          format={CURRENCY_FORMAT}
          value={item.price}
        />
        <TrendBadge digits={2} icon="trending" value={item.change} />
      </span>
    </div>
  </div>
)

type WatchlistProps = {
  items: WatchlistItem[]
  candidates: WatchlistItem[]
}

export const Watchlist = ({ items, candidates }: WatchlistProps) => {
  const [watched, setWatched] = useState(items)
  const available = candidates.filter(
    (candidate) => !watched.some((item) => item.pair === candidate.pair)
  )

  return (
    <div className="flex flex-wrap items-center gap-6">
      {watched.map((item) => (
        <WatchlistTicker key={item.pair} item={item} />
      ))}
      {available.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Add a pair to the watchlist"
            className="flex size-9 items-center justify-center border border-border text-foreground/90 transition-colors outline-none hover:bg-foreground/[0.04]"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Add to watchlist</DropdownMenuLabel>
              {available.map((candidate) => (
                <DropdownMenuItem
                  key={candidate.pair}
                  onClick={() => setWatched((list) => [...list, candidate])}
                >
                  <TokenAvatar symbol={candidate.base} className="size-5" />
                  {candidate.pair}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
