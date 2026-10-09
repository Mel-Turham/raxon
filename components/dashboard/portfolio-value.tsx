"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { AnimatedNumber } from "@/components/shared/animated-number"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { TrendBadge } from "@/components/shared/trend-badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PORTFOLIO_DEFAULT_RANGE,
  PORTFOLIO_RANGES,
  type PortfolioRange,
} from "@/constants"
import {
  buildPortfolioSeries,
  type PortfolioSeries,
} from "@/lib/portfolio-series"
import { PortfolioChartSkeleton } from "./skeletons"

// The chart stack (visx + motion) is heavy: load it after first paint.
const PortfolioChart = dynamic(
  () => import("./portfolio-chart").then((mod) => mod.PortfolioChart),
  { ssr: false, loading: () => <PortfolioChartSkeleton /> }
)

type PortfolioValueProps = {
  /** Series of the default range, fetched on the server. */
  initialSeries: PortfolioSeries
}

export const PortfolioValue = ({ initialSeries }: PortfolioValueProps) => {
  const [range, setRange] = useState<PortfolioRange>(PORTFOLIO_DEFAULT_RANGE)
  const series = useMemo(
    () =>
      range === PORTFOLIO_DEFAULT_RANGE
        ? initialSeries
        : buildPortfolioSeries(range),
    [range, initialSeries]
  )
  const { summary } = series

  return (
    <Card>
      <CardHeader>
        <CardDescription>Portfolio Value</CardDescription>
        <CardTitle className="font-mono text-3xl font-normal tabular-nums">
          <AnimatedNumber value={summary.value} />
        </CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendBadge value={summary.change} />
          {summary.comparison}
        </span>
        <CardAction>
          <SegmentedTabs
            options={PORTFOLIO_RANGES}
            value={range}
            onValueChange={setRange}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
        <PortfolioChart
          data={series.data}
          range={range}
          segments={series.segments}
        />
      </CardContent>
    </Card>
  )
}
