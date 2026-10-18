import { createKeys, withKeys } from "@/shared/lib/keys"
import {
  MARKET_LEADER_COLORS,
  MARKET_LEADER_PERIODS,
  PORTFOLIO_ACTION_CLASS,
  PORTFOLIO_HEADER_CLASS,
  PORTFOLIO_RANGES,
  TRANSACTION_RANGES,
  TRANSACTIONS_ACTION_CLASS,
} from "@/features/dashboard/constants"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import {
  ListCardSkeleton,
  SparklineSkeleton,
  TabsSkeleton,
} from "@/shared/components/molecules/skeleton-parts"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/shared/lib/utils"

import { KpiGrid } from "../components/kpi-cards"

export const PORTFOLIO_CHART_CLASS = "h-72"

export const BALANCE_LAYOUT = {
  card: "gap-3",
  content: "flex flex-col gap-3",
  summary: "flex flex-col gap-1.5 border-b border-border pb-3",
  actions: "grid grid-cols-2 gap-2",
  action: "h-10",
} as const

const PORTFOLIO_SEGMENTS = 7
const KPI_COUNT = 4
const TRANSACTION_ROWS = 5

const LEADER_SHARES = [44, 32, 24]

export const KpiCardsSkeleton = () => (
  <KpiGrid>
    {createKeys(KPI_COUNT).map((key) => (
      <Card key={key} className="gap-3">
        <CardHeader className="gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-14" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-8 w-36" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </KpiGrid>
)

export const MarketLeadersSkeleton = () => {
  return (
    <Card>
      <CardHeader className="items-center">
        <Skeleton className="h-6 w-36" />
        <CardAction>
          <TabsSkeleton count={MARKET_LEADER_PERIODS.length} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1">
            {withKeys(LEADER_SHARES, "leader").map(({ key, value: share }) => (
              <div
                key={key}
                className="flex flex-col gap-2 pt-1"
                style={{ flexGrow: share, flexBasis: 0 }}
              >
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-7" />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
        <ul className="flex flex-1 flex-col">
          {MARKET_LEADER_COLORS.map((color) => (
            <li
              key={color}
              className="flex flex-1 flex-col justify-center gap-2 border-b border-border py-2 first:pt-0 last:border-b-0 last:pb-0"
            >
              <Skeleton className="h-3 w-20" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-3 w-24" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const PortfolioChartSkeleton = () => (
  <div className={cn(PORTFOLIO_CHART_CLASS, "flex flex-col gap-3 pt-14")}>
    <Skeleton className="flex-1" />
    <div className="flex gap-3">
      {createKeys(PORTFOLIO_SEGMENTS, "segment").map((key) => (
        <div key={key} className="flex flex-1 flex-col items-center gap-3">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  </div>
)

export const PortfolioValueSkeleton = () => (
  <Card>
    <CardHeader className={cn("gap-2", PORTFOLIO_HEADER_CLASS)}>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-56 max-w-full" />
      <Skeleton className="h-4 w-40" />
      <CardAction className={PORTFOLIO_ACTION_CLASS}>
        <TabsSkeleton count={PORTFOLIO_RANGES.length} />
      </CardAction>
    </CardHeader>
    <CardContent>
      <PortfolioChartSkeleton />
    </CardContent>
  </Card>
)

export const RecentTransactionsSkeleton = () => (
  <Card>
    <CardHeader className="items-center gap-x-3 has-data-[slot=card-action]:grid-cols-[auto_1fr_auto]">
      <Skeleton className="row-span-2 size-9" />
      <Skeleton className="h-5 w-44" />
      <Skeleton className="h-3 w-52" />
      <CardAction className={TRANSACTIONS_ACTION_CLASS}>
        <Skeleton className="h-9 w-full sm:w-auto sm:flex-1 lg:h-10 lg:w-56 lg:flex-none" />
        <TabsSkeleton count={TRANSACTION_RANGES.length} />
        <Skeleton className="ml-auto h-9 w-20 lg:h-10" />
      </CardAction>
    </CardHeader>
    <CardContent>
      <div className="border border-border">
        <div className="flex h-10 items-center gap-6 border-b border-border bg-accent px-4">
          <Skeleton className="size-4" />
          <Skeleton className="h-3.5 flex-1" />
        </div>
        {createKeys(TRANSACTION_ROWS).map((key) => (
          <div
            key={key}
            className="flex h-14 items-center gap-6 border-b border-border px-4 last:border-b-0"
          >
            <Skeleton className="size-4 shrink-0" />
            <div className="flex w-40 items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <SparklineSkeleton className="mx-auto" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const MyBalanceSkeleton = () => (
  <Card className={BALANCE_LAYOUT.card}>
    <CardHeader className="items-center">
      <Skeleton className="h-5 w-28" />
      <CardAction>
        <Skeleton className="h-7 w-28" />
      </CardAction>
    </CardHeader>
    <CardContent className={BALANCE_LAYOUT.content}>
      <div className={BALANCE_LAYOUT.summary}>
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className={BALANCE_LAYOUT.actions}>
        {createKeys(4).map((key) => (
          <Skeleton key={key} className={BALANCE_LAYOUT.action} />
        ))}
      </div>
    </CardContent>
  </Card>
)

export const TopAssetsSkeleton = () => (
  <ListCardSkeleton columns={3} rows={5} leading="avatar" separators />
)

export const TopGainersSkeleton = ({ className }: { className?: string }) => (
  <ListCardSkeleton
    className={className}
    columns={4}
    rows={4}
    leading="glyph"
    separators
  />
)
