"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"

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
import {
  buildPortfolioHistory,
  type PortfolioHistory as PortfolioHistoryData,
} from "@/features/portfolio/helpers/portfolio-history"

import { HistoryChartSkeleton } from "../views/skeletons"

const HistoryChart = dynamic(
  () => import("./history-chart").then((mod) => mod.HistoryChart),
  { ssr: false, loading: () => <HistoryChartSkeleton /> }
)

type PortfolioHistoryProps = {
  initialHistory: PortfolioHistoryData
}

export const PortfolioHistory = ({ initialHistory }: PortfolioHistoryProps) => {
  const [range, setRange] = useState<PortfolioHistoryRange>(
    PORTFOLIO_HISTORY_DEFAULT_RANGE
  )
  const history = useMemo(
    () =>
      range === PORTFOLIO_HISTORY_DEFAULT_RANGE
        ? initialHistory
        : buildPortfolioHistory(range),
    [range, initialHistory]
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
      <CardContent className="flex min-h-72 flex-1 flex-col">
        <HistoryChart history={history} revealSignature={range} />
      </CardContent>
    </Card>
  )
}
