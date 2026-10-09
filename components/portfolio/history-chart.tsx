"use client"

import { curveMonotoneX } from "@visx/curve"

import { Area, AreaChart } from "@/components/charts/area-chart"
import { Grid } from "@/components/charts/grid"
import { YAxis } from "@/components/charts/y-axis"
import type { PortfolioHistory } from "@/lib/portfolio-history"

import { HistoryBackdrop, HistoryPointTooltip } from "./history-layers"
import { HISTORY_CHART_CLASS } from "./skeletons"

const CHART_MARGIN = { top: 8, right: 8, bottom: 32, left: 44 }

const kFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 0,
})

type HistoryChartProps = {
  history: PortfolioHistory
  revealSignature: string
}

export const HistoryChart = ({
  history,
  revealSignature,
}: HistoryChartProps) => (
  <AreaChart
    aspectRatio="auto"
    // Soft glow under the line (see .chart-line-glow).
    className={`${HISTORY_CHART_CLASS} chart-line-glow flex-1`}
    data={history.data}
    margin={CHART_MARGIN}
    revealSignature={revealSignature}
  >
    <Grid
      horizontal
      fadeHorizontal={false}
      numTicksRows={5}
      stroke="var(--chart-guide)"
      strokeDasharray="5 5"
    />
    <HistoryBackdrop labelFormat={history.labelFormat} />
    <Area
      curve={curveMonotoneX}
      dataKey="plot"
      fill="var(--chart-1)"
      fillOpacity={0.07}
      gradientSpan={0.45}
      showHighlight={false}
      stroke="var(--chart-1)"
      strokeWidth={2}
    />
    {/* Axis shows real values: the series is shifted by `baseline`. */}
    <YAxis
      formatValue={(value) => kFormatter.format(value + history.baseline)}
      numTicks={5}
    />
    <HistoryPointTooltip />
  </AreaChart>
)
