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
import { usePieHover, usePieStable } from "./pie-context"

export interface PieCenterProps {
  defaultLabel?: string
  formatOptions?: ChartStatFlowFormat
  children?: (props: {
    value: number
    label: string
    isHovered: boolean
    data: { label: string; value: number; color?: string; fill?: string }
  }) => ReactNode
  className?: string
  valueClassName?: string
  labelClassName?: string
  prefix?: string
  suffix?: string
}

export function PieCenter({
  defaultLabel = "Total",
  formatOptions = defaultChartStatFlowFormat,
  children,
  className = "",
  valueClassName = chartCenterValueClassName,
  labelClassName = chartCenterLabelClassName,
  prefix,
  suffix,
}: PieCenterProps) {
  const { data, totalValue, innerRadius, geometryScrubbing } = usePieStable()
  const { hoveredIndex } = usePieHover()

  const effectiveHoveredIndex = geometryScrubbing ? null : hoveredIndex
  const hoveredData =
    effectiveHoveredIndex === null ? null : data[effectiveHoveredIndex]
  const displayValue = hoveredData ? hoveredData.value : totalValue
  const displayLabel = hoveredData ? hoveredData.label : defaultLabel

  const centerSize = innerRadius * 2 - 16

  if (innerRadius <= 0) {
    return null
  }

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
          isHovered: effectiveHoveredIndex !== null,
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

PieCenter.displayName = "PieCenter"

export default PieCenter
