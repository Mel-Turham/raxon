"use client"
import type { Transition } from "motion/react"
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useMemo,
} from "react"
export const ringCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  ringBackground: "var(--border)",
  ring1: "var(--chart-1)",
  ring2: "var(--chart-2)",
  ring3: "var(--chart-3)",
  ring4: "var(--chart-4)",
  ring5: "var(--chart-5)",
}
export const defaultRingColors = [
  ringCssVars.ring1,
  ringCssVars.ring2,
  ringCssVars.ring3,
  ringCssVars.ring4,
  ringCssVars.ring5,
]
export interface RingData {
  label: string
  value: number
  maxValue: number
  color?: string
}
export interface RingHoverContextValue {
  hoveredIndex: number | null
  setHoveredIndex: (index: number | null) => void
}
export interface RingStableContextValue {
  data: RingData[]
  size: number
  center: number
  strokeWidth: number
  ringGap: number
  baseInnerRadius: number
  animationKey: number
  isLoaded: boolean
  enterTransition?: Transition
  enterStaggerScale: number
  containerRef: RefObject<HTMLDivElement | null>
  totalValue: number
  getColor: (index: number) => string
  getRingRadii: (index: number) => {
    innerRadius: number
    outerRadius: number
  }
  startAngle: number
  endAngle: number
  geometryScrubbing: boolean
}
export type RingContextValue = RingStableContextValue & RingHoverContextValue
const RingStableContext = createContext<RingStableContextValue | null>(null)
const RingHoverContext = createContext<RingHoverContextValue | null>(null)
export function RingProvider({
  children,
  value,
}: {
  children: ReactNode
  value: RingContextValue
}) {
  const stable = useMemo<RingStableContextValue>(
    () => ({
      data: value.data,
      size: value.size,
      center: value.center,
      strokeWidth: value.strokeWidth,
      ringGap: value.ringGap,
      baseInnerRadius: value.baseInnerRadius,
      animationKey: value.animationKey,
      isLoaded: value.isLoaded,
      enterTransition: value.enterTransition,
      enterStaggerScale: value.enterStaggerScale,
      containerRef: value.containerRef,
      totalValue: value.totalValue,
      getColor: value.getColor,
      getRingRadii: value.getRingRadii,
      startAngle: value.startAngle,
      endAngle: value.endAngle,
      geometryScrubbing: value.geometryScrubbing,
    }),
    [
      value.data,
      value.size,
      value.center,
      value.strokeWidth,
      value.ringGap,
      value.baseInnerRadius,
      value.animationKey,
      value.isLoaded,
      value.enterTransition,
      value.enterStaggerScale,
      value.containerRef,
      value.totalValue,
      value.getColor,
      value.getRingRadii,
      value.startAngle,
      value.endAngle,
      value.geometryScrubbing,
    ]
  )
  const hover = useMemo<RingHoverContextValue>(
    () => ({
      hoveredIndex: value.hoveredIndex,
      setHoveredIndex: value.setHoveredIndex,
    }),
    [value.hoveredIndex, value.setHoveredIndex]
  )
  return (
    <RingStableContext.Provider value={stable}>
      <RingHoverContext.Provider value={hover}>
        {children}
      </RingHoverContext.Provider>
    </RingStableContext.Provider>
  )
}
export function useRingStable(): RingStableContextValue {
  const context = useContext(RingStableContext)
  if (!context) {
    throw new Error(
      "useRingStable must be used within a RingProvider. " +
        "Make sure your component is wrapped in <RingChart>."
    )
  }
  return context
}
export function useRingHover(): RingHoverContextValue {
  const context = useContext(RingHoverContext)
  if (!context) {
    throw new Error(
      "useRingHover must be used within a RingProvider. " +
        "Make sure your component is wrapped in <RingChart>."
    )
  }
  return context
}
export function useRing(): RingContextValue {
  return { ...useRingStable(), ...useRingHover() }
}
export default RingStableContext
