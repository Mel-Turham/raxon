"use client"
import { localPoint } from "@visx/event"
import { ParentSize } from "@visx/responsive"
import { scaleBand, scaleLinear } from "@visx/scale"
import type { Transition } from "motion/react"
import {
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/shared/lib/utils"
import { DEFAULT_ANIMATION_EASING } from "../core/animation"
import type { BarProps } from "./bar"
import { topSquareCenterY } from "./bar-squares-layout"
import {
  forEachChartChild,
  isChartClipPassthrough,
  isClipExcludedComponent,
  isPostOverlayComponent,
  isUnderlayComponent,
  renderKeyedChartLayers,
  resolveChartChildElement,
} from "../core/chart-child-passthrough"
import {
  ChartProvider,
  type LineConfig,
  type Margin,
  type TooltipData,
} from "../core/chart-context"
import {
  isGradientDefComponent,
  isPatternDefComponent,
} from "../core/chart-defs"
import { shortDateFmt } from "../utils/chart-formatters"
import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_LIFECYCLE,
  resolveRestingChartPhase,
} from "../core/chart-phase"
import { BarLoadingSkeleton } from "../loading/loading-sweep"
import { extractReferenceAreaConfigs } from "../utils/reference-area-config"
import { useScheduledTooltip } from "../hooks/use-scheduled-tooltip"
import {
  buildYScalesForLines,
  getPrimaryYScale,
  normalizeYAxisId,
  wrapSingleYScale,
} from "../utils/y-axis-scales"
const FALLBACK_LOADING_BARS = 12
export type BarOrientation = "vertical" | "horizontal"
export interface BarChartProps {
  data: Record<string, unknown>[]
  xDataKey?: string
  margin?: Partial<Margin>
  animationDuration?: number
  animationEasing?: string
  enterTransition?: Transition
  revealSignature?: string
  aspectRatio?: string
  className?: string
  barGap?: number
  barWidth?: number
  orientation?: BarOrientation
  stacked?: boolean
  stackGap?: number
  squareSnap?: {
    squareGap: number
    groupGap?: number
    fit?: boolean
  }
  children?: ReactNode
  onPhaseChange?: (phase: ChartPhase) => void
  status?: ChartStatus
}
const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 }
function extractBarConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = []
  forEachChartChild(children, (child) => {
    const childType = child.type as {
      displayName?: string
      name?: string
      __isBarDepthLayer?: boolean
    }
    if (childType.__isBarDepthLayer) {
      return
    }
    const componentName =
      typeof child.type === "function"
        ? childType.displayName || childType.name || ""
        : ""
    const props = child.props as BarProps | undefined
    const isBarComponent =
      componentName === "Bar" ||
      componentName === "BarSquares" ||
      (props && typeof props.dataKey === "string" && props.dataKey.length > 0)
    if (isBarComponent && props?.dataKey) {
      const dotColor =
        props.stroke ||
        (typeof props.fill === "string" ? props.fill : undefined) ||
        "var(--chart-line-primary)"
      configs.push({
        dataKey: props.dataKey,
        stroke: dotColor,
        strokeWidth: 0,
        yAxisId: props.yAxisId,
      })
    }
  })
  return configs
}
interface ChartInnerProps {
  width: number
  height: number
  data: Record<string, unknown>[]
  xDataKey: string
  margin: Margin
  animationDuration: number
  animationEasing: string
  enterTransition?: Transition
  revealSignature?: string
  barGap: number
  barWidthProp?: number
  orientation: BarOrientation
  stacked: boolean
  stackGap: number
  squareSnap?: {
    squareGap: number
    groupGap?: number
    fit?: boolean
  }
  children: ReactNode
  containerRef: React.RefObject<HTMLDivElement | null>
  onPhaseChange?: (phase: ChartPhase) => void
  status: ChartStatus
}
function ChartInner(props: ChartInnerProps) {
  const { width, height } = props
  if (width < 10 || height < 10) {
    return null
  }
  return <ChartCore {...props} />
}
const ChartCore = memo(function ChartCore({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing,
  enterTransition,
  revealSignature = "",
  barGap,
  barWidthProp,
  orientation,
  stacked,
  stackGap,
  squareSnap,
  children,
  containerRef,
  onPhaseChange,
  status,
}: ChartInnerProps) {
  const { tooltipData, setTooltipData, scheduleTooltip, clearTooltip } =
    useScheduledTooltip<TooltipData>()
  const [isLoaded, setIsLoaded] = useState(false)
  const [revealEpoch, setRevealEpoch] = useState(0)
  const hoveredBarIndex = tooltipData?.index ?? null
  const isHorizontal = orientation === "horizontal"
  const lines = useMemo(() => extractBarConfigs(children), [children])
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const categoryAccessor = useCallback(
    (d: Record<string, unknown>): string => {
      const value = d[xDataKey]
      if (value instanceof Date) {
        return shortDateFmt.format(value)
      }
      return String(value ?? "")
    },
    [xDataKey]
  )
  const xAccessorDate = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey]
      if (value instanceof Date) {
        return value
      }
      return new Date()
    },
    [xDataKey]
  )
  const categoryScale = useMemo(() => {
    const domain = data.map((d) => categoryAccessor(d))
    const range: [number, number] = isHorizontal
      ? [0, innerHeight]
      : [0, innerWidth]
    return scaleBand<string>({
      range,
      domain,
      padding: barGap,
    })
  }, [innerWidth, innerHeight, data, categoryAccessor, barGap, isHorizontal])
  const bandWidth = barWidthProp ?? categoryScale.bandwidth()
  const maxValue = useMemo(() => {
    if (stacked) {
      let max = 0
      for (const d of data) {
        let sum = 0
        for (const line of lines) {
          const value = d[line.dataKey]
          if (typeof value === "number") {
            sum += value
          }
        }
        if (sum > max) {
          max = sum
        }
      }
      return max || 100
    }
    let max = 0
    for (const line of lines) {
      for (const d of data) {
        const value = d[line.dataKey]
        if (typeof value === "number" && value > max) {
          max = value
        }
      }
    }
    return max || 100
  }, [data, lines, stacked])
  const valueScale = useMemo(() => {
    const range = isHorizontal ? [0, innerWidth] : [innerHeight, 0]
    return scaleLinear({
      range,
      domain: [0, maxValue * 1.1],
      nice: true,
    })
  }, [innerWidth, innerHeight, maxValue, isHorizontal])
  const yScales = useMemo(() => {
    if (isHorizontal) {
      return wrapSingleYScale(valueScale)
    }
    return buildYScalesForLines({
      lines,
      data,
      innerHeight,
      resolveDomain: (dataKeys) => {
        let min = 0
        let max = 0
        for (const d of data) {
          for (const key of dataKeys) {
            const value = d[key]
            if (typeof value === "number") {
              min = Math.min(min, value)
              max = Math.max(max, value)
            }
          }
        }
        return [min < 0 ? min * 1.1 : 0, max > 0 ? max * 1.1 : 100]
      },
    })
  }, [data, innerHeight, isHorizontal, lines, valueScale])
  const primaryYScale = getPrimaryYScale(yScales, valueScale)
  const stackOffsets = useMemo(() => {
    if (!stacked) {
      return undefined
    }
    const offsets = new Map<number, Map<string, number>>()
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      if (!d) {
        continue
      }
      const pointOffsets = new Map<string, number>()
      let cumulative = 0
      for (const line of lines) {
        pointOffsets.set(line.dataKey, cumulative)
        const value = d[line.dataKey]
        if (typeof value === "number") {
          cumulative += value
        }
      }
      offsets.set(i, pointOffsets)
    }
    return offsets
  }, [data, lines, stacked])
  const columnWidth = useMemo(() => {
    if (data.length < 1) {
      return 0
    }
    return isHorizontal ? innerHeight / data.length : innerWidth / data.length
  }, [innerWidth, innerHeight, data.length, isHorizontal])
  const dateLabels = useMemo(
    () => data.map((d) => categoryAccessor(d)),
    [data, categoryAccessor]
  )
  const fakeTimeScale = useMemo(() => {
    const now = Date.now()
    const start = now - data.length * 24 * 60 * 60 * 1000
    const scale = {
      ...categoryScale,
      domain: () => [new Date(start), new Date(now)],
      range: () => [0, innerWidth] as [number, number],
      invert: (x: number) => new Date(start + (x / innerWidth) * (now - start)),
      copy: () => scale,
    }
    return scale
  }, [categoryScale, innerWidth, data.length])
  useEffect(() => {
    setRevealEpoch((n) => n + 1)
    setIsLoaded(false)
    if (status === "loading") {
      return
    }
    const staggerMs = data.length > 1 ? animationDuration * 0.4 : 0
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, animationDuration + staggerMs)
    return () => clearTimeout(timer)
  }, [animationDuration, data.length, revealSignature, status])
  useEffect(() => {
    onPhaseChange?.(isLoaded ? "ready" : "revealing")
  }, [isLoaded, onPhaseChange])
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const point = localPoint(event)
      if (!point) {
        return
      }
      const pos = isHorizontal ? point.y - margin.top : point.x - margin.left
      const bandIndex = Math.floor(pos / columnWidth)
      const clampedIndex = Math.max(0, Math.min(data.length - 1, bandIndex))
      const d = data[clampedIndex]
      if (!d) {
        return
      }
      const yPositions: Record<string, number> = {}
      const xPositions: Record<string, number> = {}
      const barPos = categoryScale(categoryAccessor(d)) ?? 0
      if (isHorizontal) {
        const seriesCount = lines.length
        const groupGap = seriesCount > 1 ? 4 : 0
        const individualBarHeight =
          seriesCount > 0
            ? (bandWidth - groupGap * (seriesCount - 1)) / seriesCount
            : bandWidth
        if (stacked) {
          let cumulative = 0
          for (const line of lines) {
            const value = d[line.dataKey]
            if (typeof value === "number") {
              cumulative += value
              const axisScale =
                yScales[normalizeYAxisId(line.yAxisId)] ?? valueScale
              xPositions[line.dataKey] = axisScale(cumulative) ?? 0
              yPositions[line.dataKey] = barPos + bandWidth / 2
            }
          }
        } else {
          lines.forEach((line, idx) => {
            const value = d[line.dataKey]
            if (typeof value === "number") {
              const axisScale =
                yScales[normalizeYAxisId(line.yAxisId)] ?? valueScale
              xPositions[line.dataKey] = axisScale(value) ?? 0
              yPositions[line.dataKey] =
                barPos +
                idx * (individualBarHeight + groupGap) +
                individualBarHeight / 2
            }
          })
        }
      } else if (stacked) {
        let cumulative = 0
        let seriesIdx = 0
        for (const line of lines) {
          const value = d[line.dataKey]
          if (typeof value === "number") {
            cumulative += value
            const axisScale =
              yScales[normalizeYAxisId(line.yAxisId)] ?? primaryYScale
            const gapOffset = seriesIdx * stackGap
            yPositions[line.dataKey] = (axisScale(cumulative) ?? 0) - gapOffset
            seriesIdx++
          }
        }
      } else {
        const seriesCount = lines.length
        const groupGap = seriesCount > 1 ? 4 : 0
        const individualBarWidth =
          seriesCount > 0
            ? (bandWidth - groupGap * (seriesCount - 1)) / seriesCount
            : bandWidth
        lines.forEach((line, idx) => {
          const value = d[line.dataKey]
          if (typeof value === "number") {
            const axisScale =
              yScales[normalizeYAxisId(line.yAxisId)] ?? primaryYScale
            const baselineY = axisScale(0) ?? innerHeight
            const valueY = axisScale(value) ?? 0
            const barLengthPx = baselineY - valueY
            if (squareSnap && !isHorizontal && value > 0) {
              yPositions[line.dataKey] = topSquareCenterY({
                baselineY,
                barLengthPx,
                squareSize: individualBarWidth,
                gap: squareSnap.squareGap,
                fit: squareSnap.fit,
              })
            } else {
              yPositions[line.dataKey] = valueY
            }
            xPositions[line.dataKey] =
              barPos +
              idx * (individualBarWidth + groupGap) +
              individualBarWidth / 2
          }
        })
      }
      let tooltipX: number
      if (isHorizontal) {
        const maxX = Math.max(...Object.values(xPositions), 0)
        tooltipX = maxX
      } else {
        tooltipX = barPos + bandWidth / 2
      }
      scheduleTooltip({
        point: d,
        index: clampedIndex,
        x: tooltipX,
        yPositions,
        xPositions: Object.keys(xPositions).length > 0 ? xPositions : undefined,
      })
    },
    [
      categoryScale,
      valueScale,
      data,
      lines,
      margin.left,
      margin.top,
      categoryAccessor,
      columnWidth,
      bandWidth,
      isHorizontal,
      stacked,
      stackGap,
      scheduleTooltip,
      yScales,
      primaryYScale,
      squareSnap,
      innerHeight,
    ]
  )
  const handleMouseLeave = useCallback(() => {
    clearTooltip()
  }, [clearTooltip])
  const canInteract = isLoaded
  const defsChildren: ReactElement[] = []
  const clipExcludedChildren: ReactElement[] = []
  const underlayChildren: ReactElement[] = []
  const preOverlayChildren: ReactElement[] = []
  const postOverlayChildren: ReactElement[] = []
  forEachChartChild(children, (child) => {
    const resolvedChild = resolveChartChildElement(child)
    if (isGradientDefComponent(child)) {
      defsChildren.push(child)
    } else if (isPatternDefComponent(child)) {
      preOverlayChildren.push(child)
    } else if (isPostOverlayComponent(resolvedChild)) {
      postOverlayChildren.push(resolvedChild)
    } else if (isClipExcludedComponent(resolvedChild)) {
      clipExcludedChildren.push(
        isChartClipPassthrough(child.type) ? resolvedChild : child
      )
    } else if (isUnderlayComponent(resolvedChild)) {
      underlayChildren.push(resolvedChild)
    } else {
      preOverlayChildren.push(child)
    }
  })
  const referenceAreas = useMemo(
    () => extractReferenceAreaConfigs(children),
    [children]
  )
  const contextValue = {
    ...DEFAULT_CHART_LIFECYCLE,
    chartPhase: resolveRestingChartPhase(status),
    chartStatus: status,
    data,
    renderData: data,
    xScale: fakeTimeScale as unknown as ReturnType<
      typeof import("@visx/scale").scaleTime<number>
    >,
    yScale: isHorizontal ? valueScale : primaryYScale,
    yScales,
    width,
    height,
    innerWidth,
    innerHeight,
    margin,
    columnWidth,
    tooltipData,
    setTooltipData,
    containerRef,
    lines,
    referenceAreas,
    isLoaded,
    animationDuration,
    animationEasing,
    enterTransition,
    revealEpoch,
    xAccessor: xAccessorDate,
    dateLabels,
    barScale: categoryScale,
    bandWidth,
    hoveredBarIndex,
    barXAccessor: categoryAccessor,
    orientation,
    stacked,
    stackOffsets,
    squareSnap,
  }
  return (
    <ChartProvider value={contextValue}>
      <svg
        aria-hidden="true"
        className="overflow-visible"
        height={height}
        width={width}
      >
        {defsChildren.length > 0 && <defs>{defsChildren}</defs>}

        <rect fill="transparent" height={height} width={width} x={0} y={0} />

        <g
          onMouseLeave={canInteract ? handleMouseLeave : undefined}
          onMouseMove={canInteract ? handleMouseMove : undefined}
          style={{ cursor: canInteract ? "crosshair" : "default" }}
          transform={`translate(${margin.left},${margin.top})`}
        >
          <rect
            fill="transparent"
            height={innerHeight}
            width={innerWidth}
            x={0}
            y={0}
          />

          {renderKeyedChartLayers(clipExcludedChildren)}
          {renderKeyedChartLayers(underlayChildren)}
          {status === "loading" ? (
            <BarLoadingSkeleton
              barCount={data.length || FALLBACK_LOADING_BARS}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
            />
          ) : (
            renderKeyedChartLayers(preOverlayChildren)
          )}

          {renderKeyedChartLayers(postOverlayChildren)}
        </g>
      </svg>
    </ChartProvider>
  )
})
export function BarChart({
  data,
  xDataKey = "name",
  margin: marginProp,
  animationDuration = 1100,
  animationEasing = DEFAULT_ANIMATION_EASING,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  barGap = 0.2,
  barWidth,
  orientation = "vertical",
  stacked = false,
  stackGap = 0,
  squareSnap,
  children,
  onPhaseChange,
  status = "ready",
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const margin = { ...DEFAULT_MARGIN, ...marginProp }
  return (
    <div
      className={cn("relative w-full overflow-visible", className)}
      ref={containerRef}
      style={{ aspectRatio }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            animationEasing={animationEasing}
            barGap={barGap}
            barWidthProp={barWidth}
            containerRef={containerRef}
            data={data}
            enterTransition={enterTransition}
            height={height}
            margin={margin}
            onPhaseChange={onPhaseChange}
            orientation={orientation}
            revealSignature={revealSignature}
            squareSnap={squareSnap}
            stacked={stacked}
            stackGap={stackGap}
            status={status}
            width={width}
            xDataKey={xDataKey}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  )
}
BarChart.displayName = "BarChart"
export default BarChart
