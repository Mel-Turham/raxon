"use client"
import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"
import {
  chartCenterContainerClassName,
  chartCenterLabelClassName,
  chartCenterValueClassName,
} from "../utils/chart-center-typography"
import {
  ChartStatFlow,
  type ChartStatFlowFormat,
  defaultChartStatFlowFormat,
} from "../core/chart-stat-flow"
import { useRingHover, useRingStable } from "./ring-context"
export interface RingCenterProps {
  defaultLabel?: string
  formatOptions?: ChartStatFlowFormat
  children?: (props: {
    value: number
    label: string
    isHovered: boolean
    data: {
      label: string
      value: number
      maxValue: number
      color?: string
    }
  }) => ReactNode
  className?: string
  valueClassName?: string
  labelClassName?: string
  prefix?: string
  suffix?: string
}
export function RingCenter({
  defaultLabel = "Total",
  formatOptions = defaultChartStatFlowFormat,
  children,
  className = "",
  valueClassName = chartCenterValueClassName,
  labelClassName = chartCenterLabelClassName,
  prefix,
  suffix,
}: RingCenterProps) {
  const { data, totalValue, baseInnerRadius } = useRingStable()
  const { hoveredIndex } = useRingHover()
  const hoveredData = hoveredIndex === null ? null : data[hoveredIndex]
  const displayValue = hoveredData ? hoveredData.value : totalValue
  const displayLabel = hoveredData ? hoveredData.label : defaultLabel
  const centerSize = baseInnerRadius * 2 - 16
  if (children && hoveredData) {
    return (
      <div
        className={cn(
          chartCenterContainerClassName,
          "flex items-center justify-center",
          className
        )}
        style={{ width: centerSize, height: centerSize }}
      >
        {children({
          value: displayValue,
          label: displayLabel,
          isHovered: hoveredIndex !== null,
          data: hoveredData,
        })}
      </div>
    )
  }
  return (
    <div
      className={cn(
        chartCenterContainerClassName,
        "flex flex-col items-center justify-center text-center",
        className
      )}
      style={{ width: centerSize, height: centerSize }}
    >
      <ChartStatFlow
        formatOptions={formatOptions}
        label={displayLabel}
        labelClassName={labelClassName}
        prefix={prefix}
        suffix={suffix}
        value={displayValue}
        valueClassName={valueClassName}
      />
    </div>
  )
}
RingCenter.displayName = "RingCenter"
export default RingCenter
