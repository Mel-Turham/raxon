"use client"
import type { scaleBand } from "@visx/scale"
import type { Transition } from "motion/react"
import { motion } from "motion/react"
import { memo, useId, useMemo } from "react"
import { barDepthAndRise, barDepthMaxDepth } from "./bar-depth-geometry"
import {
  chartCssVars,
  useChart,
  useChartStable,
  useYScale,
} from "../core/chart-context"
import { useChartLegendHover } from "../core/chart-legend-hover"
import { transitionWithDelay } from "../core/motion-utils"
type ScaleBand<
  Domain extends {
    toString(): string
  },
> = ReturnType<typeof scaleBand<Domain>>
export type BarLineCap = "round" | "butt" | number
export type BarAnimationType = "grow" | "fade"
function barDepthPerspectiveRise(
  barScale: ScaleBand<string>,
  bandWidth: number,
  barXAccessor: (d: Record<string, unknown>) => string,
  innerWidth: number,
  datum: Record<string, unknown>,
  topY: number,
  baselineY: number
): number {
  const centerX = innerWidth / 2
  if (centerX <= 0) {
    return 0
  }
  const step =
    (
      barScale as unknown as {
        step?: () => number
      }
    ).step?.() ?? bandWidth
  const maxDepth = barDepthMaxDepth(step, bandWidth)
  const bandX = barScale(barXAccessor(datum)) ?? 0
  const cx = bandX + bandWidth / 2
  const absOffset = Math.min(1, Math.abs((cx - centerX) / centerX))
  const naturalHeight = Math.abs(baselineY - topY)
  return barDepthAndRise(absOffset, naturalHeight, maxDepth).perspectiveRise
}
export interface BarProps {
  dataKey: string
  yAxisId?: string | number
  fill?: string | ((datum: Record<string, unknown>) => string)
  stroke?: string
  lineCap?: BarLineCap
  animate?: boolean
  animationType?: BarAnimationType
  fadedOpacity?: number
  staggerDelay?: number
  stackGap?: number
  groupGap?: number
  perspective?: boolean
  minBarHeight?: number
}
interface BarInnerProps extends BarProps {
  barScale: ScaleBand<string>
  bandWidth: number
  barXAccessor: (d: Record<string, unknown>) => string
}
interface AnimatedBarProps {
  x: number
  y: number
  width: number
  height: number
  fill: string
  rx: number
  ry: number
  index: number
  isFaded: boolean
  animationType: BarAnimationType
  baseline: number
  fadedOpacity: number
  staggerDelay: number
  enterTransition?: Transition
  revealEpoch: number
  isHorizontal: boolean
}
function AnimatedBar({
  x,
  y,
  width,
  height,
  fill,
  rx,
  ry,
  index,
  isFaded,
  animationType,
  baseline,
  fadedOpacity,
  staggerDelay,
  enterTransition,
  revealEpoch,
  isHorizontal,
}: AnimatedBarProps) {
  const enterAnim = transitionWithDelay(enterTransition, index * staggerDelay)
  if (animationType === "fade") {
    return (
      <motion.rect
        animate={{
          opacity: isFaded ? fadedOpacity : 1,
          filter: "blur(0px)",
        }}
        fill={fill}
        height={height}
        initial={{ opacity: 0, filter: "blur(2px)" }}
        key={`fade-${revealEpoch}`}
        rx={rx}
        ry={ry}
        transition={enterAnim}
        width={width}
        x={x}
        y={y}
      />
    )
  }
  const initial = isHorizontal
    ? { width: 0, height, x: baseline, y }
    : { width, height: 0, x, y: baseline }
  const target = isHorizontal
    ? { width, height, x: 0, y }
    : { width, height, x, y }
  return (
    <g
      opacity={isFaded ? fadedOpacity : 1}
      style={{ transition: "opacity 0.15s ease-in-out" }}
    >
      <motion.rect
        animate={target}
        fill={fill}
        initial={initial}
        key={`grow-${revealEpoch}`}
        rx={rx}
        ry={ry}
        transition={enterAnim}
      />
    </g>
  )
}
const BarInner = memo(function BarInner({
  dataKey,
  yAxisId,
  fill = chartCssVars.linePrimary,
  lineCap = "round",
  animate = true,
  animationType = "grow",
  fadedOpacity = 0.3,
  staggerDelay,
  stackGap = 0,
  groupGap = 4,
  perspective = false,
  minBarHeight = 0,
  barScale,
  bandWidth,
  barXAccessor,
}: BarInnerProps) {
  const {
    data,
    yScale: chartYScale,
    innerHeight,
    innerWidth,
    isLoaded,
    hoveredBarIndex,
    lines,
    orientation,
    stacked,
    stackOffsets,
    animationDuration,
    enterTransition,
    revealEpoch = 0,
  } = useChart()
  const totalAnimDuration = animationDuration || 1100
  const staggerSpread = totalAnimDuration * 0.4
  const calculatedStaggerDelay =
    staggerDelay ?? (data.length > 1 ? staggerSpread / 1000 / data.length : 0)
  const uniqueId = useId()
  const isHorizontal = orientation === "horizontal"
  const { hoveredIndex: legendHoveredIndex } = useChartLegendHover()
  const seriesIndex = useMemo(() => {
    const idx = lines.findIndex((l) => l.dataKey === dataKey)
    return idx >= 0 ? idx : 0
  }, [lines, dataKey])
  const seriesConfig = lines[seriesIndex]
  const valueScale = useYScale(yAxisId ?? seriesConfig?.yAxisId)
  const isLegendDimmed =
    legendHoveredIndex !== null && legendHoveredIndex !== seriesIndex
  const seriesCount = lines.length
  const isLastSeries = seriesIndex === seriesCount - 1
  const barWidth = useMemo(() => {
    if (!bandWidth || seriesCount === 0) {
      return 0
    }
    if (stacked) {
      return bandWidth
    }
    const effectiveGroupGap = seriesCount > 1 ? groupGap : 0
    return (bandWidth - effectiveGroupGap * (seriesCount - 1)) / seriesCount
  }, [bandWidth, seriesCount, stacked, groupGap])
  const cornerRadius = useMemo(() => {
    if (perspective) {
      return 0
    }
    if (typeof lineCap === "number") {
      return lineCap
    }
    if (lineCap === "round" && barWidth) {
      return Math.min(barWidth / 2, 8)
    }
    return 0
  }, [lineCap, barWidth, perspective])
  return (
    <g className={`bar-series-${uniqueId}`}>
      {data.map((d, i) => {
        const value = d[dataKey]
        if (typeof value !== "number") {
          return null
        }
        const categoryValue = barXAccessor(d)
        const bandPos = barScale(categoryValue) ?? 0
        let x: number
        let y: number
        let barHeight: number
        let barW: number
        const scale = isHorizontal ? chartYScale : valueScale
        const baseline = scale(0) ?? (isHorizontal ? 0 : innerHeight)
        if (isHorizontal) {
          const valuePos = scale(value) ?? 0
          barHeight = barWidth
          if (stacked && stackOffsets) {
            const offset = stackOffsets.get(i)?.get(dataKey) ?? 0
            x = scale(offset) ?? 0
            barW = valuePos - x
            const gapOffset = seriesIndex * stackGap
            x += gapOffset
            if (!isLastSeries && stackGap > 0) {
              barW = Math.max(0, barW - stackGap)
            }
          } else {
            x = Math.min(baseline, valuePos)
            barW = Math.abs(valuePos - baseline)
            const effectiveGroupGap = seriesCount > 1 ? groupGap : 0
            y = bandPos + seriesIndex * (barWidth + effectiveGroupGap)
          }
          y = stacked
            ? bandPos
            : bandPos +
              seriesIndex * (barWidth + (seriesCount > 1 ? groupGap : 0))
        } else {
          const valuePos = scale(value) ?? 0
          barW = barWidth
          if (stacked && stackOffsets) {
            const offset = stackOffsets.get(i)?.get(dataKey) ?? 0
            const offsetY = scale(offset) ?? innerHeight
            barHeight = innerHeight - valuePos
            const gapOffset = seriesIndex * stackGap
            y = offsetY - barHeight - gapOffset
            if (!isLastSeries && stackGap > 0) {
              barHeight = Math.max(0, barHeight - stackGap)
            }
          } else {
            barHeight = Math.abs(baseline - valuePos)
            y = Math.min(baseline, valuePos)
            const effectiveGroupGap = seriesCount > 1 ? groupGap : 0
            x = bandPos + seriesIndex * (barWidth + effectiveGroupGap)
          }
          x = stacked
            ? bandPos
            : bandPos +
              seriesIndex * (barWidth + (seriesCount > 1 ? groupGap : 0))
          let isFloored = false
          if (
            !stacked &&
            minBarHeight > 0 &&
            value >= 0 &&
            barHeight < minBarHeight
          ) {
            barHeight = minBarHeight
            y = baseline - minBarHeight
            isFloored = true
          }
          if (
            perspective &&
            value > 0 &&
            !isFloored &&
            (!stacked || isLastSeries)
          ) {
            const rise = barDepthPerspectiveRise(
              barScale,
              bandWidth,
              barXAccessor,
              innerWidth,
              d,
              y,
              baseline
            )
            const trim = Math.min(rise, Math.max(0, barHeight - 1))
            y += trim
            barHeight -= trim
          }
        }
        const isFaded =
          (hoveredBarIndex !== null && hoveredBarIndex !== i) || isLegendDimmed
        const barKey = `bar-${dataKey}-${categoryValue}`
        const barFill = typeof fill === "function" ? fill(d) : fill
        const applyRounding = !stacked || stackGap > 0 || isLastSeries
        const effectiveRx = applyRounding ? cornerRadius : 0
        const effectiveRy = applyRounding ? cornerRadius : 0
        if (animate && !isLoaded) {
          return (
            <AnimatedBar
              animationType={animationType}
              baseline={stacked ? (isHorizontal ? 0 : innerHeight) : baseline}
              enterTransition={enterTransition}
              fadedOpacity={fadedOpacity}
              fill={barFill}
              height={barHeight}
              index={i}
              isFaded={isFaded}
              isHorizontal={isHorizontal}
              key={barKey}
              revealEpoch={revealEpoch}
              rx={effectiveRx}
              ry={effectiveRy}
              staggerDelay={calculatedStaggerDelay}
              width={barW}
              x={x}
              y={y}
            />
          )
        }
        return (
          <rect
            fill={barFill}
            height={barHeight}
            key={barKey}
            opacity={isFaded ? fadedOpacity : 1}
            rx={effectiveRx}
            ry={effectiveRy}
            style={{
              cursor: "default",
              transition: "opacity 0.15s ease-in-out",
            }}
            width={barW}
            x={x}
            y={y}
          />
        )
      })}
    </g>
  )
})
export function Bar(props: BarProps) {
  const { barScale, bandWidth, barXAccessor } = useChartStable()
  if (!(barScale && bandWidth && barXAccessor)) {
    console.warn("Bar component must be used within a BarChart")
    return null
  }
  return (
    <BarInner
      {...props}
      bandWidth={bandWidth}
      barScale={barScale}
      barXAccessor={barXAccessor}
    />
  )
}
Bar.displayName = "Bar"
export default Bar
