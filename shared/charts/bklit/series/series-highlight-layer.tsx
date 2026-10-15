"use client"

import type { RefObject } from "react"
import { useChartStable } from "../core/chart-context"
import { HighlightSegment } from "./highlight-segment"
import { useHighlightSegment } from "../hooks/use-highlight-segment"

interface SeriesHighlightLayerProps {
  enabled: boolean
  height: number
  pathRef: RefObject<SVGPathElement | null>
  stroke: string
  strokeWidth: number
}

export function SeriesHighlightLayer({
  enabled,
  height,
  pathRef,
  stroke,
  strokeWidth,
}: SeriesHighlightLayerProps) {
  const { isLoaded } = useChartStable()
  const { xSpring, widthSpring, isActive } = useHighlightSegment({ enabled })
  return (
    <HighlightSegment
      height={height}
      pathRef={pathRef}
      stroke={stroke}
      strokeWidth={strokeWidth}
      visible={enabled && isActive && isLoaded}
      width={widthSpring}
      x={xSpring}
    />
  )
}

SeriesHighlightLayer.displayName = "SeriesHighlightLayer"

export default SeriesHighlightLayer
