import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const range = (count: number) =>
  Array.from({ length: count }, (_, index) => index)

/** Placeholder sized like a `SegmentedTabs` with `count` options. */
export const TabsSkeleton = ({ count }: { count: number }) => (
  <Skeleton
    className="h-9 lg:h-10"
    style={{ width: `calc(${count} * 2.75rem + 0.5rem)` }}
  />
)

type ListCardSkeletonProps = {
  rows: number
  columns: number
  /** What starts each row: token avatar, small glyph disc, or plain text. */
  leading?: "avatar" | "glyph" | "none"
  separators?: boolean
  className?: string
}

/** Placeholder for a `ListCard` table (title, header row, rows). */
export const ListCardSkeleton = ({
  rows,
  columns,
  leading = "none",
  separators = false,
  className,
}: ListCardSkeletonProps) => (
  <Card className={cn("gap-2", className)}>
    <CardHeader className="items-center">
      <Skeleton className="h-5 w-28" />
      <CardAction>
        <Skeleton className="h-5 w-16" />
      </CardAction>
    </CardHeader>
    <CardContent>
      <div className="flex h-8 items-center justify-between">
        {range(columns).map((index) => (
          <Skeleton key={index} className="h-3 w-12" />
        ))}
      </div>
      {range(rows).map((index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between gap-4 py-2",
            separators && "border-b border-border/60 last:border-b-0"
          )}
        >
          <div className="flex items-center gap-3">
            {leading === "avatar" && (
              <Skeleton className="size-8 rounded-full" />
            )}
            {leading === "glyph" && (
              <Skeleton className="size-5 rounded-full" />
            )}
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-16" />
              {leading === "avatar" && <Skeleton className="h-3 w-8" />}
            </div>
          </div>
          {range(columns - 1).map((column) => (
            <Skeleton key={column} className="h-3.5 w-14" />
          ))}
        </div>
      ))}
    </CardContent>
  </Card>
)

/** Size shared by the Sparkline and its placeholder. */
export const SPARKLINE_CLASS = "h-9 w-32"

export const SparklineSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn(SPARKLINE_CLASS, className)} />
)
