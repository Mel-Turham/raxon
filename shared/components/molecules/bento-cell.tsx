import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

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
