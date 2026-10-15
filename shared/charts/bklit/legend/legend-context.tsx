"use client"

import { createContext, useContext } from "react"

export const legendCssVars = {
  background: "var(--legend)",
  foreground: "var(--legend-foreground)",
  muted: "var(--legend-muted)",
  mutedForeground: "var(--legend-muted-foreground)",
  track: "var(--legend-track)",
}

export interface LegendItemData {
  label: string
  value: number
  maxValue?: number
  color: string
}

export interface LegendContextValue {
  items: LegendItemData[]
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

export interface LegendItemContextValue {
  item: LegendItemData
  index: number
  isHovered: boolean
  isFaded: boolean
  percentage: number
}

const LegendContext = createContext<LegendContextValue | null>(null)
const LegendItemContext = createContext<LegendItemContextValue | null>(null)

export function LegendProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: LegendContextValue
}) {
  return (
    <LegendContext.Provider value={value}>{children}</LegendContext.Provider>
  )
}

export function LegendItemProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: LegendItemContextValue
}) {
  return (
    <LegendItemContext.Provider value={value}>
      {children}
    </LegendItemContext.Provider>
  )
}

export function useLegend(): LegendContextValue {
  const context = useContext(LegendContext)
  if (!context) {
    throw new Error("useLegend must be used within a <Legend> component.")
  }
  return context
}

export function useLegendItem(): LegendItemContextValue {
  const context = useContext(LegendItemContext)
  if (!context) {
    throw new Error(
      "useLegendItem must be used within a <LegendItem> component."
    )
  }
  return context
}
