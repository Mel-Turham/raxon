"use client"

import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type SegmentedTabsProps<T extends string> = {
  options: readonly T[]
  value: T
  onValueChange: (value: T) => void
  /** `bare`: no container, only the active pill (e.g. chart timeframes). */
  variant?: "default" | "bare"
  /** Optional icon per option, shown before its label. */
  icons?: Partial<Record<T, HugeiconsIconProps["icon"]>>
  className?: string
}

const LIST_CLASS = {
  default:
    "border border-border/70 bg-foreground/[0.025] p-1 shadow-(--segmented-shadow) dark:border-border dark:bg-muted",
  bare: "bg-transparent p-0",
} as const

export const SegmentedTabs = <T extends string>({
  options,
  value,
  onValueChange,
  variant = "default",
  icons,
  className,
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
            className="h-full min-w-11 px-3 text-xs font-normal text-muted-foreground/80 lg:min-w-13 lg:px-4 lg:text-sm data-active:bg-card data-active:shadow-(--segmented-active-shadow) dark:data-active:border-foreground/10 dark:data-active:bg-foreground/5 dark:data-active:text-foreground/90"
          >
            {icons?.[option] && (
              <HugeiconsIcon icon={icons[option]} size={16} />
            )}
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
