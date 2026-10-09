"use client"

import { curveLinear } from "@visx/curve"

import { Area, AreaChart } from "@/components/charts/area-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import type { PortfolioRange } from "@/constants"
import type { PortfolioPoint, PortfolioSegment } from "@/lib/portfolio-series"
import { cn } from "@/lib/utils"

import {
  PortfolioChartBackground,
  PortfolioChartCursor,
} from "./portfolio-chart-overlay"
import { PortfolioTooltip } from "./portfolio-tooltip"
import { PORTFOLIO_CHART_CLASS } from "./skeletons"

const CHART_MARGIN = { top: 56, right: 0, bottom: 52, left: 0 }

// Theme-aware: see --chart-tooltip-shadow in globals.css.
const TOOLTIP_PANEL_STYLE = { boxShadow: "var(--chart-tooltip-shadow)" }

type PortfolioChartProps = {
  range: PortfolioRange
  data: PortfolioPoint[]
  segments: PortfolioSegment[]
}

export const PortfolioChart = ({
  range,
  data,
  segments,
}: PortfolioChartProps) => {
  return (
    <AreaChart
      aspectRatio="auto"
      className={cn(PORTFOLIO_CHART_CLASS, "chart-line-glow")}
      data={data}
      margin={CHART_MARGIN}
      revealSignature={range}
    >
      <PortfolioChartBackground segments={segments} />
      <Area
        curve={curveLinear}
        dataKey="plot"
        fillOpacity={0}
        showHighlight={false}
        stroke="var(--chart-1)"
        strokeWidth={1.5}
      />
      <PortfolioChartCursor segments={segments} />
      <ChartTooltip
        content={({ point, index }) => (
          <PortfolioTooltip
            first={data[0]}
            point={point as PortfolioPoint}
            previous={data[Math.max(0, index - 1)]}
          />
        )}
        panelStyle={TOOLTIP_PANEL_STYLE}
        showCrosshair={false}
        showDatePill={false}
        showDots={false}
      />
    </AreaChart>
  )
}
