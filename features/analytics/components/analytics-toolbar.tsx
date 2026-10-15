"use client"

import { Calendar03Icon, Download04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ANALYTICS_RANGE_LABELS,
  ANALYTICS_RANGES,
  parseAnalyticsRange,
} from "@/features/analytics/constants"
import type { AnalyticsRange } from "@/features/analytics/types"
import { downloadCsv } from "@/shared/lib/csv"
import { cn } from "@/shared/lib/utils"

type AnalyticsToolbarProps = {
  range: AnalyticsRange
  exportRows: (string | number)[][]
}

export function AnalyticsToolbar({ range, exportRows }: AnalyticsToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const changeRange = (value: unknown) => {
    const next = parseAnalyticsRange(value)
    if (next === range) return
    startTransition(() => {
      router.replace(`${pathname}?range=${next}`, { scroll: false })
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={range} onValueChange={changeRange}>
        <SelectTrigger
          aria-busy={isPending}
          className={cn(
            "h-9 min-w-40 gap-2 transition-opacity data-[size=default]:h-9",
            isPending && "opacity-60"
          )}
        >
          <HugeiconsIcon
            className={cn(
              "text-muted-foreground",
              isPending && "animate-pulse"
            )}
            icon={Calendar03Icon}
            size={16}
          />
          <SelectValue>
            {(value: AnalyticsRange) => ANALYTICS_RANGE_LABELS[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {ANALYTICS_RANGES.map((option) => (
            <SelectItem key={option} value={option}>
              {ANALYTICS_RANGE_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="h-9 border-primary/70 px-3 hover:border-primary hover:bg-primary/5"
        onClick={() =>
          downloadCsv(
            `raxon-analytics-${range.toLowerCase()}.csv`,
            ["Section", "Metric", "Value"],
            exportRows
          )
        }
        variant="outline"
      >
        <HugeiconsIcon icon={Download04Icon} size={16} />
        Export report
      </Button>
    </div>
  )
}
