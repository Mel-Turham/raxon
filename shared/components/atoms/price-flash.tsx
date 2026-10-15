import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

const FLASH_CLASS =
  "motion-safe:animate-price-flash [--price-flash:transparent] data-[direction=down]:[--price-flash:color-mix(in_oklch,var(--destructive)_22%,transparent)] data-[direction=up]:[--price-flash:color-mix(in_oklch,var(--success)_22%,transparent)]"

export const PriceFlash = ({
  flashKey,
  delta,
  children,
  className,
}: {
  flashKey: number
  delta: number
  children: ReactNode
  className?: string
}) => (
  <span
    className={cn("-mx-1 px-1", FLASH_CLASS, className)}
    data-direction={delta > 0 ? "up" : delta < 0 ? "down" : undefined}
    key={flashKey}
  >
    {children}
  </span>
)
