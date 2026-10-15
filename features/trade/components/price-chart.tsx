"use client"

import {
  Candlestick,
  CandlestickChart,
  ChartTooltip,
  Grid,
  YAxis,
} from "@/shared/charts/bklit"
import type { Candle } from "@/shared/charts/lib/candles"

import {
  CandleTooltip,
  MovingAverages,
  VolumeBars,
} from "@/features/trade/components/chart-layers"

const VOLUME_HEIGHT = 48
const CHART_MARGIN = {
  top: 12,
  right: 64,
  bottom: VOLUME_HEIGHT + 12,
  left: 0,
}

const axisFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type PriceChartProps = {
  candles: Candle[]
  showIndicators: boolean
  showGrid: boolean

  revealSignature: string
}

export const PriceChart = ({
  candles,
  showIndicators,
  showGrid,
  revealSignature,
}: PriceChartProps) => (
  <CandlestickChart
    aspectRatio="auto"
    candleGap={0.35}
    className="h-full animate-in duration-500 fade-in"
    data={candles}
    margin={CHART_MARGIN}
    revealSignature={revealSignature}
  >
    {showGrid && (
      <Grid
        horizontal
        vertical
        fadeHorizontal={false}
        numTicksColumns={8}
        numTicksRows={6}
        stroke="var(--chart-day-separator)"
        strokeDasharray="0"
      />
    )}
    <VolumeBars height={VOLUME_HEIGHT} />
    <Candlestick
      animate={false}
      negativeFill="var(--chart-candle-down)"
      positiveFill="var(--chart-candle-up)"
    />
    {showIndicators && <MovingAverages />}
    <YAxis
      formatValue={(value) => axisFormatter.format(value)}
      numTicks={6}
      orientation="right"
    />
    <ChartTooltip
      content={({ point }) => <CandleTooltip candle={point as Candle} />}
      indicatorDasharray="4 4"
      showDatePill={false}
      showDots={false}
    />
  </CandlestickChart>
)
