"use client"

import { Group } from "@visx/group"
import { ParentSize } from "@visx/responsive"
import { scaleLinear } from "@visx/scale"
import type { Transition } from "motion/react"
import { type ReactNode, useCallback, useState } from "react"
import { cn } from "@/shared/lib/utils"
import {
  defaultRadarColors,
  type RadarContextValue,
  type RadarData,
  type RadarMetric,
  RadarProvider,
} from "./radar-context"

export interface RadarChartProps {
  data: RadarData[]
  metrics: RadarMetric[]
  size?: number
  levels?: number
  margin?: number
  animate?: boolean
  enterDurationMs?: number
  staggerScale?: number
  enterTransition?: Transition
  motionReplayKey?: string
  hoveredIndex?: number | null
  onHoverChange?: (index: number | null) => void
  className?: string
  children: ReactNode
}

interface RadarChartInnerProps {
  width: number
  height: number
  data: RadarData[]
  metrics: RadarMetric[]
  levels: number
  margin: number
  animate: boolean
  enterDurationMs: number
  staggerScale: number
  enterTransition?: Transition
  motionReplayKey: string
  children: ReactNode
  hoveredIndexProp?: number | null
  onHoverChange?: (index: number | null) => void
}

function RadarChartInner({
  width,
  height,
  data,
  metrics,
  levels,
  margin,
  animate,
  enterDurationMs,
  staggerScale,
  enterTransition,
  motionReplayKey,
  children,
  hoveredIndexProp,
  onHoverChange,
}: RadarChartInnerProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null)

  const isControlled = hoveredIndexProp !== undefined
  const hoveredIndex = isControlled ? hoveredIndexProp : internalHoveredIndex
  const setHoveredIndex = useCallback(
    (index: number | null) => {
      if (isControlled) {
        onHoverChange?.(index)
      } else {
        setInternalHoveredIndex(index)
      }
    },
    [isControlled, onHoverChange]
  )

  const size = Math.min(width, height)
  const radius = (size - margin * 2) / 2

  const yScale = useCallback(
    (value: number) => {
      const scale = scaleLinear<number>({
        range: [0, radius],
        domain: [0, 100],
      })
      return scale(value) ?? 0
    },
    [radius]
  )

  const getAngle = useCallback(
    (metricIndex: number) => {
      const step = (Math.PI * 2) / metrics.length
      const angleOffset = -Math.PI / 2
      return metricIndex * step + angleOffset
    },
    [metrics.length]
  )

  const getPointPosition = useCallback(
    (metricIndex: number, value: number) => {
      const angle = getAngle(metricIndex)
      const r = yScale(value)
      return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle),
      }
    },
    [getAngle, yScale]
  )

  const getColor = useCallback(
    (index: number) => {
      const item = data[index]
      if (item?.color) {
        return item.color
      }
      return defaultRadarColors[index % defaultRadarColors.length] as string
    },
    [data]
  )

  if (size < 10) {
    return null
  }

  const contextValue: RadarContextValue = {
    data,
    metrics,
    size,
    radius,
    levels,
    hoveredIndex,
    setHoveredIndex,
    animate,
    enterDurationMs,
    staggerScale,
    enterTransition,
    motionReplayKey,
    getColor,
    getAngle,
    getPointPosition,
    yScale,
  }

  return (
    <RadarProvider value={contextValue}>
      <svg
        aria-hidden="true"
        height={size}
        style={{ overflow: "visible" }}
        width={size}
      >
        <Group left={size / 2} top={size / 2}>
          {children}
        </Group>
      </svg>
    </RadarProvider>
  )
}

export function RadarChart({
  data,
  metrics,
  size: fixedSize,
  levels = 5,
  margin = 60,
  animate = true,
  enterDurationMs = 1100,
  staggerScale = 1,
  enterTransition,
  motionReplayKey = "",
  className = "",
  hoveredIndex,
  onHoverChange,
  children,
}: RadarChartProps) {
  if (fixedSize) {
    return (
      <div
        className={cn("relative flex items-center justify-center", className)}
        style={{ width: fixedSize, height: fixedSize }}
      >
        <RadarChartInner
          animate={animate}
          data={data}
          enterDurationMs={enterDurationMs}
          enterTransition={enterTransition}
          height={fixedSize}
          hoveredIndexProp={hoveredIndex}
          levels={levels}
          margin={margin}
          metrics={metrics}
          motionReplayKey={motionReplayKey}
          onHoverChange={onHoverChange}
          staggerScale={staggerScale}
          width={fixedSize}
        >
          {children}
        </RadarChartInner>
      </div>
    )
  }

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <RadarChartInner
            animate={animate}
            data={data}
            enterDurationMs={enterDurationMs}
            enterTransition={enterTransition}
            height={height}
            hoveredIndexProp={hoveredIndex}
            levels={levels}
            margin={margin}
            metrics={metrics}
            motionReplayKey={motionReplayKey}
            onHoverChange={onHoverChange}
            staggerScale={staggerScale}
            width={width}
          >
            {children}
          </RadarChartInner>
        )}
      </ParentSize>
    </div>
  )
}

export default RadarChart
