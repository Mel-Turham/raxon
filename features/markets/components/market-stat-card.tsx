import type { ComponentProps } from "react"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { LazySparkline } from "@/shared/components/atoms/lazy-sparkline"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import {
  COMPACT_CURRENCY_FORMAT,
  decimalFormat,
  ONE_DECIMAL_FORMAT,
} from "@/shared/lib/format"
import { fearGreedLabel } from "../helpers/markets"
import type { MarketStat, MarketStatId } from "../types"
import { MarketCard } from "./market-card"

const STAT_FORMAT: Record<
  MarketStatId,
  Pick<ComponentProps<typeof AnimatedNumber>, "format" | "suffix">
> = {
  "market-cap": { format: COMPACT_CURRENCY_FORMAT },
  volume: { format: COMPACT_CURRENCY_FORMAT },
  "btc-dominance": { format: ONE_DECIMAL_FORMAT, suffix: "%" },
  "fear-greed": { format: decimalFormat(0) },
}

export const MarketStatCard = ({ stat }: { stat: MarketStat }) => {
  const { format, suffix } = STAT_FORMAT[stat.id]
  const isFearGreed = stat.id === "fear-greed"

  return (
    <MarketCard contentClassName="gap-3" title={stat.label}>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <AnimatedNumber
            className="font-mono text-2xl font-medium tracking-tight tabular-nums"
            format={format}
            suffix={suffix}
            value={stat.value}
          />
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <TrendBadge digits={2} value={stat.change} />
            {isFearGreed ? fearGreedLabel(stat.value) : "24h"}
          </span>
        </div>
        <LazySparkline
          className="h-12 w-28"
          seed={stat.id}
          trend={stat.change}
        />
      </div>
      <ul className="flex flex-1 flex-col">
        {stat.rows.map((row) => (
          <li
            className="flex min-h-9 flex-1 items-center justify-between gap-3 border-b border-border/60 text-xs last:border-b-0"
            key={row.label}
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="flex items-center gap-2">
              <AnimatedNumber
                className="font-mono tabular-nums"
                format={format}
                suffix={suffix}
                value={row.value}
              />
              {isFearGreed ? (
                <span className="w-20 text-right text-[11px] text-muted-foreground">
                  {fearGreedLabel(row.value)}
                </span>
              ) : (
                <TrendBadge
                  className="w-14 justify-end"
                  digits={2}
                  value={row.change}
                />
              )}
            </span>
          </li>
        ))}
      </ul>
    </MarketCard>
  )
}
