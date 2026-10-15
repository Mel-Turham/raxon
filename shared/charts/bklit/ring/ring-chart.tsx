"use client"
import { Group } from "@visx/group"
import { ParentSize } from "@visx/responsive"
import { arc as arcGenerator } from "@visx/shape"
import type { Transition } from "motion/react"
import {
  Children,
  isValidElement,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/shared/lib/utils"
import {
  defaultRingColors,
  type RingContextValue,
  type RingData,
  RingProvider,
  ringCssVars,
} from "./ring-context"
function generateRingArcPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  cornerRadius: number
): string {
  const generator = arcGenerator<unknown>({
    innerRadius,
    outerRadius,
    cornerRadius,
  })
  return generator({ startAngle, endAngle } as unknown as null) || ""
}
export interface RingChartProps {
  data: RingData[]
  size?: number
  strokeWidth?: number
  ringGap?: number
  baseInnerRadius?: number
  animationDuration?: number
  className?: string
  hoveredIndex?: number | null
  onHoverChange?: (index: number | null) => void
  startAngle?: number
  endAngle?: number
  enterTransition?: Transition
  enterStaggerScale?: number
  geometryScrubbing?: boolean
  children: ReactNode
}
interface RingChartInnerProps {
  width: number
  height: number
  data: RingData[]
  strokeWidth: number
  ringGap: number
  baseInnerRadius: number
  children: ReactNode
  containerRef: React.RefObject<HTMLDivElement | null>
  hoveredIndexProp?: number | null
  onHoverChange?: (index: number | null) => void
  startAngle: number
  endAngle: number
  enterTransition?: Transition
  enterStaggerScale: number
  geometryScrubbing: boolean
}
function isRing(child: ReactNode): boolean {
  return (
    isValidElement(child) &&
    typeof child.type === "function" &&
    ((
      child.type as {
        displayName?: string
      }
    ).displayName === "Ring" ||
      (
        child.type as {
          name?: string
        }
      ).name === "Ring")
  )
}
function isRingCenter(child: ReactNode): boolean {
  return (
    isValidElement(child) &&
    typeof child.type === "function" &&
    ((
      child.type as {
        displayName?: string
      }
    ).displayName === "RingCenter" ||
      child.type.name === "RingCenter")
  )
}
function RingChartInner(props: RingChartInnerProps) {
  const size = Math.min(props.width, props.height)
  if (size < 10) {
    return null
  }
  return <RingChartCore {...props} />
}
interface ScrubRingLayer {
  key: string
  bgPath: string
  progressPath: string
  color: string
}
const RingChartCore = memo(function RingChartCore({
  width,
  height,
  data,
  strokeWidth: strokeWidthProp,
  ringGap: ringGapProp,
  baseInnerRadius: baseInnerRadiusProp,
  children,
  containerRef,
  hoveredIndexProp,
  onHoverChange,
  startAngle,
  endAngle,
  enterTransition,
  enterStaggerScale,
  geometryScrubbing,
}: RingChartInnerProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<
    number | null
  >(null)
  const [animationKey] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const isControlled = hoveredIndexProp !== undefined
  const hoveredIndex = isControlled ? hoveredIndexProp : internalHoveredIndex
  const setHoveredIndex = useCallback(
    (index: number | null) => {
      if (isControlled) {
        onHoverChange?.(index)
      } else {
        setInternalHoveredIndex(index)
      }
    },
    [isControlled, onHoverChange]
  )
  const size = Math.min(width, height)
  const center = size / 2
  const ringCount = data.length
  const padding = 8
  const availableRadius = center - padding
  const designOuterRadius =
    baseInnerRadiusProp +
    (ringCount - 1) * (strokeWidthProp + ringGapProp) +
    strokeWidthProp
  const scale = Math.min(1, availableRadius / designOuterRadius)
  const strokeWidth = strokeWidthProp * scale
  const ringGap = ringGapProp * scale
  const baseInnerRadius = baseInnerRadiusProp * scale
  const totalValue = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  )
  const getColor = useCallback(
    (index: number) => {
      const item = data[index]
      if (item?.color) {
        return item.color
      }
      return defaultRingColors[index % defaultRingColors.length] as string
    },
    [data]
  )
  const getRingRadii = useCallback(
    (index: number) => {
      const innerRadius = baseInnerRadius + index * (strokeWidth + ringGap)
      const outerRadius = innerRadius + strokeWidth
      return { innerRadius, outerRadius }
    },
    [baseInnerRadius, strokeWidth, ringGap]
  )
  const arcRange = endAngle - startAngle
  const scrubRingLayers = useMemo((): readonly ScrubRingLayer[] | null => {
    if (!geometryScrubbing) {
      return null
    }
    return data.map((ringData, index) => {
      const { innerRadius, outerRadius } = getRingRadii(index)
      const cornerRadius = (outerRadius - innerRadius) / 2
      const progress = ringData.value / ringData.maxValue
      const progressEndAngle = startAngle + arcRange * progress
      return {
        bgPath: generateRingArcPath(
          innerRadius,
          outerRadius,
          startAngle,
          endAngle,
          cornerRadius
        ),
        progressPath:
          progressEndAngle <= startAngle + 0.01
            ? ""
            : generateRingArcPath(
                innerRadius,
                outerRadius,
                startAngle,
                progressEndAngle,
                cornerRadius
              ),
        color: getColor(index),
        key: ringData.label,
      }
    })
  }, [
    geometryScrubbing,
    data,
    getRingRadii,
    getColor,
    startAngle,
    endAngle,
    arcRange,
  ])
  const effectiveIsLoaded = geometryScrubbing || isLoaded
  useEffect(() => {
    if (geometryScrubbing) {
      return
    }
    setIsLoaded(false)
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [enterTransition, enterStaggerScale, geometryScrubbing])
  const { svgChildren, centerChildren } = useMemo(() => {
    const svgNodes: ReactNode[] = []
    const centerNodes: ReactNode[] = []
    Children.forEach(children, (child) => {
      if (isRingCenter(child)) {
        centerNodes.push(child)
      } else if (geometryScrubbing && isRing(child)) {
        return
      } else {
        svgNodes.push(child)
      }
    })
    return { svgChildren: svgNodes, centerChildren: centerNodes }
  }, [children, geometryScrubbing])
  const contextValue: RingContextValue = useMemo(
    () => ({
      data,
      size,
      center,
      strokeWidth,
      ringGap,
      baseInnerRadius,
      hoveredIndex,
      setHoveredIndex,
      animationKey,
      isLoaded: effectiveIsLoaded,
      enterTransition,
      enterStaggerScale,
      containerRef,
      totalValue,
      getColor,
      getRingRadii,
      startAngle,
      endAngle,
      geometryScrubbing,
    }),
    [
      data,
      size,
      center,
      strokeWidth,
      ringGap,
      baseInnerRadius,
      hoveredIndex,
      setHoveredIndex,
      animationKey,
      effectiveIsLoaded,
      enterTransition,
      enterStaggerScale,
      containerRef,
      totalValue,
      getColor,
      getRingRadii,
      startAngle,
      endAngle,
      geometryScrubbing,
    ]
  )
  return (
    <RingProvider value={contextValue}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr",
          width: size,
          height: size,
        }}
      >
        <svg
          aria-hidden="true"
          height={size}
          style={{ gridArea: "1 / 1", contain: "layout style paint" }}
          width={size}
        >
          <Group left={center} top={center}>
            {scrubRingLayers
              ? scrubRingLayers.map((layer) => (
                  <g key={layer.key}>
                    <path d={layer.bgPath} fill={ringCssVars.ringBackground} />
                    {layer.progressPath ? (
                      <path d={layer.progressPath} fill={layer.color} />
                    ) : null}
                  </g>
                ))
              : null}
            {svgChildren}
          </Group>
        </svg>

        {centerChildren.length > 0 && (
          <div
            className="pointer-events-none flex items-center justify-center"
            style={{ gridArea: "1 / 1" }}
          >
            {centerChildren}
          </div>
        )}
      </div>
    </RingProvider>
  )
}, ringChartCorePropsEqual)
function ringChartCorePropsEqual(
  prev: RingChartInnerProps,
  next: RingChartInnerProps
): boolean {
  return (
    prev.width === next.width &&
    prev.height === next.height &&
    prev.data === next.data &&
    prev.strokeWidth === next.strokeWidth &&
    prev.ringGap === next.ringGap &&
    prev.baseInnerRadius === next.baseInnerRadius &&
    prev.hoveredIndexProp === next.hoveredIndexProp &&
    prev.onHoverChange === next.onHoverChange &&
    prev.startAngle === next.startAngle &&
    prev.endAngle === next.endAngle &&
    prev.enterTransition === next.enterTransition &&
    prev.enterStaggerScale === next.enterStaggerScale &&
    prev.geometryScrubbing === next.geometryScrubbing &&
    prev.children === next.children
  )
}
export function RingChart({
  data,
  size: fixedSize,
  strokeWidth = 12,
  ringGap = 6,
  baseInnerRadius = 60,
  className = "",
  hoveredIndex,
  onHoverChange,
  startAngle = -Math.PI / 2,
  endAngle = (3 * Math.PI) / 2,
  enterTransition,
  enterStaggerScale = 1,
  geometryScrubbing = false,
  children,
}: RingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  if (fixedSize) {
    return (
      <div
        className={cn("relative flex items-center justify-center", className)}
        ref={containerRef}
        style={{ width: fixedSize, height: fixedSize }}
      >
        <RingChartInner
          baseInnerRadius={baseInnerRadius}
          containerRef={containerRef}
          data={data}
          endAngle={endAngle}
          enterStaggerScale={enterStaggerScale}
          enterTransition={enterTransition}
          geometryScrubbing={geometryScrubbing}
          height={fixedSize}
          hoveredIndexProp={hoveredIndex}
          onHoverChange={onHoverChange}
          ringGap={ringGap}
          startAngle={startAngle}
          strokeWidth={strokeWidth}
          width={fixedSize}
        >
          {children}
        </RingChartInner>
      </div>
    )
  }
  return (
    <div
      className={cn("relative aspect-square w-full", className)}
      ref={containerRef}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <RingChartInner
            baseInnerRadius={baseInnerRadius}
            containerRef={containerRef}
            data={data}
            endAngle={endAngle}
            enterStaggerScale={enterStaggerScale}
            enterTransition={enterTransition}
            geometryScrubbing={geometryScrubbing}
            height={height}
            hoveredIndexProp={hoveredIndex}
            onHoverChange={onHoverChange}
            ringGap={ringGap}
            startAngle={startAngle}
            strokeWidth={strokeWidth}
            width={width}
          >
            {children}
          </RingChartInner>
        )}
      </ParentSize>
    </div>
  )
}
export default RingChart
