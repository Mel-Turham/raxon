import { range } from "@/components/shared/skeleton-parts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const NewListingsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
    {range(5).map((index) => (
      <Card key={index} className="gap-3">
        <CardHeader className="flex items-center gap-2.5">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-5 w-36" />
        </CardContent>
      </Card>
    ))}
  </div>
)

export const AssetMarketSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-3">
        <Skeleton className="h-9 w-64 lg:h-10" />
        <Skeleton className="h-9 w-96 lg:h-10" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-60 lg:h-10" />
        <Skeleton className="h-9 w-20 lg:h-10" />
        <Skeleton className="h-9 w-20 lg:h-10" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="border border-border">
        <div className="flex h-10 items-center border-b border-border bg-accent px-4">
          <Skeleton className="h-3.5 w-full" />
        </div>
        {range(8).map((index) => (
          <div
            key={index}
            className="flex h-16 items-center gap-6 border-b border-border px-4 last:border-b-0"
          >
            <Skeleton className="h-4 w-4" />
            <div className="flex w-40 items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-36" />
            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)
