"use client"

import { curveMonotoneX } from "@visx/curve"
import type { PortfolioHistory } from "@/features/portfolio/helpers/portfolio-history"
import { Area, AreaChart, Grid, YAxis } from "@/shared/charts/bklit"
import { HISTORY_CHART_CLASS } from "@/features/portfolio/views/skeletons"
import {
  HistoryBackdrop,
  HistoryPointTooltip,
} from "@/features/portfolio/components/history-layers"

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

    <YAxis
      formatValue={(value) => kFormatter.format(value + history.baseline)}
      numTicks={5}
    />
    <HistoryPointTooltip />
  </AreaChart>
)
