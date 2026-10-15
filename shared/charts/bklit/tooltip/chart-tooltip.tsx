"use client"

import { motion, useSpring } from "motion/react"
import { memo, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
  resolveTooltipBoxMotion,
  type SpringConfig,
  useChartConfig,
} from "../core/chart-config-context"
import {
  chartCssVars,
  type LineConfig,
  useChart,
  useChartStable,
} from "../core/chart-context"
import { weekdayDateFmt } from "../utils/chart-formatters"
import type { IndicatorFadeEdges } from "../utils/indicator-fade"
import { DateTicker } from "./date-ticker"
import { TooltipBox } from "./tooltip-box"
import { TooltipContent, type TooltipRow } from "./tooltip-content"
import { TooltipDot } from "./tooltip-dot"
import { TooltipIndicator } from "./tooltip-indicator"

export interface ChartTooltipProps {
  showDatePill?: boolean

  showCrosshair?: boolean

  showDots?: boolean

  dotVariant?: "dot" | "ring"

  dotSize?: number

  dotRadiusFraction?: number

  dotScale?: number

  dotStrokeWidth?: number

  indicatorColor?: string | ((point: Record<string, unknown>) => string)

  content?: (props: {
    point: Record<string, unknown>
    index: number
  }) => React.ReactNode

  rows?: (point: Record<string, unknown>) => TooltipRow[]

  dotColor?:
    string | ((point: Record<string, unknown>, line: LineConfig) => string)

  children?: React.ReactNode

  className?: string

  springConfig?: SpringConfig

  matchCrosshair?: boolean

  damping?: number

  indicatorDasharray?: string

  indicatorFadeEdges?: IndicatorFadeEdges

  indicatorFadeLength?: number

  boxSpringConfig?: SpringConfig

  panelStyle?: React.CSSProperties

  backgroundColor?: string
}

interface ChartTooltipInnerProps extends ChartTooltipProps {
  container: HTMLElement
}

