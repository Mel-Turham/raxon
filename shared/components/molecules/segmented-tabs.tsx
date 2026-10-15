"use client"

import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/shared/lib/utils"

type SegmentedTabsProps<T extends string> = {
  options: readonly T[]
  value: T
  onValueChange: (value: T) => void

  variant?: "default" | "bare"

  icons?: Partial<Record<T, HugeiconsIconProps["icon"]>>
  counts?: Partial<Record<T, number>>
  className?: string
  activeClassName?: string
}

const LIST_CLASS = {
  default:
    "border border-border/70 bg-foreground/[0.025] p-1 shadow-(--segmented-shadow) dark:border-border dark:bg-background/60",
  bare: "bg-transparent p-0",
} as const

export const SegmentedTabs = <T extends string>({
  options,
  value,
  onValueChange,
  variant = "default",
  icons,
  counts,
  className,
  activeClassName,
}: SegmentedTabsProps<T>) => {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as T)}
      className={cn("gap-0", className)}
    >
      <TabsList
        className={cn(
          "gap-0.5 group-data-horizontal/tabs:h-9 lg:group-data-horizontal/tabs:h-10",
          LIST_CLASS[variant]
        )}
      >
        {options.map((option) => (
          <TabsTrigger
            key={option}
            value={option}
            className={cn(
              "h-full min-w-11 px-3 text-xs font-normal text-muted-foreground/80 lg:min-w-13 lg:px-4 lg:text-sm data-active:bg-card data-active:shadow-(--segmented-active-shadow) dark:data-active:border-transparent dark:data-active:bg-muted dark:data-active:text-foreground/90",
              activeClassName
            )}
          >
            {icons?.[option] && (
              <HugeiconsIcon icon={icons[option]} size={16} />
            )}
            {option}
            {counts?.[option] !== undefined && (
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {counts[option]}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
