import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TabsSkeleton } from "@/shared/components/molecules/skeleton-parts"
import { createKeys } from "@/shared/lib/keys"
import { AUTOMATION_TABS } from "../constants"

const AutomationCardSkeleton = () => (
  <Card className="gap-0 py-0">
    <div className="flex h-24 items-center justify-center gap-3 border-b border-border bg-muted/40">
      <Skeleton className="size-10" />
      <Skeleton className="h-3 w-4" />
      <Skeleton className="size-10" />
    </div>
    <div className="flex flex-col gap-2 px-(--card-spacing) py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3.5 w-6" />
      </div>
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-32" />
    </div>
    <div className="flex h-12 items-center justify-between border-t border-border px-(--card-spacing)">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="size-6" />
    </div>
  </Card>
)

export function AutomationsSkeleton() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-20" />
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
          <TabsSkeleton count={AUTOMATION_TABS.length} />
          <Skeleton className="h-9 w-64 lg:h-10" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {createKeys(6, "automation").map((key) => (
            <AutomationCardSkeleton key={key} />
          ))}
        </div>
      </main>
    </div>
  )
}
