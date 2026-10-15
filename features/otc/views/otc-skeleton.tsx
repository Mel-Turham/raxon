import { createKeys } from "@/shared/lib/keys"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ListCardSkeleton } from "@/shared/components/molecules/skeleton-parts"

export function OtcSkeleton() {
  return (
    <main className="flex min-w-0 flex-col gap-3 p-4 sm:p-6">
      <header className="flex flex-col justify-between gap-4 pt-1 xl:flex-row xl:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-32" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {createKeys(4).map((key) => (
          <Card className="gap-4" key={key}>
            <CardHeader className="flex items-center gap-2.5">
              <Skeleton className="size-9" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="flex min-h-16 flex-col justify-between gap-3">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="gap-4">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Skeleton className="h-9 lg:h-10" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-8" />
            <div className="grid gap-2 sm:grid-cols-3">
              {createKeys(3).map((key) => (
                <Skeleton className="h-14" key={key} />
              ))}
            </div>
            <Skeleton className="h-11" />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3">
          <Card className="gap-4">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Skeleton className="h-36" />
              {createKeys(3).map((key) => (
                <Skeleton className="h-4" key={key} />
              ))}
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {createKeys(3).map((key) => (
                <div className="flex gap-3" key={key}>
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex flex-1 flex-col gap-1.5 pt-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <ListCardSkeleton columns={8} leading="avatar" rows={4} />
    </main>
  )
}
