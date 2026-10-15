"use client"

import type { Transition } from "motion/react"
import { createContext, type ReactNode, useContext, useMemo } from "react"

export const radarCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label, oklch(0.65 0.01 260))",
  grid: "var(--chart-grid)",
  border: "var(--border)",
  area1: "var(--chart-1)",
  area2: "var(--chart-2)",
  area3: "var(--chart-3)",
  area4: "var(--chart-4)",
  area5: "var(--chart-5)",
}

export const defaultRadarColors = [
  radarCssVars.area1,
  radarCssVars.area2,
  radarCssVars.area3,
  radarCssVars.area4,
  radarCssVars.area5,
]

export interface RadarMetric {
  key: string
  label: string
}

export interface RadarData {
  label: string
  color?: string
  values: Record<string, number>
}

export interface RadarHoverContextValue {
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}

export interface RadarStableContextValue {
  data: RadarData[]
  metrics: RadarMetric[]

  size: number
  radius: number
  levels: number

  animate: boolean
  enterDurationMs: number
  staggerScale: number
  enterTransition?: Transition
  motionReplayKey: string

  getColor: (index: number) => string
  getAngle: (metricIndex: number) => number
  getPointPosition: (
    metricIndex: number,
    value: number
  ) => { x: number; y: number }
  yScale: (value: number) => number
}

export type RadarContextValue = RadarStableContextValue & RadarHoverContextValue

const RadarStableContext = createContext<RadarStableContextValue | null>(null)
const RadarHoverContext = createContext<RadarHoverContextValue | null>(null)

export function RadarProvider({
  children,
  value,
}: {
  children: ReactNode
  value: RadarContextValue
}) {
  const stable = useMemo<RadarStableContextValue>(
    () => ({
      data: value.data,
      metrics: value.metrics,
      size: value.size,
      radius: value.radius,
      levels: value.levels,
      animate: value.animate,
      enterDurationMs: value.enterDurationMs,
      staggerScale: value.staggerScale,
      enterTransition: value.enterTransition,
      motionReplayKey: value.motionReplayKey,
      getColor: value.getColor,
      getAngle: value.getAngle,
      getPointPosition: value.getPointPosition,
      yScale: value.yScale,
    }),
    [
      value.data,
      value.metrics,
      value.size,
      value.radius,
      value.levels,
      value.animate,
      value.enterDurationMs,
      value.staggerScale,
      value.enterTransition,
      value.motionReplayKey,
      value.getColor,
      value.getAngle,
      value.getPointPosition,
      value.yScale,
    ]
  )

  const hover = useMemo<RadarHoverContextValue>(
    () => ({
      hoveredIndex: value.hoveredIndex,
      setHoveredIndex: value.setHoveredIndex,
    }),
    [value.hoveredIndex, value.setHoveredIndex]
  )

  return (
    <RadarStableContext.Provider value={stable}>
      <RadarHoverContext.Provider value={hover}>
        {children}
      </RadarHoverContext.Provider>
    </RadarStableContext.Provider>
  )
}

export function useRadarStable(): RadarStableContextValue {
  const context = useContext(RadarStableContext)
  if (!context) {
    throw new Error(
      "useRadarStable must be used within a RadarProvider. " +
        "Make sure your component is wrapped in <RadarChart>."
    )
  }
  return context
}

export function useRadarHover(): RadarHoverContextValue {
  const context = useContext(RadarHoverContext)
  if (!context) {
    throw new Error(
      "useRadarHover must be used within a RadarProvider. " +
        "Make sure your component is wrapped in <RadarChart>."
    )
  }
  return context
}

export function useRadar(): RadarContextValue {
  return { ...useRadarStable(), ...useRadarHover() }
}

export default RadarStableContext
