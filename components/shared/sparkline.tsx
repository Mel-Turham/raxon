"use client"

import { useMemo } from "react"
import { curveLinear } from "@visx/curve"

import { Area, AreaChart } from "@/components/charts/area-chart"
import { toChartPoints } from "@/lib/chart-series"
import { randomWalk } from "@/lib/random"
import { cn } from "@/lib/utils"

import { SPARKLINE_CLASS } from "./skeleton-parts"

const POINTS = 32
const HOUR = 3_600_000
const SPARKLINE_MARGIN = { top: 2, right: 0, bottom: 2, left: 0 }

type SparklineProps = {
  seed: string
  /** Direction of the line; also picks the color unless `color` is set. */
  trend: number
  /** Stroke color token, e.g. "var(--primary)". */
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
