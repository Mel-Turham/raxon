"use client"

import { curveNatural } from "@visx/curve"
import { useMemo } from "react"
import { Area } from "./area"
import { AreaChart } from "./area-chart"
import type { Margin } from "../core/chart-context"
import type { LoadingStyle } from "../core/chart-phase"
import {
  DEFAULT_SKELETON_DATA_KEY,
  DEFAULT_SKELETON_POINT_COUNT,
  generateChartSkeletonData,
} from "../utils/generate-chart-skeleton-data"
import { Grid } from "../axes/grid"

const LOADING_DATA_KEY = DEFAULT_SKELETON_DATA_KEY
const DEFAULT_LOADING_STROKE = "var(--foreground)"
const DEFAULT_LOADING_GRID_STROKE =
  "color-mix(in oklch, var(--chart-grid) 50%, transparent)"
const DEFAULT_LOADING_GRID_SHIMMER_STROKE =
  "color-mix(in oklch, var(--foreground) 68%, transparent)"
const DEFAULT_LOADING_STROKE_OPACITY = 0.5

export interface AreaChartLoadingProps {
  margin?: Partial<Margin>

  stroke?: string

  strokeOpacity?: number

  gridStroke?: string

  gridShimmerStroke?: string

  gridShimmer?: boolean

  gridShimmerLength?: number

  gridShimmerSpeed?: number

  gridShimmerSync?: boolean

  loadingStyle?: LoadingStyle

  label?: string

  aspectRatio?: string

  className?: string
}

export function AreaChartLoading({
  margin,
  stroke = DEFAULT_LOADING_STROKE,
  strokeOpacity = DEFAULT_LOADING_STROKE_OPACITY,
  gridStroke = DEFAULT_LOADING_GRID_STROKE,
  gridShimmerStroke = DEFAULT_LOADING_GRID_SHIMMER_STROKE,
  gridShimmer = true,
  gridShimmerLength,
  gridShimmerSpeed,
  gridShimmerSync = false,
  loadingStyle = "pulse",
  label = "Loading",
  aspectRatio = "2 / 1",
  className = "",
}: AreaChartLoadingProps) {
  const data = useMemo(
    () =>
      generateChartSkeletonData({
        dataKey: DEFAULT_SKELETON_DATA_KEY,
        pointCount: DEFAULT_SKELETON_POINT_COUNT,
      }),
    []
  )

  return (
    <AreaChart
      animationDuration={0}
      aspectRatio={aspectRatio}
      className={className}
      data={data}
      loadingLabel={label}
      margin={margin}
      status="loading"
    >
      <Grid
        horizontal
        shimmer={loadingStyle === "sweep" ? false : gridShimmer}
        shimmerLength={gridShimmerLength}
        shimmerSpeed={gridShimmerSpeed}
        shimmerStroke={gridShimmerStroke}
        shimmerSync={gridShimmerSync}
        stroke={gridStroke}
      />
      <Area
        curve={curveNatural}
        dataKey={LOADING_DATA_KEY}
        fadeEdges={false}
        fill="transparent"
        fillOpacity={0}
        loading
        loadingStroke={stroke}
        loadingStrokeOpacity={strokeOpacity}
        loadingStyle={loadingStyle}
        showHighlight={false}
        showLine
        stroke="transparent"
        strokeWidth={2}
      />
    </AreaChart>
  )
}

export default AreaChartLoading
