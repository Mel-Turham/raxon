"use client"
import { BarChart } from "./bar-chart"
import type { Margin } from "../core/chart-context"
const EMPTY_DATA: Record<string, unknown>[] = []
export interface BarChartLoadingProps {
  margin?: Partial<Margin>
  aspectRatio?: string
  className?: string
}
export function BarChartLoading({
  margin,
  aspectRatio = "2 / 1",
  className = "",
}: BarChartLoadingProps) {
  return (
    <BarChart
      aspectRatio={aspectRatio}
      className={className}
      data={EMPTY_DATA}
      margin={margin}
      status="loading"
    />
  )
}
export default BarChartLoading
