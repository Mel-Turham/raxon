"use client"

import { useState } from "react"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { COMPACT_CURRENCY_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { SECTOR_PERIODS } from "../constants"
import type { SectorPerformance as Sector, SectorPeriod } from "../types"
import { MarketCard } from "./market-card"

const PERIOD_KEY = { "24h": "change24h", "30d": "change30d" } as const

export const SectorPerformance = ({ sectors }: { sectors: Sector[] }) => {
  const [period, setPeriod] = useState<SectorPeriod>("24h")
  const changeOf = (sector: Sector) => sector[PERIOD_KEY[period]]
  const ranked = [...sectors].sort((a, b) => changeOf(b) - changeOf(a))
  const maxChange = Math.max(
    ...sectors.map((sector) => Math.abs(changeOf(sector)))
  )

  return (
    <MarketCard
      action={
        <SegmentedTabs
          onValueChange={setPeriod}
          options={SECTOR_PERIODS}
          value={period}
        />
      }
      title="Top Performance"
    >
      <ul className="flex flex-1 flex-col">
        {ranked.map((sector) => {
          const change = changeOf(sector)
          return (
            <li
              className="grid min-h-12 flex-1 grid-cols-[minmax(0,1fr)_4.5rem_5rem] items-center gap-3 border-b border-border/60 last:border-b-0"
              key={sector.id}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex shrink-0 -space-x-1.5">
                  {sector.leaders.map((symbol) => (
                    <TokenAvatar
                      className="size-5 text-[7px] ring-2 ring-card [&_svg]:size-3"
                      key={symbol}
                      symbol={symbol}
                    />
                  ))}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm">{sector.name}</span>
                  <AnimatedNumber
                    className="text-[11px] text-muted-foreground"
                    format={COMPACT_CURRENCY_FORMAT}
                    value={sector.marketCap}
                  />
                </div>
              </div>
              <span className="h-1.5 bg-muted">
                <span
                  className={cn(
                    "block h-full transition-[width] duration-500 ease-out",
                    change >= 0 ? "bg-success" : "bg-destructive"
                  )}
                  style={{ width: `${(Math.abs(change) / maxChange) * 100}%` }}
                />
              </span>
              <TrendBadge className="justify-end" digits={2} value={change} />
            </li>
          )
        })}
      </ul>
    </MarketCard>
  )
}
