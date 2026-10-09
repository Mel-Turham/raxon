import {
  ListCardSkeleton,
  range,
  TabsSkeleton,
} from "@/components/shared/skeleton-parts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CANDLE_TIMEFRAMES, CHART_VIEWS } from "@/constants"
import { Skeleton } from "@/components/ui/skeleton"

const BOOK_LEVELS = 7
// Depth bar widths, so the placeholder already reads as an order book.
const DEPTHS = [18, 42, 64, 86, 52, 30, 12]

const BookSideSkeleton = () => (
  <div className="flex flex-col">
    {range(BOOK_LEVELS).map((index) => (
      <div key={index} className="flex h-7 items-center justify-between gap-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton
          className="h-5"
          style={{ width: `${DEPTHS[index % DEPTHS.length]}%` }}
        />
      </div>
    ))}
  </div>
)

export const OrderBookSkeleton = () => (
  <Card className="gap-3">
    <CardHeader>
      <TabsSkeleton count={2} />
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-7 w-24" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
      <BookSideSkeleton />
      <div className="flex items-center justify-between border-y border-border py-2.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="size-4" />
      </div>
      <BookSideSkeleton />
    </CardContent>
  </Card>
)

export const RunningTradesSkeleton = () => (
  <ListCardSkeleton columns={3} rows={5} separators />
)

const SKELETON_CANDLES = 36

// Deterministic wave, so the placeholder reads as a candlestick chart.
const candleShape = (index: number) => ({
  top: 22 + Math.sin(index / 4) * 14 + (index % 3) * 4,
  height: 8 + ((index * 7) % 11),
  volume: 30 + ((index * 13) % 60),
})

/** Candles + volume + right axis, sized like the real price chart. */
export const ChartAreaSkeleton = () => (
  <div className="flex h-full min-h-90 gap-3">
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-1 justify-between">
        {range(SKELETON_CANDLES).map((index) => {
          const { top, height } = candleShape(index)
          return (
            <Skeleton
              key={index}
              className="w-1.5"
              style={{ marginTop: `${top}%`, height: `${height}%` }}
            />
          )
        })}
      </div>
      <div className="flex h-12 items-end justify-between">
        {range(SKELETON_CANDLES).map((index) => (
          <Skeleton
            key={index}
            className="w-1.5"
            style={{ height: `${candleShape(index).volume}%` }}
          />
        ))}
      </div>
    </div>
    <div className="flex w-14 flex-col justify-between pt-2 pb-16">
      {range(6).map((index) => (
        <Skeleton key={index} className="h-3 w-12" />
      ))}
    </div>
  </div>
)

export const MarketChartSkeleton = () => (
  <Card className="gap-0 py-0">
    <CardHeader className="flex flex-row items-center justify-between border-b border-border py-3">
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="hidden gap-6 md:flex">
        {range(4).map((index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="flex flex-1 flex-col gap-2 py-3">
      <div className="flex items-center justify-between">
        <TabsSkeleton count={CHART_VIEWS.length} />
        <Skeleton className="h-8 w-80" />
      </div>
      <div className="min-h-90 flex-1">
        <ChartAreaSkeleton />
      </div>
      <Skeleton
        className="h-9 lg:h-10"
        style={{ width: `calc(${CANDLE_TIMEFRAMES.length} * 3rem)` }}
      />
    </CardContent>
  </Card>
)

const FormFieldSkeleton = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-11" />
  </div>
)

export const OrderFormSkeleton = () => (
  <Card className="gap-4">
    <CardHeader>
      <Skeleton className="h-9 w-full lg:h-10" />
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <FormFieldSkeleton />
      <Skeleton className="h-2.5" />
      <FormFieldSkeleton />
      <FormFieldSkeleton />
      <Skeleton className="h-4 w-36" />
      <div className="flex flex-col gap-3 border-t border-dashed border-border pt-4">
        {range(3).map((index) => (
          <div key={index} className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-11" />
    </CardContent>
  </Card>
)

export const OrdersCardSkeleton = () => (
  <Card className="gap-3">
    <CardHeader>
      <TabsSkeleton count={2} />
    </CardHeader>
    <CardContent>
      <div className="flex h-8 items-center justify-between">
        {range(5).map((index) => (
          <Skeleton key={index} className="h-3 w-16" />
        ))}
      </div>
      {range(5).map((index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b border-border/60 py-3 last:border-b-0"
        >
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
          {range(4).map((column) => (
            <Skeleton key={column} className="h-3.5 w-14" />
          ))}
        </div>
      ))}
    </CardContent>
  </Card>
)
