"use client"
import { motion, type Transition } from "motion/react"
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react"
import { barDepthAndRise, barDepthMaxDepth } from "./bar-depth-geometry"
import { useChartHover, useChartStable } from "../core/chart-context"
import { transitionWithDelay } from "../core/motion-utils"
const BAR_DEPTH_MIN_PX = 0.5
const BAR_FADED_OPACITY = 0.3
const DEFAULT_BAR_COLOR = "var(--chart-line-primary)"
const DEFAULT_GROUND_SHADOW = 0.26
const GLASS_TIP_OPACITY = 0.2
const PULSE_WAVE_HEIGHT_RATIO = 0.55
const PULSE_WAVE_HEIGHT_MIN_PX = 36
const PULSE_WAVE_DURATION_S = 2.4
const PULSE_WAVE_PEAK_OPACITY = 0.85
const BAR_HOVER_TRANSITION = { duration: 0.15, ease: "easeOut" as const }
export interface BarDepthEntry {
  label: string
  dataIndex: number
  datum: Record<string, unknown>
  isActive: boolean
  isNegative: boolean
  baselineY: number
  bandX: number
  bandWidth: number
  topY: number
  bottomY: number
  barHeight: number
  naturalHeight: number
  topYTrim: number
  depth: number
  perspectiveRise: number
  isRightOfCenter: boolean
}
export interface BarDepthSegment {
  value: number
  color: string
}
type ColorAccessor = (datum: Record<string, unknown>, index: number) => string
function resolveColor(
  datum: Record<string, unknown>,
  index: number,
  color: string,
  colorAccessor?: ColorAccessor
): string {
  return colorAccessor?.(datum, index) ?? color
}
function sideFacePath(
  e: BarDepthEntry,
  topEdge: number,
  bottomEdge: number
): string {
  const rise = e.perspectiveRise
  if (e.isRightOfCenter) {
    const x = e.bandX
    return `M ${x} ${topEdge} L ${x - e.depth} ${topEdge - rise} L ${x - e.depth} ${bottomEdge - rise} L ${x} ${bottomEdge} Z`
  }
  const x = e.bandX + e.bandWidth
  return `M ${x} ${topEdge} L ${x + e.depth} ${topEdge - rise} L ${x + e.depth} ${bottomEdge - rise} L ${x} ${bottomEdge} Z`
}
function lidFacePath(e: BarDepthEntry): string {
  const rise = e.perspectiveRise
  const left = e.bandX
  const right = e.bandX + e.bandWidth
  if (e.isRightOfCenter) {
    return `M ${left} ${e.topY} L ${right} ${e.topY} L ${right - e.depth} ${e.topY - rise} L ${left - e.depth} ${e.topY - rise} Z`
  }
  return `M ${left} ${e.topY} L ${right} ${e.topY} L ${right + e.depth} ${e.topY - rise} L ${left + e.depth} ${e.topY - rise} Z`
}
function buildSidePieces(
  e: BarDepthEntry,
  visibleSegments: BarDepthSegment[] | null,
  baseColor: string
): {
  path: string
  color: string
}[] {
  if (!(visibleSegments && visibleSegments.length > 0)) {
    return [{ path: sideFacePath(e, e.topY, e.bottomY), color: baseColor }]
  }
  const totalValue = visibleSegments.reduce((sum, s) => sum + s.value, 0)
  const pieces: {
    path: string
    color: string
  }[] = []
  let cursorY = e.bottomY
  for (let i = 0; i < visibleSegments.length; i++) {
    const seg = visibleSegments[i]
    if (!seg) {
      continue
    }
    const isTopmost = i === visibleSegments.length - 1
    const segScaledHeight = (seg.value / totalValue) * e.naturalHeight
    const segHeight = isTopmost
      ? Math.max(0, segScaledHeight - e.topYTrim)
      : segScaledHeight
    const segBottomY = cursorY
    const segTopY = cursorY - segHeight
    cursorY = segTopY
    pieces.push({
      path: sideFacePath(e, segTopY, segBottomY),
      color: seg.color,
    })
  }
  return pieces
}
interface BarDepthContextValue {
  segmentsAccessor?: (
    datum: Record<string, unknown>
  ) => BarDepthSegment[] | null | undefined
  groundShadow?: number
  minBarHeight?: number
}
const BarDepthContext = createContext<BarDepthContextValue>({})
export interface BarDepthProviderProps extends BarDepthContextValue {
  children: ReactNode
}
export function BarDepthProvider({
  segmentsAccessor,
  groundShadow,
  minBarHeight,
  children,
}: BarDepthProviderProps) {
  const value = useMemo<BarDepthContextValue>(
    () => ({ segmentsAccessor, groundShadow, minBarHeight }),
    [segmentsAccessor, groundShadow, minBarHeight]
  )
  return (
    <BarDepthContext.Provider value={value}>
      {children}
    </BarDepthContext.Provider>
  )
}
BarDepthProvider.displayName = "BarDepthProvider"
interface GlassGradientStop {
  offset: string
  color: string
  opacity: string
}
function buildPosBarStops(groundShadow: number): GlassGradientStop[] {
  return [
    { offset: "0%", color: "white", opacity: String(GLASS_TIP_OPACITY) },
    { offset: "3%", color: "white", opacity: "0.09" },
    { offset: "8%", color: "white", opacity: "0.02" },
    { offset: "55%", color: "white", opacity: "0" },
    { offset: "100%", color: "black", opacity: String(groundShadow) },
  ]
}
function buildNegBarStops(groundShadow: number): GlassGradientStop[] {
  return [
    { offset: "0%", color: "black", opacity: String(groundShadow) },
    { offset: "45%", color: "white", opacity: "0" },
    { offset: "92%", color: "white", opacity: "0.02" },
    { offset: "97%", color: "white", opacity: "0.09" },
    { offset: "100%", color: "white", opacity: String(GLASS_TIP_OPACITY) },
  ]
}
function useGlassStops() {
  const { groundShadow = DEFAULT_GROUND_SHADOW } = useContext(BarDepthContext)
  return useMemo(
    () => ({
      posStops: buildPosBarStops(groundShadow),
      negStops: buildNegBarStops(groundShadow),
    }),
    [groundShadow]
  )
}
function readBarValue(d: Record<string, unknown>, key: string): number {
  const v = key ? d[key] : undefined
  return typeof v === "number" ? v : 0
}
export function useBarDepthEntries(
  dataKey: string,
  activeIndex?: number
): BarDepthEntry[] {
  const {
    data,
    barScale,
    bandWidth,
    yScale,
    innerHeight,
    innerWidth,
    barXAccessor,
  } = useChartStable()
  const { segmentsAccessor, minBarHeight = 0 } = useContext(BarDepthContext)
  return useMemo(() => {
    if (!(barScale && bandWidth && barXAccessor)) {
      return []
    }
    const centerX = innerWidth / 2
    const zeroY = yScale(0) ?? innerHeight
    const step =
      (
        barScale as unknown as {
          step?: () => number
        }
      ).step?.() ?? bandWidth
    const maxDepth = barDepthMaxDepth(step, bandWidth)
    return data.flatMap((d, dataIndex): BarDepthEntry[] => {
      const visibleSegs =
        segmentsAccessor?.(d)?.filter((s) => s.value > 0) ?? null
      const value =
        visibleSegs && visibleSegs.length > 0
          ? visibleSegs.reduce((sum, s) => sum + s.value, 0)
          : readBarValue(d, dataKey)
      const isActive = activeIndex != null && dataIndex === activeIndex
      const isNegative = value < 0
      const label = barXAccessor(d)
      const bandX = barScale(label) ?? 0
      const cx = bandX + bandWidth / 2
      const valuePos = yScale(value) ?? innerHeight
      const rawHeight = Math.abs(zeroY - valuePos)
      const naturalHeight = isNegative
        ? rawHeight
        : Math.max(rawHeight, minBarHeight)
      if (naturalHeight <= 0) {
        return []
      }
      const isFloored = !isNegative && rawHeight < naturalHeight
      const offsetFromCenter = centerX > 0 ? (cx - centerX) / centerX : 0
      const isRightOfCenter = offsetFromCenter > 0
      const absOffset = Math.min(1, Math.abs(offsetFromCenter))
      const { depth, perspectiveRise: rawRise } = barDepthAndRise(
        absOffset,
        naturalHeight,
        maxDepth
      )
      const perspectiveRise = isNegative ? 0 : rawRise
      let trimClampReference = naturalHeight
      if (visibleSegs && visibleSegs.length > 0) {
        const segTotal = visibleSegs.reduce((sum, s) => sum + s.value, 0)
        const topmost = visibleSegs.at(-1)
        if (segTotal > 0 && topmost) {
          trimClampReference = (topmost.value / segTotal) * naturalHeight
        }
      }
      const isValueBar = naturalHeight > 0 && !isNegative && !isFloored
      const topYTrim = isValueBar
        ? Math.min(perspectiveRise, Math.max(0, trimClampReference - 1))
        : 0
      const topY = isNegative ? zeroY : zeroY - naturalHeight + topYTrim
      const bottomY = isNegative ? zeroY + naturalHeight : zeroY
      const barHeight = bottomY - topY
      return [
        {
          label,
          dataIndex,
          datum: d,
          isActive,
          isNegative,
          baselineY: zeroY,
          bandX,
          bandWidth,
          topY,
          bottomY,
          barHeight,
          naturalHeight,
          topYTrim,
          depth,
          perspectiveRise,
          isRightOfCenter,
        },
      ]
    })
  }, [
    data,
    barScale,
    bandWidth,
    yScale,
    innerHeight,
    innerWidth,
    barXAccessor,
    segmentsAccessor,
    minBarHeight,
    dataKey,
    activeIndex,
  ])
}
function useBarDepthStagger() {
  const { data, animationDuration } = useChartStable()
  const total = animationDuration || 1100
  return data.length > 1 ? (total * 0.4) / 1000 / data.length : 0
}
export interface BarDepthBackProps {
  dataKey: string
  color?: string
  colorAccessor?: ColorAccessor
}
export function BarDepthBack({
  dataKey,
  color = DEFAULT_BAR_COLOR,
  colorAccessor,
}: BarDepthBackProps) {
  const { isLoaded, enterTransition, revealEpoch = 0 } = useChartStable()
  const { hoveredBarIndex } = useChartHover()
  const { segmentsAccessor } = useContext(BarDepthContext)
  const entries = useBarDepthEntries(dataKey)
  const stagger = useBarDepthStagger()
  const { posStops: glassStops, negStops: glassNegStops } = useGlassStops()
  const idPrefix = useId().replace(/[^a-z0-9]/gi, "_")
  const sideShadeRtl = `bdb-side-rtl-${idPrefix}`
  const sideShadeLtr = `bdb-side-ltr-${idPrefix}`
  const topShade = `bdb-top-${idPrefix}`
  const sideGlass = `bdb-glass-${idPrefix}`
  const sideGlassNeg = `bdb-glass-neg-${idPrefix}`
  return (
    <g className="bar-depth-back" pointerEvents="none">
      <defs>
        <linearGradient id={sideShadeRtl} x1="1" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0.05" />
          <stop offset="100%" stopColor="black" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={sideShadeLtr} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="black" stopOpacity="0.05" />
          <stop offset="100%" stopColor="black" stopOpacity="0.55" />
        </linearGradient>

        <linearGradient id={topShade} x1="0" x2="0" y1="1" y2="0">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id={sideGlass} x1="0" x2="0" y1="0" y2="1">
          {glassStops.map((stop) => (
            <stop
              key={`${stop.offset}-${stop.opacity}`}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>

        <linearGradient id={sideGlassNeg} x1="0" x2="0" y1="0" y2="1">
          {glassNegStops.map((stop) => (
            <stop
              key={`${stop.offset}-${stop.opacity}`}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>
      </defs>

      {entries.map((e) => {
        if (e.depth < BAR_DEPTH_MIN_PX) {
          return null
        }
        const rawSegments = segmentsAccessor?.(e.datum)
        const visibleSegments = rawSegments?.filter((s) => s.value > 0) ?? null
        const baseColor = resolveColor(
          e.datum,
          e.dataIndex,
          color,
          colorAccessor
        )
        const sidePieces = buildSidePieces(e, visibleSegments, baseColor)
        const fullSidePath = sideFacePath(e, e.topY, e.bottomY)
        const topPath = lidFacePath(e)
        const topColor = visibleSegments?.at(-1)?.color ?? baseColor
        const delay = e.dataIndex * stagger
        const growTransition = isLoaded
          ? { duration: 0.3, ease: "easeOut" as const }
          : transitionWithDelay(enterTransition, delay)
        const isFaded =
          hoveredBarIndex != null && hoveredBarIndex !== e.dataIndex
        const sideShadeId = e.isRightOfCenter ? sideShadeRtl : sideShadeLtr
        const safeId = e.label.replace(/[^a-z0-9]/gi, "_")
        const clipId = `bdb-clip-${idPrefix}-${safeId}`
        let lidEntrance: {
          initial:
            | false
            | {
                y?: number
                opacity?: number
              }
          animate: {
            y?: number
            opacity?: number
          }
          transition: Transition
        } = {
          initial: false,
          animate: { y: 0 },
          transition: { y: growTransition },
        }
        if (!isLoaded && e.isNegative) {
          lidEntrance = {
            initial: { y: 0, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { y: growTransition, opacity: growTransition },
          }
        } else if (!isLoaded) {
          lidEntrance = {
            initial: { y: e.barHeight },
            animate: { y: 0 },
            transition: { y: growTransition },
          }
        }
        return (
          <motion.g
            animate={{ opacity: isFaded ? BAR_FADED_OPACITY : 1 }}
            initial={false}
            key={e.label}
            transition={BAR_HOVER_TRANSITION}
          >
            <defs>
              <clipPath id={clipId}>
                <motion.rect
                  animate={{
                    y: e.topY - e.perspectiveRise,
                    height: e.barHeight + e.perspectiveRise,
                  }}
                  initial={isLoaded ? false : { y: e.baselineY, height: 0 }}
                  key={`${clipId}-${revealEpoch}-${isLoaded}`}
                  transition={growTransition}
                  width={e.bandWidth + 2 * e.depth + 2}
                  x={e.bandX - e.depth - 1}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              {sidePieces.map((piece) => (
                <path d={piece.path} fill={piece.color} key={piece.path} />
              ))}

              <path d={fullSidePath} fill={`url(#${sideShadeId})`} />
              <path
                d={fullSidePath}
                fill={`url(#${e.isNegative ? sideGlassNeg : sideGlass})`}
              />
            </g>

            <motion.g
              animate={lidEntrance.animate}
              initial={lidEntrance.initial}
              key={`lid-${safeId}-${revealEpoch}-${isLoaded}`}
              transition={lidEntrance.transition}
            >
              <path d={topPath} fill={topColor} />
              <path d={topPath} fill="white" fillOpacity={GLASS_TIP_OPACITY} />
              <path d={topPath} fill={`url(#${topShade})`} />
            </motion.g>
          </motion.g>
        )
      })}
    </g>
  )
}
BarDepthBack.displayName = "BarDepthBack"
;(
  BarDepthBack as {
    __isBarDepthLayer?: boolean
  }
).__isBarDepthLayer = true
export interface BarDepthFrontProps {
  dataKey: string
}
export function BarDepthFront({ dataKey }: BarDepthFrontProps) {
  const { isLoaded, enterTransition, revealEpoch = 0 } = useChartStable()
  const { hoveredBarIndex } = useChartHover()
  const entries = useBarDepthEntries(dataKey)
  const stagger = useBarDepthStagger()
  const { posStops: glassStops, negStops: glassNegStops } = useGlassStops()
  const idPrefix = useId().replace(/[^a-z0-9]/gi, "_")
  const glassId = `bdf-glass-${idPrefix}`
  const glassIdNeg = `bdf-glass-neg-${idPrefix}`
  return (
    <g className="bar-depth-front" pointerEvents="none">
      <defs>
        <linearGradient id={glassId} x1="0" x2="0" y1="0" y2="1">
          {glassStops.map((stop) => (
            <stop
              key={`${stop.offset}-${stop.opacity}`}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>

        <linearGradient id={glassIdNeg} x1="0" x2="0" y1="0" y2="1">
          {glassNegStops.map((stop) => (
            <stop
              key={`${stop.offset}-${stop.opacity}`}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </linearGradient>
      </defs>

      {entries.map((e) => {
        const delay = e.dataIndex * stagger
        const baseTransition = isLoaded
          ? { duration: 0.3, ease: "easeOut" as const }
          : transitionWithDelay(enterTransition, delay)
        const isFaded =
          hoveredBarIndex != null && hoveredBarIndex !== e.dataIndex
        return (
          <motion.rect
            animate={{
              y: e.topY,
              height: e.barHeight,
              opacity: isFaded ? BAR_FADED_OPACITY : 1,
            }}
            fill={`url(#${e.isNegative ? glassIdNeg : glassId})`}
            initial={isLoaded ? false : { y: e.baselineY, height: 0 }}
            key={`${e.label}-${revealEpoch}-${isLoaded}`}
            transition={{ ...baseTransition, opacity: BAR_HOVER_TRANSITION }}
            width={e.bandWidth}
            x={e.bandX}
          />
        )
      })}
    </g>
  )
}
BarDepthFront.displayName = "BarDepthFront"
;(
  BarDepthFront as {
    __isBarDepthLayer?: boolean
  }
).__isBarDepthLayer = true
function buildBarSilhouettePath(e: BarDepthEntry): string {
  const {
    bandX,
    bandWidth,
    topY,
    bottomY,
    depth,
    perspectiveRise,
    isRightOfCenter,
  } = e
  if (depth <= 0) {
    return [
      `M ${bandX} ${topY}`,
      `L ${bandX + bandWidth} ${topY}`,
      `L ${bandX + bandWidth} ${bottomY}`,
      `L ${bandX} ${bottomY}`,
      "Z",
    ].join(" ")
  }
  if (isRightOfCenter) {
    return [
      `M ${bandX - depth} ${topY - perspectiveRise}`,
      `L ${bandX + bandWidth - depth} ${topY - perspectiveRise}`,
      `L ${bandX + bandWidth} ${topY}`,
      `L ${bandX + bandWidth} ${bottomY}`,
      `L ${bandX} ${bottomY}`,
      `L ${bandX - depth} ${bottomY - perspectiveRise}`,
      "Z",
    ].join(" ")
  }
  return [
    `M ${bandX} ${topY}`,
    `L ${bandX + depth} ${topY - perspectiveRise}`,
    `L ${bandX + bandWidth + depth} ${topY - perspectiveRise}`,
    `L ${bandX + bandWidth + depth} ${bottomY - perspectiveRise}`,
    `L ${bandX + bandWidth} ${bottomY}`,
    `L ${bandX} ${bottomY}`,
    "Z",
  ].join(" ")
}
export interface BarPulseProps {
  dataKey: string
  activeIndex?: number
  pulsePaused?: boolean
}
export function BarPulse({ dataKey, activeIndex, pulsePaused }: BarPulseProps) {
  const { isLoaded } = useChartStable()
  const { hoveredBarIndex } = useChartHover()
  const entries = useBarDepthEntries(dataKey, activeIndex)
  const idPrefix = useId().replace(/[^a-z0-9]/gi, "_")
  const activeEntries = useMemo(
    () => entries.filter((e) => e.isActive),
    [entries]
  )
  if (activeEntries.length === 0 || pulsePaused) {
    return null
  }
  if (!isLoaded) {
    return null
  }
  return (
    <g className="bar-pulse" pointerEvents="none">
      <defs>
        {activeEntries.flatMap((e) => {
          const safeId = e.label.replace(/[^a-z0-9]/gi, "_")
          const clipId = `bar-pulse-clip-${idPrefix}-${safeId}`
          const gradId = `bar-pulse-grad-${idPrefix}-${safeId}`
          return [
            <clipPath id={clipId} key={`clip-${safeId}`}>
              <path d={buildBarSilhouettePath(e)} />
            </clipPath>,
            <linearGradient
              id={gradId}
              key={`grad-${safeId}`}
              x1="0"
              x2="0"
              y1="1"
              y2="0"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="10%" stopColor="white" stopOpacity="0" />
              <stop
                offset="22%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.18}
              />
              <stop
                offset="34%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.5}
              />
              <stop
                offset="44%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.85}
              />
              <stop
                offset="50%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY}
              />
              <stop
                offset="56%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.85}
              />
              <stop
                offset="66%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.5}
              />
              <stop
                offset="78%"
                stopColor="white"
                stopOpacity={PULSE_WAVE_PEAK_OPACITY * 0.18}
              />
              <stop offset="90%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>,
          ]
        })}
      </defs>

      {activeEntries.map((e) => {
        const safeId = e.label.replace(/[^a-z0-9]/gi, "_")
        const clipId = `bar-pulse-clip-${idPrefix}-${safeId}`
        const gradId = `bar-pulse-grad-${idPrefix}-${safeId}`
        const waveHeight = Math.max(
          e.barHeight * PULSE_WAVE_HEIGHT_RATIO,
          PULSE_WAVE_HEIGHT_MIN_PX
        )
        const yAboveLid = e.topY - e.perspectiveRise - waveHeight
        const yBelowFloor = e.bottomY
        const yStart = e.isNegative ? yAboveLid : yBelowFloor
        const yEnd = e.isNegative ? yBelowFloor : yAboveLid
        const isFaded =
          hoveredBarIndex != null && hoveredBarIndex !== e.dataIndex
        return (
          <motion.g
            animate={{ opacity: isFaded ? BAR_FADED_OPACITY : 1 }}
            clipPath={`url(#${clipId})`}
            initial={false}
            key={e.label}
            transition={BAR_HOVER_TRANSITION}
          >
            <motion.rect
              animate={{ y: yEnd }}
              fill={`url(#${gradId})`}
              height={waveHeight}
              initial={{ y: yStart }}
              transition={{
                duration: PULSE_WAVE_DURATION_S,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              width={e.bandWidth + 2 * e.depth + 2}
              x={e.bandX - e.depth - 1}
            />
          </motion.g>
        )
      })}
    </g>
  )
}
BarPulse.displayName = "BarPulse"
;(
  BarPulse as {
    __isBarDepthLayer?: boolean
  }
).__isBarDepthLayer = true
