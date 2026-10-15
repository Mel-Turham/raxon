"use client"

import { useSpring } from "motion/react"
import { useMemo, useRef } from "react"
import { useChartConfig } from "../core/chart-config-context"
import { useChartHover, useChartStable } from "../core/chart-context"
import {
  computeSegmentBounds,
  INACTIVE_SEGMENT,
} from "../utils/highlight-segment-bounds"

export interface HighlightSegmentResult {
  xSpring: ReturnType<typeof useSpring>
  widthSpring: ReturnType<typeof useSpring>
  isActive: boolean
}

export function useHighlightSegment({
  enabled = true,
}: {
  enabled?: boolean
} = {}): HighlightSegmentResult {
  const { data, xScale, xAccessor } = useChartStable()
  const { tooltipData, selection } = useChartHover()
  const { highlightSpring } = useChartConfig()

  const bounds = useMemo(
    () =>
      enabled
        ? computeSegmentBounds(data, xScale, xAccessor, tooltipData, selection)
        : INACTIVE_SEGMENT,
    [enabled, data, xScale, xAccessor, tooltipData, selection]
  )

  const xSpring = useSpring(0, highlightSpring)
  const widthSpring = useSpring(0, highlightSpring)

  const wasActive = useRef(false)
  if (bounds.isActive && !wasActive.current) {
    xSpring.jump(bounds.x)
    widthSpring.jump(bounds.width)
  } else {
    xSpring.set(bounds.x)
    widthSpring.set(bounds.width)
  }
  wasActive.current = bounds.isActive

  return { xSpring, widthSpring, isActive: bounds.isActive }
}
