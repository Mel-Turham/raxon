"use client"

import { motion, useSpring } from "motion/react"
import { useEffect } from "react"
import { type SpringConfig, useChartConfig } from "../core/chart-config-context"
import { chartCssVars } from "../core/chart-context"
import {
  type IndicatorFadeEdges,
  indicatorFadeGradientStops,
  resolveVerticalFadeSides,
} from "../utils/indicator-fade"

export type IndicatorWidth = number | "line" | "thin" | "medium" | "thick"

export interface TooltipIndicatorProps {
  x: number

  height: number

  visible: boolean

  width?: IndicatorWidth

  span?: number

  columnWidth?: number

  colorEdge?: string

  colorMid?: string

  fadeEdges?: IndicatorFadeEdges | boolean

  fadeLength?: number

  animate?: boolean

  gradientId?: string

  springConfig?: SpringConfig

  strokeDasharray?: string
}

function resolveWidth(width: IndicatorWidth): number {
  if (typeof width === "number") {
    return width
  }
  switch (width) {
    case "line":
      return 1
    case "thin":
      return 2
    case "medium":
      return 4
    case "thick":
      return 8
    default:
      return 1
  }
}

export function TooltipIndicator(props: TooltipIndicatorProps) {
  if (!props.visible) {
    return null
  }
  return <TooltipIndicatorInner {...props} />
}

function TooltipIndicatorInner({
  x,
  visible,
  height,
  width = "line",
  span,
  columnWidth,
  colorEdge = chartCssVars.crosshair,
  colorMid = chartCssVars.crosshair,
  fadeEdges = "both",
  fadeLength = 10,
  animate = true,
  gradientId = "tooltip-indicator-gradient",
  springConfig,
  strokeDasharray,
}: TooltipIndicatorProps) {
  const { tooltipSpring } = useChartConfig()
  const effectiveSpring = springConfig ?? tooltipSpring

  const pixelWidth =
    span !== undefined && columnWidth !== undefined
      ? span * columnWidth
      : resolveWidth(width)

  const rectX = x - pixelWidth / 2
  const lineX = x
  const animatedX = useSpring(rectX, effectiveSpring)
  const animatedLineX = useSpring(lineX, effectiveSpring)

  if (animate) {
    animatedX.set(rectX)
    animatedLineX.set(lineX)
  }

  useEffect(() => {
    animatedX.set(rectX)
    animatedLineX.set(lineX)
  }, [animatedLineX, animatedX, lineX, rectX, visible])

  const indicatorFill = colorMid || colorEdge
  const fadeSides = resolveVerticalFadeSides(fadeEdges)
  const dashed = Boolean(strokeDasharray)

  if (dashed) {
    const strokeWidth = Math.max(1, pixelWidth)
    return animate ? (
      <motion.line
        stroke={indicatorFill}
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
        x1={animatedLineX}
        x2={animatedLineX}
        y1={0}
        y2={height}
      />
    ) : (
      <line
        stroke={indicatorFill}
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
        x1={lineX}
        x2={lineX}
        y1={0}
        y2={height}
      />
    )
  }

  if (!fadeSides.any) {
    return animate ? (
      <motion.rect
        fill={indicatorFill}
        height={height}
        width={pixelWidth}
        x={animatedX}
        y={0}
      />
    ) : (
      <rect
        fill={indicatorFill}
        height={height}
        width={pixelWidth}
        x={rectX}
        y={0}
      />
    )
  }

  const fadeStops = indicatorFadeGradientStops(fadeSides, fadeLength)

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          {fadeStops.map((stop) => (
            <stop
              key={stop.offset}
              offset={stop.offset}
              style={{ stopColor: indicatorFill, stopOpacity: stop.opacity }}
            />
          ))}
        </linearGradient>
      </defs>
      {animate ? (
        <motion.rect
          fill={`url(#${gradientId})`}
          height={height}
          width={pixelWidth}
          x={animatedX}
          y={0}
        />
      ) : (
        <rect
          fill={`url(#${gradientId})`}
          height={height}
          width={pixelWidth}
          x={rectX}
          y={0}
        />
      )}
    </g>
  )
}

TooltipIndicator.displayName = "TooltipIndicator"

export default TooltipIndicator
