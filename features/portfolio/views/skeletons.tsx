import { createKeys } from "@/shared/lib/keys"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const METRIC_COUNT = 4

export const WatchlistSkeleton = () => (
  <div className="flex items-center gap-6">
    {createKeys(2).map((key) => (
      <div key={key} className="flex items-center gap-2.5">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    ))}
    <Skeleton className="size-9" />
  </div>
)

export const MetricCardsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    {createKeys(METRIC_COUNT).map((key) => (
      <Card key={key} className="@container/metric gap-4">
        <CardHeader className="items-center">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-9 rounded-(--card-radius)" />
            <Skeleton className="h-4 w-16 @[16rem]/metric:w-24" />
          </div>
          <CardAction>
            <Skeleton className="h-5 w-6" />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 @[16rem]/metric:flex-row @[16rem]/metric:items-end @[16rem]/metric:justify-between">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-full max-w-28" />
              <Skeleton className="h-7 w-full max-w-32" />
            </div>
            <Skeleton className="h-8 w-full @[16rem]/metric:h-10 @[16rem]/metric:w-24" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export const HISTORY_CHART_CLASS = "h-full min-h-72"

const HISTORY_BARS = 28

export const HistoryChartSkeleton = () => (
  <div className={`${HISTORY_CHART_CLASS} flex gap-3`}>
    <div className="flex w-9 flex-col justify-between py-2">
      {createKeys(5).map((key) => (
        <Skeleton key={key} className="h-3 w-9" />
      ))}
    </div>
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-1 items-end gap-1.5">
        {createKeys(HISTORY_BARS).map((key, position) => (
          <Skeleton
            key={key}
            className="flex-1"
            style={{ height: `${20 + ((position * 17) % 22)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {createKeys(7).map((key) => (
          <Skeleton key={key} className="h-3 w-14" />
        ))}
      </div>
    </div>
  </div>
)

export const PortfolioHistorySkeleton = () => (
  <Card>
    <CardHeader className="gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-64" />
      <CardAction>
        <Skeleton className="h-9 w-72 lg:h-10" />
      </CardAction>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col">
      <HistoryChartSkeleton />
    </CardContent>
  </Card>
)

export const ExchangeCardSkeleton = () => (
  <Card className="gap-4">
    <CardHeader className="items-center">
      <Skeleton className="h-5 w-24" />
      <CardAction>
        <Skeleton className="h-5 w-6" />
      </CardAction>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col gap-3">
      <Skeleton className="h-9 lg:h-10" />
      <div className="flex flex-col gap-2.5 border-t border-border pt-3">
        {createKeys(3).map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 border border-border p-3"
          >
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-11" />
    </CardContent>
  </Card>
)

export const AssetsCardSkeleton = () => (
  <Card>
    <CardHeader className="items-center">
      <Skeleton className="h-5 w-28" />
      <CardAction className="flex gap-2">
        <Skeleton className="h-9 w-52 lg:h-10" />
        <Skeleton className="h-9 w-20 lg:h-10" />
        <Skeleton className="h-9 w-20 lg:h-10" />
      </CardAction>
    </CardHeader>
    <CardContent>
      <div className="border border-border">
        <div className="flex h-10 items-center border-b border-border bg-accent px-4">
          <Skeleton className="h-3.5 w-full" />
        </div>
        {createKeys(3).map((key) => (
          <div
            key={key}
            className="flex h-14 items-center gap-6 border-b border-border px-4 last:border-b-0"
          >
            <div className="flex w-36 items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-9 w-32" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const ConverterCardSkeleton = () => (
  <Card className="gap-4">
    <CardHeader className="items-center">
      <Skeleton className="h-5 w-44" />
      <CardAction>
        <Skeleton className="h-5 w-6" />
      </CardAction>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 border-t border-border pt-4">
        {createKeys(2).map((key) => (
          <div
            key={key}
            className="flex min-h-20 flex-1 items-center gap-3 border border-border px-4"
          >
            <Skeleton className="size-11 rounded-full" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11" />
    </CardContent>
  </Card>
)
