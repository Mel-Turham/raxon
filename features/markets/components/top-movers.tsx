"use client"

import { useState } from "react"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { PriceFlash } from "@/shared/components/atoms/price-flash"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { FadeSwap } from "@/shared/components/molecules/fade-swap"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { COMPACT_CURRENCY_FORMAT, PRICE_FORMAT } from "@/shared/lib/format"
import { MARKET_MOVER_TABS } from "../constants"
import { liveChangePercent } from "../helpers/markets"
import { useLivePrice } from "../state/live-prices"
import type { MarketMover, MarketMovers, MarketMoverTab } from "../types"
import { MarketCard } from "./market-card"

const MoverRow = ({ mover }: { mover: MarketMover }) => {
  const live = useLivePrice(mover.symbol, mover.price)

  return (
    <li className="flex min-h-12 flex-1 items-center gap-3 border-b border-border/60 last:border-b-0">
      <TokenAvatar className="size-7" symbol={mover.symbol} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">{mover.symbol}</span>
        <span className="truncate text-[11px] text-muted-foreground">
          Vol{" "}
          <AnimatedNumber
            format={COMPACT_CURRENCY_FORMAT}
            value={mover.volume}
          />
        </span>
      </div>
      <PriceFlash delta={live.delta} flashKey={live.tick}>
        <AnimatedNumber
          className="font-mono text-sm tabular-nums"
          format={PRICE_FORMAT}
          value={live.price}
        />
      </PriceFlash>
      <ChangePill
        className="w-18 justify-end"
        value={liveChangePercent(mover.changePercent, live.factor)}
      />
    </li>
  )
}

export const TopMovers = ({ movers }: { movers: MarketMovers }) => {
  const [tab, setTab] = useState<MarketMoverTab>("Active")

  return (
    <MarketCard contentClassName="gap-2" title="Top Movers">
      <SegmentedTabs
        onValueChange={setTab}
        options={MARKET_MOVER_TABS}
        value={tab}
      />
      <FadeSwap className="flex flex-1 flex-col" swapKey={tab}>
        <ul className="flex flex-1 flex-col">
          {movers[tab].map((mover) => (
            <MoverRow key={mover.symbol} mover={mover} />
          ))}
        </ul>
      </FadeSwap>
    </MarketCard>
  )
}
