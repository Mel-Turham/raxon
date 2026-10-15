import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createKeys, withKeys } from "@/shared/lib/keys"

function SummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {createKeys(4).map((key) => (
        <Card key={key} className="gap-4">
          <CardHeader className="pb-0">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="flex min-h-18 flex-col justify-between gap-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const PORTFOLIO_BAR_HEIGHTS = [
  38, 62, -18, 44, 70, 26, -32, 52, 80, 34, -12, 58, 46, -24, 66,
]

function PortfolioSkeleton() {
  return (
    <Card className="min-w-0 gap-0">
      <CardHeader className="gap-2 pb-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardHeader>
      <CardContent className="min-w-0 pt-2">
        <div className="relative h-56 sm:h-64">
          <div className="absolute inset-x-2 top-3.5 bottom-9 flex flex-col justify-between">
            {createKeys(5).map((key) => (
              <div
                className="border-t border-dashed border-border/70"
                key={key}
              />
            ))}
          </div>
          <div className="absolute inset-x-2 top-3.5 bottom-9 flex gap-2 px-1">
            {withKeys(PORTFOLIO_BAR_HEIGHTS, "bar").map(
              ({ key, value: height }) => (
                <div className="relative flex-1" key={key}>
                  <Skeleton
                    className="absolute inset-x-0 rounded-[3px]"
                    style={
                      height >= 0
                        ? { bottom: "30%", height: `${height * 0.7}%` }
                        : { top: "70%", height: `${-height * 0.3}%` }
                    }
                  />
                </div>
              )
            )}
          </div>
          <div className="absolute inset-x-3 bottom-0 flex justify-between">
            {createKeys(6).map((key) => (
              <Skeleton className="h-3 w-12" key={key} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AllocationSkeleton() {
  return (
    <Card className="@container min-w-0 gap-0">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex min-w-0 flex-col items-center gap-5 @md:flex-row @md:justify-between @md:gap-4">
        <div className="relative aspect-square w-full max-w-64 shrink-0 @md:w-[44%] @md:max-w-none">
          {createKeys(5).map((key, position) => (
            <Skeleton
              className="absolute rounded-full border-8 border-muted/70 bg-transparent"
              key={key}
              style={{
                inset: `${position * 10}%`,
              }}
            />
          ))}
        </div>
        <div className="w-full min-w-0 divide-y divide-border/70 @md:flex-1">
          {createKeys(5).map((key) => (
            <div className="flex h-16 items-center gap-2.5 px-3" key={key}>
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="size-2.5 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TradingPerformanceSkeleton() {
  return (
    <Card className="h-full min-w-0 overflow-hidden">
      <CardHeader className="gap-1 pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-32" />
      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <Skeleton className="h-8 w-56" />
        <div className="flex h-64 items-end gap-2 px-2 pb-8">
          {createKeys(14).map((key, position) => (
            <Skeleton
              className="flex-1"
              key={key}
              style={{ height: `${20 + ((position * 37) % 60)}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
          {createKeys(3).map((key) => (
            <div className="space-y-2" key={key}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TradeStatisticsSkeleton() {
  return (
    <Card className="h-full min-w-0">
      <CardHeader className="items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-28" />
      </CardHeader>
      <CardContent className="divide-y divide-border/70">
        {createKeys(7).map((key) => (
          <div className="flex items-center gap-3 py-2.5" key={key}>
            <Skeleton className="size-8" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-44 max-w-full" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AssetsTableSkeleton() {
  return (
    <Card className="min-w-0">
      <CardHeader className="gap-4 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-9 w-full sm:w-52" />
          <Skeleton className="h-9 w-52" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <div className="min-w-[48rem]">
            <div className="grid h-10 grid-cols-[3rem_22%_10%_14%_16%_12%_22%] items-center gap-0 border-b border-border px-4">
              {createKeys(7).map((key) => (
                <Skeleton className="mx-2 h-3 w-16" key={key} />
              ))}
            </div>
            {createKeys(4).map((key) => (
              <div
                className="grid h-16 grid-cols-[3rem_22%_10%_14%_16%_12%_22%] items-center border-b border-border px-4 last:border-0"
                key={key}
              >
                <Skeleton className="mx-2 h-3 w-5" />
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
                {createKeys(5).map((columnKey) => (
                  <Skeleton className="mx-auto h-3 w-16" key={columnKey} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsSkeleton() {
  return (
    <main className="flex min-w-0 flex-col gap-3 p-4 sm:p-6">
      <header className="flex flex-col gap-4 pt-1 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
      </header>

      <SummarySkeleton />

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <PortfolioSkeleton />
        <AllocationSkeleton />
      </div>

      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <TradingPerformanceSkeleton />
        <TradeStatisticsSkeleton />
      </div>

      <AssetsTableSkeleton />
    </main>
  )
}
