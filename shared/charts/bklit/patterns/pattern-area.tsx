"use client"

import { curveMonotoneX } from "@visx/curve"
import { AreaClosed } from "@visx/shape"
import type { CurveFactory } from "@visx/vendor/d3-shape"

import { useChartStable } from "../core/chart-context"

export interface PatternAreaProps {
  dataKey: string

  fill: string

  curve?: CurveFactory

  animate?: boolean
}

export function PatternArea({
  dataKey,
  fill,
  curve = curveMonotoneX,
}: PatternAreaProps) {
  const { renderData, xScale, yScale, xAccessor } = useChartStable()

  return (
    <AreaClosed
      curve={curve}
      data={renderData}
      fill={fill}
      x={(d) => xScale(xAccessor(d)) ?? 0}
      y={(d) => {
        const v = d[dataKey]
        return typeof v === "number" ? (yScale(v) ?? 0) : 0
      }}
      yScale={yScale}
    />
  )
}

PatternArea.displayName = "PatternArea"

export default PatternArea
