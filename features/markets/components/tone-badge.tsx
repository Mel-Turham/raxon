import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"
import type { MarketTone } from "../types"

const TONE_CLASS: Record<MarketTone, string> = {
  up: "bg-success/12 text-success",
  down: "bg-destructive/12 text-destructive",
  flat: "bg-muted text-muted-foreground",
}

export const ToneBadge = ({
  tone,
  children,
  className,
}: {
  tone: MarketTone
  children: ReactNode
  className?: string
}) => (
  <span
    className={cn(
      "inline-flex h-5 shrink-0 items-center gap-1 px-1.5 text-[11px] font-medium tabular-nums",
      TONE_CLASS[tone],
      className
    )}
  >
    {children}
  </span>
)
