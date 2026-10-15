import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsSkeleton } from "@/shared/components/molecules/skeleton-parts"
import { createKeys } from "@/shared/lib/keys"
import { INTEGRATION_TABS } from "../constants"

const CARD_COUNT = 9

const IntegrationCardSkeleton = () => (
  <Card className="gap-0 py-0">
    <CardHeader className="flex items-start gap-3 py-4">
      <Skeleton className="size-10" />
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-20" />
    </CardHeader>
    <CardContent className="flex flex-col gap-2 pb-4">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-1.5 pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    </CardContent>
    <div className="flex items-center justify-between border-t border-border px-(--card-spacing) py-3">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </Card>
)

export function IntegrationsSkeleton() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-24" />
      </div>
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
        <header className="flex flex-col justify-between gap-4 pt-1 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-9 w-40" />
        </header>

        <div className="flex h-10 items-center gap-5 border-b border-border">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3.5 w-20" />
        </div>

        <div className="flex flex-col justify-between gap-3 pt-2 lg:flex-row lg:items-center">
          <TabsSkeleton count={INTEGRATION_TABS.length} />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-64 lg:h-10" />
            <Skeleton className="h-9 w-44 lg:h-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {createKeys(CARD_COUNT, "integration").map((key) => (
            <IntegrationCardSkeleton key={key} />
          ))}
        </div>
      </main>
    </div>
  )
}
