"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"

import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { ChangePill } from "@/shared/components/atoms/change-pill"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PORTFOLIO_HISTORY_DEFAULT_RANGE,
  PORTFOLIO_HISTORY_RANGES,
  type PortfolioHistoryRange,
} from "@/features/portfolio/constants"
import { CURRENCY_FORMAT } from "@/shared/lib/format"
import { buildPortfolioHistory } from "@/features/portfolio/helpers/portfolio-history"
import { cn } from "@/shared/lib/utils"

import { portfolioQueries } from "../api/queries"
import { HistoryChartSkeleton } from "../views/skeletons"

const HistoryChart = dynamic(
  () => import("./history-chart").then((mod) => mod.HistoryChart),
  { ssr: false, loading: () => <HistoryChartSkeleton /> }
)

export const PortfolioHistory = () => {
  const [range, setRange] = useState<PortfolioHistoryRange>(
    PORTFOLIO_HISTORY_DEFAULT_RANGE
  )
  const {
    data: points,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...portfolioQueries.history(range),
    placeholderData: keepPreviousData,
  })
  const history = useMemo(
    () => buildPortfolioHistory(range, points ?? []),
    [range, points]
  )

  return (
    <Card>
      <CardHeader>
        <CardDescription>Your portfolio</CardDescription>
        <CardTitle className="flex items-center gap-3">
          <AnimatedNumber
            className="font-mono text-3xl font-normal tabular-nums"
            format={CURRENCY_FORMAT}
            value={history.summary.value}
          />
          <ChangePill value={history.summary.change} />
        </CardTitle>
        <CardAction>
          <SegmentedTabs
            options={PORTFOLIO_HISTORY_RANGES}
            value={range}
            onValueChange={setRange}
          />
        </CardAction>
      </CardHeader>
      <CardContent
        className={cn(
          "flex min-h-72 flex-1 flex-col transition-opacity",
          isPlaceholderData && "opacity-60"
        )}
      >
        {history.data.length > 1 ? (
          <HistoryChart history={history} revealSignature={range} />
        ) : isPending ? (
          <HistoryChartSkeleton />
        ) : (
          <p className="flex min-h-60 flex-1 items-center justify-center text-sm text-muted-foreground">
            No holdings yet. Deposit funds to start tracking your portfolio.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
