"use client"

import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"
import { useLegend, useLegendItem } from "./legend-context"

export interface LegendItemProps {
  className?: string
  children: ReactNode
}

export function LegendItem({ className = "", children }: LegendItemProps) {
  const { setHoveredIndex } = useLegend()
  const { index, isHovered } = useLegendItem()

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg px-2 py-1.5 transition-all duration-150 ease-out",
        isHovered && "bg-legend-muted",
        className
      )}
      data-hovered={isHovered ? "" : undefined}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {children}
    </div>
  )
}

LegendItem.displayName = "LegendItem"
