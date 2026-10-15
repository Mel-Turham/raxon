"use client"

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  useState,
} from "react"
import { cn } from "@/shared/lib/utils"
import {
  type LegendItemData,
  LegendItemProvider,
  LegendProvider,
} from "./legend-context"

export interface LegendProps {
  items: LegendItemData[]
  hoveredIndex?: number | null
  onHoverChange?: (index: number | null) => void
  title?: string
  titleClassName?: string
  className?: string
  children: ReactElement
}

export function Legend({
  items,
  hoveredIndex: controlledHoveredIndex,
  onHoverChange,
  title,
  titleClassName = "text-sm font-semibold",
  className = "",
  children,
}: LegendProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null)

  const isControlled = controlledHoveredIndex !== undefined
  const hoveredIndex = isControlled
    ? controlledHoveredIndex
    : internalHoveredIndex
  const setHoveredIndex = (index: number | null) => {
    if (isControlled) {
      onHoverChange?.(index)
    } else {
      setInternalHoveredIndex(index)
    }
  }

  const contextValue = {
    items,
    hoveredIndex,
    setHoveredIndex,
  }

  return (
    <LegendProvider value={contextValue}>
      <div className={cn("legend-container flex flex-col gap-2", className)}>
        {title && (
          <h3 className={cn("mb-1 text-legend-foreground", titleClassName)}>
            {title}
          </h3>
        )}
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index
          const isFaded = hoveredIndex !== null && hoveredIndex !== index
          const percentage = item.maxValue
            ? (item.value / item.maxValue) * 100
            : 0

          const itemContext = {
            item,
            index,
            isHovered,
            isFaded,
            percentage,
          }

          if (isValidElement(children)) {
            return (
              <LegendItemProvider key={item.label} value={itemContext}>
                {cloneElement(children)}
              </LegendItemProvider>
            )
          }

          return null
        })}
      </div>
    </LegendProvider>
  )
}

Legend.displayName = "Legend"
