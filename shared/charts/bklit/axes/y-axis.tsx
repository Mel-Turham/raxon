"use client"

import { memo, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useChartStable, useYScale } from "../core/chart-context"
import { DEFAULT_Y_DOMAIN_TWEEN_MS } from "../core/chart-phase"
import { LINE_LOADING_PULSE_EASE } from "../utils/line-loading-timing"
import { resolveReferenceDataRange } from "../utils/reference-area-geometry"
import type { YAxisOrientation } from "../utils/y-axis-scales"
import { normalizeYAxisId } from "../utils/y-axis-scales"
import {
  resolveYAxisTickCount,
  Y_AXIS_DEFAULT_TICK_COUNT,
} from "../utils/y-axis-ticks"

const Y_AXIS_POSITION_TWEEN_MS = DEFAULT_Y_DOMAIN_TWEEN_MS

export interface YAxisProps {
  yAxisId?: string | number

  orientation?: YAxisOrientation

  numTicks?: number

  formatLargeNumbers?: boolean

  formatValue?: (value: number) => string
}

function formatLabel(
  value: number,
  formatLargeNumbers: boolean,
  formatValue?: (value: number) => string
): string {
  if (formatValue) {
    return formatValue(value)
  }
  if (formatLargeNumbers && value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return String(value)
}

function resolveTickLabelColor(
  tickY: number,
  axisId: string,
  yScale: ReturnType<typeof useYScale>,
  referenceAreas: ReturnType<typeof useChartStable>["referenceAreas"]
): string | undefined {
  for (const area of referenceAreas) {
    if (!area.axisLabelColor) {
      continue
    }
    if (normalizeYAxisId(area.yAxisId) !== axisId) {
      continue
    }
    const [low, high] = resolveReferenceDataRange(
      area.y1,
      area.y2,
      yScale.domain() as [number, number]
    )
    const topPixel = yScale(high) ?? 0
    const bottomPixel = yScale(low) ?? 0
    const bandTop = Math.min(topPixel, bottomPixel)
    const bandBottom = Math.max(topPixel, bottomPixel)
    if (tickY >= bandTop && tickY <= bandBottom) {
      return area.axisLabelColor
    }
  }
  return undefined
}

export function YAxis(props: YAxisProps) {
  const { containerRef } = useChartStable()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const container = containerRef.current
  if (!(mounted && container)) {
    return null
  }

  return <YAxisInner {...props} container={container} />
}

const YAxisInner = memo(function YAxisInner({
  yAxisId,
  orientation = "left",
  numTicks = Y_AXIS_DEFAULT_TICK_COUNT,
  formatLargeNumbers = true,
  formatValue,
  container,
}: YAxisProps & { container: HTMLDivElement }) {
  const { margin, referenceAreas } = useChartStable()
  const yScale = useYScale(yAxisId)
  const isLeft = orientation === "left"
  const axisId = normalizeYAxisId(yAxisId)

  const ticks = useMemo(() => {
    const tickValues = yScale.ticks(resolveYAxisTickCount(numTicks))
    return tickValues.map((value) => {
      const y = (yScale(value) ?? 0) + margin.top
      return {
        value,
        y,
        label: formatLabel(value, formatLargeNumbers, formatValue),
        labelColor: resolveTickLabelColor(
          y - margin.top,
          axisId,
          yScale,
          referenceAreas
        ),
      }
    })
  }, [
    yScale,
    margin.top,
    numTicks,
    formatLargeNumbers,
    formatValue,
    axisId,
    referenceAreas,
  ])

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute top-0 bottom-0"
        style={
          isLeft
            ? { left: 0, width: margin.left }
            : { right: 0, width: margin.right }
        }
      >
        {ticks.map((tick) => (
          <div
            className="absolute flex items-center"
            key={tick.value}
            style={{
              top: tick.y,
              transform: "translateY(-50%)",
              transition: `top ${Y_AXIS_POSITION_TWEEN_MS}ms cubic-bezier(${LINE_LOADING_PULSE_EASE.join(", ")})`,
              ...(isLeft
                ? { right: 0, justifyContent: "flex-end", paddingRight: 8 }
                : { left: 0, justifyContent: "flex-start", paddingLeft: 8 }),
            }}
          >
            <span
              className="text-xs text-chart-label"
              style={tick.labelColor ? { color: tick.labelColor } : undefined}
            >
              {tick.label}
            </span>
          </div>
        ))}
      </div>
    </div>,
    container
  )
})

YAxis.displayName = "YAxis"

export default YAxis
