"use client"

import { memo, useMemo } from "react"
import { DashTailStroke } from "./dash-tail-stroke"
import {
  resolveDashStartX,
  resolveDashTailBounds,
} from "../utils/path-stroke-utils"

interface SeriesDashTailOverlayProps {
  dashFromIndex?: number
  dashArray: string
  data: Record<string, unknown>[]
  pathD: string | null
  pathLength: number
  innerWidth: number
  innerHeight: number
  stroke: string
  strokeWidth: number
  xScale: (value: Date | number) => number | undefined
  xAccessor: (datum: Record<string, unknown>) => Date | number
}

function SeriesDashTailOverlayImpl({
  dashFromIndex,
  dashArray,
  data,
  pathD,
  pathLength,
  innerWidth,
  innerHeight,
  stroke,
  strokeWidth,
  xScale,
  xAccessor,
}: SeriesDashTailOverlayProps) {
  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length)

  const dashStartX = useMemo(() => {
    if (!hasDashTail || dashFromIndex == null) {
      return 0
    }
    return resolveDashStartX(data, dashFromIndex, xScale, xAccessor)
  }, [hasDashTail, dashFromIndex, data, xScale, xAccessor])

  const dashStartLength = useMemo(() => {
    if (!hasDashTail || dashFromIndex == null || pathLength <= 0) {
      return 0
    }
    return (dashFromIndex / Math.max(1, data.length - 1)) * pathLength
  }, [hasDashTail, dashFromIndex, data.length, pathLength])

  if (!hasDashTail || dashFromIndex == null || pathLength <= 0) {
    return null
  }

  return (
    <DashTailStroke
      dashArray={dashArray}
      dashStartLength={dashStartLength}
      dashStartX={dashStartX}
      innerHeight={innerHeight}
      innerWidth={innerWidth}
      pathD={pathD}
      pathLength={pathLength}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

export const SeriesDashTailOverlay = memo(SeriesDashTailOverlayImpl)
