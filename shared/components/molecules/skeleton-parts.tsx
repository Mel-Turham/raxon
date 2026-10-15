import { createKeys } from "@/shared/lib/keys"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/shared/lib/utils"

export const TabsSkeleton = ({ count }: { count: number }) => (
  <Skeleton
    className="h-9 lg:h-10"
    style={{ width: `calc(${count} * 2.75rem + 0.5rem)` }}
  />
)

type ListCardSkeletonProps = {
  rows: number
  columns: number

  leading?: "avatar" | "glyph" | "none"
  separators?: boolean
  className?: string
}

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
        {createKeys(columns).map((key) => (
          <Skeleton key={key} className="h-3 w-12" />
        ))}
      </div>
      {createKeys(rows).map((key) => (
        <div
          key={key}
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
          {createKeys(columns - 1).map((columnKey) => (
            <Skeleton key={columnKey} className="h-3.5 w-14" />
          ))}
        </div>
      ))}
    </CardContent>
  </Card>
)

export const SPARKLINE_CLASS = "h-9 w-32"

export const SparklineSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={cn(SPARKLINE_CLASS, className)} />
)
