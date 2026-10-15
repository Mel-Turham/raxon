"use client"

import { curveNatural } from "@visx/curve"
import { useMemo } from "react"
import type { Margin } from "../core/chart-context"
import type { LoadingStyle } from "../core/chart-phase"
import {
  DEFAULT_SKELETON_DATA_KEY,
  DEFAULT_SKELETON_POINT_COUNT,
  generateChartSkeletonData,
} from "../utils/generate-chart-skeleton-data"
import { Grid } from "../axes/grid"
import { Line } from "./line"
import { LineChart } from "./line-chart"

const LOADING_DATA_KEY = DEFAULT_SKELETON_DATA_KEY
const DEFAULT_LOADING_STROKE = "var(--foreground)"
const DEFAULT_LOADING_GRID_STROKE =
  "color-mix(in oklch, var(--chart-grid) 50%, transparent)"
const DEFAULT_LOADING_GRID_SHIMMER_STROKE =
  "color-mix(in oklch, var(--foreground) 68%, transparent)"
const DEFAULT_LOADING_STROKE_OPACITY = 0.5

export interface LineChartLoadingProps {
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

export function LineChartLoading({
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
}: LineChartLoadingProps) {
  const data = useMemo(
    () =>
      generateChartSkeletonData({
        dataKey: DEFAULT_SKELETON_DATA_KEY,
        pointCount: DEFAULT_SKELETON_POINT_COUNT,
      }),
    []
  )

  return (
    <LineChart
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
      <Line
        curve={curveNatural}
        dataKey={LOADING_DATA_KEY}
        fadeEdges={false}
        loadingStroke={stroke}
        loadingStrokeOpacity={strokeOpacity}
        loadingStyle={loadingStyle}
        showHighlight={false}
        stroke="transparent"
        strokeWidth={2.5}
      />
    </LineChart>
  )
}

export default LineChartLoading
