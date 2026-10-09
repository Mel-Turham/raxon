"use client"

import { useState } from "react"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { TrendBadge } from "@/components/shared/trend-badge"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MARKET_LEADER_COLORS,
  MARKET_LEADER_DEFAULT_PERIOD,
  MARKET_LEADER_PERIODS,
  type MarketLeaderPeriod,
} from "@/constants"
import type { MarketLeadersByPeriod } from "@/lib/api/types"

export const MarketLeaders = ({ data }: { data: MarketLeadersByPeriod }) => {
  const [period, setPeriod] = useState<MarketLeaderPeriod>(
    MARKET_LEADER_DEFAULT_PERIOD
  )
  const { from, to, leaders } = data[period]

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="text-base">Market Leaders</CardTitle>
        <CardAction>
          <SegmentedTabs
            options={MARKET_LEADER_PERIODS}
            value={period}
            onValueChange={setPeriod}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/*SHARE BARS*/}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1">
            {leaders.map((leader, index) => (
              <div
                key={leader.name}
                className="flex min-w-0 flex-col"
                style={{ flexGrow: leader.share, flexBasis: 0 }}
              >
                <div className="border-l border-border pt-1 pb-2 pl-1.5">
                  <TrendBadge value={leader.trend} />
                </div>
                <div
                  className="h-7"
                  style={{ backgroundColor: MARKET_LEADER_COLORS[index] }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{from}</span>
            <span>{to}</span>
          </div>
        </div>

        {/*LEADERS LIST*/}
        <ul className="flex flex-1 flex-col">
          {leaders.map((leader, index) => (
            <li
              key={leader.name}
              className="flex flex-1 flex-col justify-center gap-1 border-b border-border py-2 first:pt-0 last:border-b-0 last:pb-0"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: MARKET_LEADER_COLORS[index] }}
                />
                {leader.name}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <AnimatedNumber
                  className="font-mono text-lg tabular-nums"
                  value={leader.value}
                />
                <AnimatedNumber
                  className="font-mono text-[11px] text-muted-foreground tabular-nums"
                  prefix="24h: "
                  value={leader.change24h}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
