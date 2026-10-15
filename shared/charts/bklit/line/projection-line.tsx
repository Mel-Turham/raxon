"use client"

import type { CurveFactory } from "@visx/vendor/d3-shape"
import { curveLinear } from "@visx/curve"
import { LinePath } from "@visx/shape"
import { useCallback, useId, useMemo } from "react"
import { useChartStable, useYScale } from "../core/chart-context"
import {
  buildHorizontalTangentBezierPath,
  type ProjectionCurveKind,
  type ProjectionPoint,
} from "../utils/projection-utils"

export type ProjectionStrokeStyle = "solid" | "gradient"

export interface ProjectionLineProps {
  data: ProjectionPoint[]
  yAxisId?: string | number
  stroke?: string
  strokeStyle?: ProjectionStrokeStyle
  gradientStart?: string
  gradientEnd?: string
  strokeWidth?: number
  curveKind?: ProjectionCurveKind
  curve?: CurveFactory
  strokeDasharray?: string
  strokeOpacity?: number
  showEndMarker?: boolean
  showEndpoints?: boolean
  endpointRadius?: number
  className?: string
}

function resolveVisibleEndX(
  endX: number,
  innerWidth: number,
  endpointRadius: number,
  strokeWidth: number
): number {
  const edgePadding = endpointRadius + strokeWidth * 0.5 + 1
  return Math.min(endX, Math.max(0, innerWidth - edgePadding))
}

function renderProjectionStroke({
  bezierPath,
  curve,
  curveKind,
  data,
  getX,
  getY,
  linearPath,
  strokeProps,
}: {
  bezierPath: string | null
  curve: CurveFactory | undefined
  curveKind: ProjectionCurveKind
  data: ProjectionPoint[]
  getX: (point: ProjectionPoint) => number
  getY: (point: ProjectionPoint) => number
  linearPath: string | null
  strokeProps: {
    stroke: string
    strokeDasharray: string
    strokeLinecap: "round"
    strokeOpacity: number
    strokeWidth: number
  }
}) {
  if (curveKind === "bezier" && bezierPath) {
    return <path d={bezierPath} fill="none" {...strokeProps} />
  }
  if (curveKind === "linear" && linearPath) {
    return <path d={linearPath} fill="none" {...strokeProps} />
  }
  return (
    <LinePath
      curve={curve ?? curveLinear}
      data={data}
      {...strokeProps}
      x={getX}
      y={getY}
    />
  )
}

export function ProjectionLine({
  data,
  yAxisId,
  stroke = "var(--chart-3)",
  strokeStyle = "solid",
  gradientStart,
  gradientEnd = "var(--chart-5)",
  strokeWidth = 2,
  curveKind = "linear",
  curve,
  strokeDasharray = "6,4",
  strokeOpacity = 1,
  showEndMarker,
  showEndpoints,
  endpointRadius = 5,
  className,
}: ProjectionLineProps) {
  const { xScale, chartPhase, innerWidth } = useChartStable()
  const yScale = useYScale(yAxisId)
  const gradientId = useId().replace(/:/g, "")
  const showMarker = showEndMarker ?? showEndpoints ?? true
  const resolvedGradientStart = gradientStart ?? stroke

  const getX = useCallback(
    (point: ProjectionPoint) => xScale(point.date) ?? 0,
    [xScale]
  )
  const getY = useCallback(
    (point: ProjectionPoint) => yScale(point.value) ?? 0,
    [yScale]
  )

  const startPoint = data[0]
  const endPoint = data.at(-1)

  const geometry = useMemo(() => {
    if (!(startPoint && endPoint)) {
      return null
    }
    const startX = getX(startPoint)
    const startY = getY(startPoint)
    const endX = getX(endPoint)
    const endY = getY(endPoint)
    const visibleEndX = resolveVisibleEndX(
      endX,
      innerWidth,
      showMarker ? endpointRadius : 0,
      strokeWidth
    )
    return { startX, startY, visibleEndX, endY }
  }, [
    endPoint,
    endpointRadius,
    getX,
    getY,
    innerWidth,
    showMarker,
    startPoint,
    strokeWidth,
  ])

  const bezierPath = useMemo(() => {
    if (curveKind !== "bezier" || !geometry) {
      return null
    }
    return buildHorizontalTangentBezierPath(
      geometry.startX,
      geometry.startY,
      geometry.visibleEndX,
      geometry.endY
    )
  }, [curveKind, geometry])

  const linearPath = useMemo(() => {
    if (curveKind !== "linear" || !geometry) {
      return null
    }
    return `M ${geometry.startX},${geometry.startY} L ${geometry.visibleEndX},${geometry.endY}`
  }, [curveKind, geometry])

  const showStroke =
    chartPhase === "revealing" ||
    chartPhase === "ready" ||
    chartPhase === "exitingReady"

  if (data.length < 2 || !geometry) {
    return null
  }

  const resolvedStroke =
    strokeStyle === "gradient" && geometry ? `url(#${gradientId})` : stroke
  const strokeProps = {
    stroke: showStroke ? resolvedStroke : "transparent",
    strokeDasharray,
    strokeLinecap: "round" as const,
    strokeOpacity,
    strokeWidth,
  }

  return (
    <g className={className ?? "chart-projection-line"}>
      {strokeStyle === "gradient" && geometry ? (
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={gradientId}
            x1={geometry.startX}
            x2={geometry.visibleEndX}
            y1={geometry.startY}
            y2={geometry.endY}
          >
            <stop offset="0%" stopColor={resolvedGradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
      ) : null}
      {renderProjectionStroke({
        bezierPath,
        curve,
        curveKind,
        data,
        getX,
        getY,
        linearPath,
        strokeProps,
      })}
    </g>
  )
}

ProjectionLine.displayName = "ProjectionLine"

export default ProjectionLine
