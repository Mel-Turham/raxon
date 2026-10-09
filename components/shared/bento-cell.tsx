import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Bento grid cell: the card inside always fills the cell, so cards sharing a
 * row (or the end of a column) line up on the same edges.
 */
export const BentoCell = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => (
  <div className={cn("flex min-w-0 flex-col *:flex-1", className)}>
    {children}
  </div>
)
