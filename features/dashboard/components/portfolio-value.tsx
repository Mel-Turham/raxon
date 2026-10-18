"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PORTFOLIO_ACTION_CLASS,
  PORTFOLIO_DEFAULT_RANGE,
  PORTFOLIO_HEADER_CLASS,
  PORTFOLIO_RANGES,
  type PortfolioRange,
} from "@/features/dashboard/constants"
import { buildPortfolioSeries } from "@/features/dashboard/helpers/portfolio-series"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import { dashboardQueries } from "../api/queries"
import { cn } from "@/shared/lib/utils"
import { PortfolioChartSkeleton } from "../views/skeletons"

const PortfolioChart = dynamic(
  () => import("./portfolio-chart").then((mod) => mod.PortfolioChart),
  { ssr: false, loading: () => <PortfolioChartSkeleton /> }
)

export const PortfolioValue = () => {
  const [range, setRange] = useState<PortfolioRange>(PORTFOLIO_DEFAULT_RANGE)
  const {
    data: points,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...dashboardQueries.portfolio(range),
    placeholderData: keepPreviousData,
  })
  const series = useMemo(
    () => buildPortfolioSeries(range, points ?? []),
    [range, points]
  )
  const { summary } = series

  return (
    <Card>
      <CardHeader className={PORTFOLIO_HEADER_CLASS}>
        <CardDescription>Portfolio Value</CardDescription>
        <CardTitle className="font-mono text-2xl font-normal tabular-nums sm:text-3xl">
          <AnimatedNumber value={summary.value} />
        </CardTitle>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendBadge value={summary.change} />
          {summary.comparison}
        </span>
        <CardAction className={PORTFOLIO_ACTION_CLASS}>
          <SegmentedTabs
            className="max-sm:w-full"
            listClassName="max-sm:w-full"
            options={PORTFOLIO_RANGES}
            value={range}
            onValueChange={setRange}
          />
        </CardAction>
      </CardHeader>

      <CardContent
        className={cn("transition-opacity", isPlaceholderData && "opacity-60")}
      >
        {series.data.length > 1 ? (
          <PortfolioChart
            data={series.data}
            range={range}
            segments={series.segments}
          />
        ) : isPending ? (
          <PortfolioChartSkeleton />
        ) : (
          <p className="flex min-h-60 flex-1 items-center justify-center text-sm text-muted-foreground">
            No holdings yet. Deposit funds to start tracking your portfolio.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
