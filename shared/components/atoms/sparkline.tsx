"use client"

import { curveLinear } from "@visx/curve"
import { useMemo } from "react"

import { Area, AreaChart } from "@/shared/charts/bklit"
import { toChartPoints } from "@/shared/charts/lib/chart-series"
import { SPARKLINE_CLASS } from "@/shared/components/molecules/skeleton-parts"
import { randomWalk } from "@/shared/lib/random"
import { cn } from "@/shared/lib/utils"
import { HOUR } from "@/shared/lib/time"

const POINTS = 32
const SPARKLINE_MARGIN = { top: 2, right: 0, bottom: 2, left: 0 }

type SparklineProps = {
  seed: string

  trend: number

  color?: string
  className?: string
}

export const Sparkline = ({
  seed,
  trend,
  color,
  className,
}: SparklineProps) => {
  const data = useMemo(
    () =>
      toChartPoints(
        randomWalk({
          seed,
          length: POINTS,
          start: 100,
          volatility: 18,
          drift: Math.sign(trend) * 0.2,
        }),
        { start: Date.UTC(2026, 5, 27), stepMs: HOUR, bottomPadding: 0 }
      ),
    [seed, trend]
  )

  return (
    <AreaChart
      aspectRatio="auto"
      className={cn(SPARKLINE_CLASS, className)}
      data={data}
      margin={SPARKLINE_MARGIN}
    >
      <Area
        curve={curveLinear}
        dataKey="plot"
        fillOpacity={0}
        showHighlight={false}
        stroke={color ?? (trend >= 0 ? "var(--success)" : "var(--destructive)")}
        strokeWidth={1.5}
      />
    </AreaChart>
  )
}
