"use client"

import { useMemo, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AllocationItem } from "@/features/analytics/types"
import { Ring, RingCenter, RingChart } from "@/shared/charts/bklit"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { CURRENCY_FORMAT, ONE_DECIMAL_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

const RING_CENTER_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const

type AssetAllocationProps = {
  allocation: AllocationItem[]
}

export function AssetAllocation({ allocation }: AssetAllocationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const totalValue = allocation.reduce((total, asset) => total + asset.value, 0)
  const ringData = useMemo(
    () =>
      allocation.map((asset) => ({
        label: asset.name,
        value: asset.value,
        maxValue: totalValue,
        color: asset.color,
      })),
    [allocation, totalValue]
  )

  return (
    <Card className="@container min-w-0 gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Asset allocation</CardTitle>
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col items-center gap-5 @md:flex-row @md:justify-between @md:gap-4">
        <div className="w-full max-w-64 shrink-0 @md:w-[44%] @md:max-w-none">
          <RingChart
            baseInnerRadius={54}
            className="mx-auto"
            data={ringData}
            hoveredIndex={hoveredIndex}
            onHoverChange={setHoveredIndex}
            ringGap={5}
            strokeWidth={13}
          >
            {allocation.map((asset, index) => (
              <Ring
                key={asset.symbol ?? asset.name}
                color={asset.color}
                index={index}
                showGlow={hoveredIndex === index}
              />
            ))}
            <RingCenter
              defaultLabel="Total value"
              formatOptions={RING_CENTER_FORMAT}
              prefix="$"
              valueClassName="max-w-full text-[clamp(0.625rem,15cqw,0.875rem)] font-semibold leading-tight tabular-nums"
              labelClassName="max-w-full text-[clamp(0.625rem,8cqw,0.75rem)] leading-tight"
            />
          </RingChart>
        </div>

        <ul className="w-full min-w-0 divide-y divide-border/70 @md:w-auto @md:flex-1">
          {allocation.map((asset, index) => {
            const active = hoveredIndex === index
            return (
              <li key={asset.symbol ?? asset.name}>
                <button
                  aria-pressed={active}
                  className={cn(
                    "flex w-full items-center gap-2 p-3 text-left transition-colors @md:gap-2.5",
                    active ? "bg-muted/70" : "hover:bg-muted/45"
                  )}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(active ? null : index)}
                  onFocus={() => setHoveredIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  type="button"
                >
                  {asset.symbol ? (
                    <TokenAvatar symbol={asset.symbol} className="size-9" />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
                      ···
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    {asset.name}
                  </span>
                  <AnimatedNumber
                    className="w-11 shrink-0 text-right text-xs text-muted-foreground tabular-nums"
                    format={ONE_DECIMAL_FORMAT}
                    suffix="%"
                    value={asset.percentage}
                  />
                  <AnimatedNumber
                    className="w-19 shrink-0 text-right font-mono text-xs tabular-nums"
                    format={CURRENCY_FORMAT}
                    value={asset.value}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