const ChartTooltipInner = memo(function ChartTooltipInner({
  showDatePill = true,
  showCrosshair = true,
  showDots = true,
  dotVariant = "dot",
  dotSize = 5,
  dotRadiusFraction,
  dotScale = 1,
  dotStrokeWidth,
  indicatorColor: indicatorColorProp,
  content,
  rows: rowsRenderer,
  dotColor: dotColorProp,
  children,
  className = "",
  container,
  springConfig,
  matchCrosshair = false,
  damping,
  indicatorDasharray,
  indicatorFadeEdges,
  indicatorFadeLength,
  boxSpringConfig,
  panelStyle,
  backgroundColor,
}: ChartTooltipInnerProps) {
  const {
    tooltipData,
    width,
    height,
    innerHeight,
    margin,
    columnWidth,
    lines,
    xAccessor,
    dateLabels,
    containerRef,
    orientation,
    barXAccessor,
    bandWidth,
    squareSnap,
  } = useChart()
  const { tooltipSpring } = useChartConfig()

  const isHorizontal = orientation === "horizontal"
  const discreteInteraction = dateLabels.length > 60

  const resolvedDotSize = useMemo(() => {
    if (dotVariant !== "ring" || !bandWidth || lines.length === 0) {
      return dotSize * dotScale
    }
    const seriesCount = lines.length
    const gap = squareSnap?.groupGap ?? (seriesCount > 1 ? 4 : 0)
    const squareSize = (bandWidth - gap * (seriesCount - 1)) / seriesCount
    return (squareSize / 2) * dotScale
  }, [
    bandWidth,
    dotScale,
    dotSize,
    dotVariant,
    lines.length,
    squareSnap?.groupGap,
  ])
  const boxMotion = useMemo(() => {
    if (boxSpringConfig) {
      return {
        animate: !discreteInteraction,
        springConfig: boxSpringConfig,
      }
    }
    if (matchCrosshair) {
      return {
        animate: !discreteInteraction,
        springConfig: springConfig ?? tooltipSpring,
      }
    }
    return resolveTooltipBoxMotion(damping)
  }, [
    boxSpringConfig,
    damping,
    discreteInteraction,
    matchCrosshair,
    springConfig,
    tooltipSpring,
  ])

  const visible = tooltipData !== null
  const x = tooltipData?.x ?? 0
  const xWithMargin = x + margin.left

  const firstLineDataKey = lines[0]?.dataKey
  const firstLineY = firstLineDataKey
    ? (tooltipData?.yPositions[firstLineDataKey] ?? 0)
    : 0
  const yWithMargin = firstLineY + margin.top

  const tooltipRows = useMemo(() => {
    if (!tooltipData) {
      return []
    }

    if (rowsRenderer) {
      return rowsRenderer(tooltipData.point)
    }

    return lines.map((line) => ({
      color: line.stroke,
      label: line.dataKey,
      value: (tooltipData.point[line.dataKey] as number) ?? 0,
    }))
  }, [tooltipData, lines, rowsRenderer])

  const resolveDotColor = useMemo(() => {
    return (line: LineConfig, index: number): string => {
      if (rowsRenderer && tooltipRows[index]?.color) {
        return tooltipRows[index].color
      }
      if (dotColorProp != null) {
        if (typeof dotColorProp === "function" && tooltipData) {
          return dotColorProp(tooltipData.point, line)
        }
        if (typeof dotColorProp === "string") {
          return dotColorProp
        }
      }
      return line.stroke
    }
  }, [dotColorProp, rowsRenderer, tooltipData, tooltipRows])

  const indicatorColor = useMemo(() => {
    if (indicatorColorProp == null) {
      return chartCssVars.crosshair
    }
    if (typeof indicatorColorProp === "function") {
      return tooltipData
        ? indicatorColorProp(tooltipData.point)
        : chartCssVars.crosshair
    }
    return indicatorColorProp
  }, [indicatorColorProp, tooltipData])

  const title = useMemo(() => {
    if (!tooltipData) {
      return undefined
    }

    if (barXAccessor) {
      return barXAccessor(tooltipData.point)
    }

    return weekdayDateFmt.format(xAccessor(tooltipData.point))
  }, [tooltipData, barXAccessor, xAccessor])

  const tooltipContent = (
    <>
      {showCrosshair && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          height="100%"
          width="100%"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <TooltipIndicator
              animate={!discreteInteraction}
              colorEdge={indicatorColor}
              colorMid={indicatorColor}
              columnWidth={columnWidth}
              fadeEdges={
                indicatorDasharray ? "none" : (indicatorFadeEdges ?? "both")
              }
              fadeLength={indicatorFadeLength}
              height={innerHeight}
              springConfig={springConfig}
              strokeDasharray={indicatorDasharray}
              visible={visible}
              width="line"
              x={x}
            />
          </g>
        </svg>
      )}

      {showDots && visible && !isHorizontal && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          height="100%"
          width="100%"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {lines.map((line, index) => (
              <TooltipDot
                color={resolveDotColor(line, index)}
                cornerRadiusFraction={
                  dotVariant === "ring" ? dotRadiusFraction : undefined
                }
                key={line.dataKey}
                size={resolvedDotSize}
                springConfig={springConfig}
                strokeColor={chartCssVars.background}
                strokeWidth={dotVariant === "ring" ? dotStrokeWidth : undefined}
                variant={dotVariant}
                visible={visible}
                x={tooltipData?.xPositions?.[line.dataKey] ?? x}
                y={tooltipData?.yPositions[line.dataKey] ?? 0}
              />
            ))}
          </g>
        </svg>
      )}

      <TooltipBox
        animate={boxMotion.animate}
        backgroundColor={backgroundColor}
        className={className}
        containerHeight={height}
        containerRef={containerRef}
        containerWidth={width}
        panelStyle={panelStyle}
        springConfig={boxMotion.springConfig}
        top={isHorizontal ? undefined : margin.top}
        visible={visible}
        x={xWithMargin}
        y={isHorizontal ? yWithMargin : margin.top}
      >
        {content && tooltipData
          ? content({
              point: tooltipData.point,
              index: tooltipData.index,
            })
          : !content && (
              <TooltipContent rows={tooltipRows} title={title}>
                {children}
              </TooltipContent>
            )}
      </TooltipBox>

      <DatePillTracker
        currentIndex={tooltipData?.index ?? 0}
        discreteInteraction={discreteInteraction}
        enabled={showDatePill && !isHorizontal}
        labels={dateLabels}
        springConfig={springConfig}
        visible={visible}
        xWithMargin={xWithMargin}
      />
    </>
  )

  return createPortal(tooltipContent, container)
})

export function ChartTooltip(props: ChartTooltipProps) {
  const { containerRef } = useChartStable()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const container = containerRef.current
  if (!(mounted && container)) {
    return null
  }

  return <ChartTooltipInner {...props} container={container} />
}

ChartTooltip.displayName = "ChartTooltip"

interface DatePillTrackerProps {
  enabled: boolean
  visible: boolean
  labels: string[]
  currentIndex: number
  xWithMargin: number
  discreteInteraction: boolean
  springConfig?: SpringConfig
}

function DatePillTracker(props: DatePillTrackerProps) {
  if (!(props.enabled && props.visible && props.labels.length > 0)) {
    return null
  }
  return <DatePillTrackerInner {...props} />
}

function DatePillTrackerInner({
  labels,
  currentIndex,
  xWithMargin,
  discreteInteraction,
  springConfig,
  visible,
}: DatePillTrackerProps) {
  const { tooltipSpring } = useChartConfig()
  const effectiveSpring = springConfig ?? tooltipSpring
  const animatedX = useSpring(xWithMargin, effectiveSpring)

  if (!discreteInteraction) {
    animatedX.set(xWithMargin)
  }

  useEffect(() => {
    animatedX.set(xWithMargin)
  }, [animatedX, visible, xWithMargin])

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{
        left: discreteInteraction ? xWithMargin : animatedX,
        transform: "translateX(-50%)",
        bottom: 4,
      }}
    >
      <DateTicker
        currentIndex={currentIndex}
        labels={labels}
        visible={visible}
      />
    </motion.div>
  )
}

export default ChartTooltip
