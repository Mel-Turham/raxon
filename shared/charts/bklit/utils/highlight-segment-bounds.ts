import type { TooltipData } from "../core/chart-context"
import type { ChartSelection } from "../hooks/use-chart-interaction"

export interface SegmentBounds {
  x: number
  width: number
  isActive: boolean
}

export const INACTIVE_SEGMENT: SegmentBounds = {
  x: 0,
  width: 0,
  isActive: false,
}

export function computeSegmentBounds(
  data: Record<string, unknown>[],
  xScale: (value: Date) => number | undefined,
  xAccessor: (d: Record<string, unknown>) => Date,
  tooltipData: Pick<TooltipData, "index"> | null | undefined,
  selection:
    Pick<ChartSelection, "active" | "startX" | "endX"> | null | undefined
): SegmentBounds {
  if (data.length === 0) {
    return INACTIVE_SEGMENT
  }

  if (selection?.active) {
    const x = Math.min(selection.startX, selection.endX)
    const width = Math.abs(selection.endX - selection.startX)
    return { x, width, isActive: true }
  }

  if (!tooltipData) {
    return INACTIVE_SEGMENT
  }

  const idx = tooltipData.index
  const startIdx = Math.max(0, idx - 1)
  const endIdx = Math.min(data.length - 1, idx + 1)
  const startPoint = data[startIdx]
  const endPoint = data[endIdx]
  if (!(startPoint && endPoint)) {
    return INACTIVE_SEGMENT
  }

  const startX = xScale(xAccessor(startPoint)) ?? 0
  const endX = xScale(xAccessor(endPoint)) ?? 0
  return { x: startX, width: Math.max(0, endX - startX), isActive: true }
}
