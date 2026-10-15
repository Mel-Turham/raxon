import type { ReactNode } from "react"

import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SparklineSkeleton,
  TabsSkeleton,
} from "@/shared/components/molecules/skeleton-parts"
import { createKeys } from "@/shared/lib/keys"
import { cn } from "@/shared/lib/utils"
import {
  MARKET_INSIGHT_SEGMENTS,
  MARKET_MOVER_TABS,
  MARKET_ROW_LIMIT,
  MARKET_STAT_IDS,
  SECTOR_PERIODS,
} from "../constants"

const TICKER_COUNT = 6
const SECTOR_COUNT = 7
const NEWS_COUNT = 4
const STAT_ROW_COUNT = 3

const SkeletonCard = ({
  action,
  children,
  contentClassName,
}: {
  action?: ReactNode
  children: ReactNode
  contentClassName?: string
}) => (
  <Card className="gap-3">
    <CardHeader className="min-h-9 items-center lg:min-h-10">
      <Skeleton className="h-5 w-32" />
      {action && <CardAction>{action}</CardAction>}
    </CardHeader>
    <CardContent className={cn("flex flex-1 flex-col", contentClassName)}>
      {children}
    </CardContent>
  </Card>
)

const RowsSkeleton = ({
  rows = MARKET_ROW_LIMIT,
  columns,
  avatar = true,
  rowClassName = "min-h-12",
}: {
  rows?: number
  columns: number
  avatar?: boolean
  rowClassName?: string
}) => (
  <div className="flex flex-1 flex-col">
    {createKeys(rows, "row").map((rowKey) => (
      <div
        className={cn(
          "flex flex-1 items-center justify-between gap-4 border-b border-border/60 last:border-b-0",
          rowClassName
        )}
        key={rowKey}
      >
        <div className="flex items-center gap-2.5">
          {avatar && <Skeleton className="size-7 rounded-full" />}
          <Skeleton className="h-4 w-24" />
        </div>
        {createKeys(columns - 1, "cell").map((cellKey) => (
          <Skeleton className="h-3.5 w-14" key={cellKey} />
        ))}
      </div>
    ))}
  </div>
)

export const TickerStripSkeleton = () => (
  <Card className="flex-row gap-0 overflow-hidden py-0">
    {createKeys(TICKER_COUNT, "ticker").map((key) => (
      <div
        className="flex min-w-44 flex-1 items-center gap-3 border-r border-border px-4 py-3 last:border-r-0"
        key={key}
      >
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    ))}
  </Card>
)

export const TopMoversSkeleton = () => (
  <SkeletonCard contentClassName="gap-2">
    <TabsSkeleton count={MARKET_MOVER_TABS.length} />
    <RowsSkeleton columns={3} />
  </SkeletonCard>
)

export const SectorPerformanceSkeleton = () => (
  <SkeletonCard action={<TabsSkeleton count={SECTOR_PERIODS.length} />}>
    <RowsSkeleton columns={3} rows={SECTOR_COUNT} />
  </SkeletonCard>
)

export const MarketNewsSkeleton = () => (
  <SkeletonCard action={<Skeleton className="h-7 w-28" />}>
    {createKeys(NEWS_COUNT, "news").map((key) => (
      <div
        className="flex flex-1 flex-col justify-center gap-1.5 border-b border-border/60 py-2.5 first:pt-0 last:border-b-0 last:pb-0"
        key={key}
      >
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    ))}
  </SkeletonCard>
)

export const MarketInsightsSkeleton = () => (
  <SkeletonCard contentClassName="gap-2">
    <TabsSkeleton count={MARKET_INSIGHT_SEGMENTS.length} />
    <Skeleton className="mt-2 h-3 w-full" />
    <RowsSkeleton columns={8} />
  </SkeletonCard>
)

export const MarketSentimentSkeleton = () => (
  <SkeletonCard action={<Skeleton className="h-3 w-24" />}>
    <RowsSkeleton columns={3} rowClassName="min-h-14" />
  </SkeletonCard>
)

export const MarketStatsSkeleton = () => (
  <>
    {MARKET_STAT_IDS.map((id) => (
      <SkeletonCard contentClassName="gap-3" key={id}>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <SparklineSkeleton className="h-12 w-28" />
        </div>
        <RowsSkeleton
          avatar={false}
          columns={2}
          rowClassName="min-h-9"
          rows={STAT_ROW_COUNT}
        />
      </SkeletonCard>
    ))}
  </>
)
