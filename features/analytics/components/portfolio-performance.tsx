"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ANALYTICS_RANGE_LABELS } from "@/features/analytics/constants"
import {
  SIGNED_CURRENCY,
  formatCurrency,
  formatSignedCurrency,
} from "@/features/analytics/helpers/format"
import type {
  AnalyticsRange,
  PortfolioPerformanceData,
} from "@/features/analytics/types"
import {
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
  Grid,
} from "@/shared/charts/bklit"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { CURRENCY_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { LOSS_COLOR } from "@/features/analytics/constants"

const CHART_MARGIN = { top: 14, right: 8, bottom: 36, left: 8 }
const GAIN_COLOR = "var(--chart-1)"

const changeColor = (value: unknown) =>
  Number(value) >= 0 ? GAIN_COLOR : LOSS_COLOR

type PortfolioPerformanceProps = {
  performance: PortfolioPerformanceData
  range: AnalyticsRange
}

export function PortfolioPerformance({
  performance,
  range,
}: PortfolioPerformanceProps) {
  const { intervals, endValue, change, changePercent } = performance

  return (
    <Card className="min-w-0 gap-0">
      <CardHeader className="gap-2 pb-3">
        <div>
          <CardTitle className="text-base">Portfolio performance</CardTitle>
          <CardDescription>
            Value change by interval · {ANALYTICS_RANGE_LABELS[range]}
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <AnimatedNumber
            className="font-mono text-2xl font-medium tabular-nums sm:text-3xl"
            format={CURRENCY_FORMAT}
            value={endValue}
          />
          <div className="flex items-center gap-2">
            <AnimatedNumber
              className={cn(
                "text-xs font-medium",
                change >= 0 ? "text-success" : "text-destructive"
              )}
              format={SIGNED_CURRENCY}
              value={change}
            />
            <ChangePill value={changePercent} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 pt-2">
        <BarChart
          aspectRatio="auto"
          className="h-56 w-full sm:h-64"
          data={intervals}
          margin={CHART_MARGIN}
          revealSignature={range}
          xDataKey="date"
        >
          <Grid
            horizontal
            fadeHorizontal={false}
            highlightRowStroke="var(--chart-foreground-muted)"
            highlightRowValues={[0]}
            numTicksRows={5}
            stroke="var(--chart-grid)"
            strokeDasharray="4 6"
            strokeOpacity={0.7}
          />
          <Bar
            dataKey="change"
            fill={(point) => changeColor(point.change)}
            lineCap={3}
          />
          <BarXAxis maxLabels={6} tickerHalfWidth={30} />
          <ChartTooltip
            rows={(point) => [
              {
                color: changeColor(point.change),
                label: "Interval change",
                value: formatSignedCurrency(Number(point.change)),
              },
              {
                color: "var(--chart-2)",
                label: "Portfolio value",
                value: formatCurrency(Number(point.value)),
              },
            ]}
          />
        </BarChart>
      </CardContent>
    </Card>
  )
}
