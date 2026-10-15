import type { ReactNode } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createKeys, withKeys } from "@/shared/lib/keys"
import { cn } from "@/shared/lib/utils"

const Line = ({
  className,
  box = "h-5",
}: {
  className?: string
  box?: string
}) => (
  <div className={cn("flex items-center", box)}>
    <Skeleton className={cn("h-3", className)} />
  </div>
)

const NAV_KBD = [3, 2, 3, 3, 3]
const RECENT_WIDTHS = ["w-36", "w-32", "w-40", "w-28", "w-36", "w-32", "w-28"]

const SidebarSkeleton = () => (
  <div className="hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
    <div className="flex h-14 items-center justify-between gap-2 p-2 px-3">
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-7" />
        <Line box="h-6" className="w-20" />
      </div>
      <Skeleton className="size-7" />
    </div>

    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-col p-2 px-2">
        {withKeys(NAV_KBD, "nav").map(({ key, value: keys }) => (
          <div className="flex h-9 items-center gap-3 px-2.5" key={key}>
            <Skeleton className="size-4" />
            <Line className="w-20" />
            <div className="ml-auto flex gap-1">
              {createKeys(keys, "kbd").map((kbdKey) => (
                <Skeleton className="size-5" key={kbdKey} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-3 h-px bg-sidebar-border" />

      {[
        { id: "pinned", rows: ["w-36", "w-32"], label: "w-14" },
        { id: "recent", rows: RECENT_WIDTHS, label: "w-24" },
      ].map(({ id, rows, label }) => (
        <div className="flex flex-col p-2 px-2" key={id}>
          <div className="flex h-9 items-center gap-2 px-2.5">
            <Skeleton className="size-3.5" />
            <Skeleton className={cn("h-2.5", label)} />
          </div>
          {withKeys(rows, "row").map(({ key, value: width }) => (
            <div className="flex h-9 items-center px-2.5" key={key}>
              <Line className={width} />
            </div>
          ))}
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-3 rounded-xl border border-sidebar-border bg-foreground/[0.03] p-3.5">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex flex-col gap-1">
          <div className="flex h-5 items-center gap-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Line box="h-[19.5px]" className="w-full" />
          <Line box="h-[19.5px]" className="w-28" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-1.5 flex-1 rounded-full" />
          <Line box="h-4" className="w-7" />
        </div>
        <Skeleton className="h-9 rounded-lg" />
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-foreground/[0.03] p-2">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col">
          <Line className="w-24" />
          <Line box="h-4" className="h-2.5 w-28" />
        </div>
        <Skeleton className="size-7 rounded-lg" />
      </div>
    </div>
  </div>
)

const ComposerSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="rounded-[26px] border border-foreground/8 bg-foreground/[0.025] p-1.5">
      <div className="flex flex-col gap-3 rounded-[20px] border border-foreground/10 bg-background p-3 pb-2.5 dark:border-foreground/[0.07]">
        <div className="flex items-start gap-3">
          <div className="flex min-h-18 flex-1 flex-col pt-0.5">
            <Line box="h-6" className="h-3.5 w-56" />
          </div>
          <Skeleton className="-mt-1 -mr-1 size-7" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-8" />
          <div className="mx-1 h-5 w-px bg-foreground/10" />
          {["w-24", "w-28", "w-20"].map((width) => (
            <Skeleton className={cn("h-8 rounded-full", width)} key={width} />
          ))}
          <Skeleton className="ml-auto size-10 rounded-full" />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        {createKeys(3).map((key) => (
          <div className="flex items-center gap-1" key={key}>
            <Skeleton className="size-5" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-2.5 w-60" />
    </div>
  </div>
)

const WelcomeSkeleton = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
    <div className="flex flex-col items-center gap-4">
      <div className="flex size-28 items-center justify-center">
        <Skeleton className="size-[90px] rounded-full" />
      </div>
      <div className="flex flex-col items-center">
        <Line
          box="h-[37.5px] md:h-[45px]"
          className="h-7 w-64 md:h-8 md:w-80"
        />
        <Line
          box="h-[37.5px] md:h-[45px]"
          className="h-7 w-80 md:h-8 md:w-[520px]"
        />
      </div>
    </div>
    <div className="w-full max-w-3xl">
      <ComposerSkeleton />
    </div>
    <div className="grid w-full max-w-3xl gap-2 sm:grid-cols-3">
      {createKeys(3).map((key) => (
        <div
          className="flex items-center gap-2.5 rounded-2xl border border-transparent bg-muted/60 px-3 py-2.5 dark:border-foreground/[0.07]"
          key={key}
        >
          <Skeleton className="size-7 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col">
            <Line box="h-[19.5px]" className="w-24" />
            <Line box="h-4" className="h-2.5 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const CardTitleSkeleton = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <CardHeader className="gap-1">
    <Line className={title} />
    <Line box="h-[19.5px]" className={cn("h-2.5", subtitle)} />
  </CardHeader>
)

const InsightsSkeleton = () => (
  <aside className="hidden w-[340px] shrink-0 flex-col gap-3 overflow-hidden border-l border-border p-3 *:shrink-0 xl:flex">
    <Card className="gap-3">
      <CardTitleSkeleton subtitle="w-48" title="w-32" />
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-56">
          <svg aria-hidden className="w-full" viewBox="0 0 160 88">
            <path
              className="animate-pulse stroke-muted"
              d="M 12 80 A 68 68 0 0 1 148 80"
              fill="none"
              strokeWidth={10}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-10" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-1.5">
          <div className="flex h-10 items-end gap-1">
            {[55, 60, 70, 65, 80, 90, 100].map((height) => (
              <Skeleton
                className="flex-1"
                key={height}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex gap-1">
            {createKeys(7).map((key) => (
              <div className="flex h-[15px] flex-1 justify-center" key={key}>
                <Skeleton className="h-2 w-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="gap-2">
      <CardTitleSkeleton subtitle="w-44" title="w-20" />
      <CardContent className="flex flex-col divide-y divide-foreground/8 px-0">
        {createKeys(3).map((key) => (
          <div
            className="flex items-center gap-3 px-(--card-spacing) py-2.5"
            key={key}
          >
            <Skeleton className="size-7 rounded-full" />
            <div className="flex flex-1 flex-col">
              <Line className="w-10" />
              <Line box="h-4" className="h-2.5 w-12" />
            </div>
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-9" />
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="gap-3">
      <CardTitleSkeleton subtitle="w-44" title="w-28" />
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-9 items-center gap-2">
          <Skeleton className="h-7 w-10" />
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="ml-auto h-5 w-10" />
        </div>
        <div className="flex flex-col gap-3">
          {createKeys(3).map((key) => (
            <div className="flex flex-col gap-1.5" key={key}>
              <div className="flex justify-between">
                <Line box="h-4" className="h-2.5 w-24" />
                <Line box="h-4" className="h-2.5 w-8" />
              </div>
              <Skeleton className="h-1" />
              <Line box="h-[16.5px]" className="h-2 w-40" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </aside>
)

export function AiShellSkeleton({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh min-w-0">
      <SidebarSkeleton />
      <div className="flex min-h-0 min-w-0 flex-1">{children}</div>
    </main>
  )
}

export function AiChatSkeleton() {
  return (
    <>
      <section className="flex h-full min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <div className="flex items-center gap-2">
            <Line className="w-20" />
            <Skeleton className="h-[18px] w-9" />
          </div>
          <Skeleton className="ml-auto h-8 w-[104px]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <WelcomeSkeleton />
        </div>
      </section>
      <InsightsSkeleton />
    </>
  )
}
