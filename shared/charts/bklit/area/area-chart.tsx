"use client"

import { ParentSize } from "@visx/responsive"
import type { Transition } from "motion/react"
import {
  Children,
  type CSSProperties,
  isValidElement,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/shared/lib/utils"
import { Area, type AreaProps } from "./area"
import type { LineConfig, Margin } from "../core/chart-context"
import { ChartLoadingLabel } from "../loading/chart-loading-label"
import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  resolveRestingChartPhase,
} from "../core/chart-phase"
import { PatternArea } from "../patterns/pattern-area"
import { TimeSeriesChartInner } from "../core/time-series-chart-shell"

export interface AreaChartProps {
  data: Record<string, unknown>[]

  xDataKey?: string

  margin?: Partial<Margin>

  animationDuration?: number

  animationEasing?: string

  enterTransition?: Transition

  revealSignature?: string

  aspectRatio?: string

  className?: string

  status?: ChartStatus

  loadingLabel?: string

  yDomainTweenDuration?: number

  yDomainTween?: boolean

  xDomain?: [Date, Date]

  xDomainSlotCount?: number

  tweenYDomainOnXDomainChange?: boolean

  style?: CSSProperties

  onPhaseChange?: (phase: ChartPhase) => void

  children: ReactNode
}

const DEFAULT_MARGIN: Margin = { top: 40, right: 40, bottom: 40, left: 40 }

function extractAreaConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return
    }

    const childType = child.type as {
      displayName?: string
      name?: string
    }
    const componentName =
      typeof child.type === "function"
        ? childType.displayName || childType.name || ""
        : ""

    const props = child.props as AreaProps | undefined
    const isPatternArea =
      componentName === "PatternArea" || child.type === PatternArea
    const isAreaComponent =
      componentName === "Area" ||
      child.type === Area ||
      (props &&
        typeof props.dataKey === "string" &&
        props.dataKey.length > 0 &&
        !isPatternArea)

    if (isAreaComponent && props?.dataKey) {
      configs.push({
        dataKey: props.dataKey,
        stroke: props.stroke || props.fill || "var(--chart-line-primary)",
        strokeWidth: props.strokeWidth || 2,
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
  animationEasing?: string
  enterTransition?: Transition
  revealSignature?: string
  chartStatus: ChartStatus
  loadingLabel?: string
  yDomainTweenDuration: number
  yDomainTween: boolean
  xDomain?: [Date, Date]
  xDomainSlotCount?: number
  tweenYDomainOnXDomainChange?: boolean
  children: ReactNode
  containerRef: React.RefObject<HTMLDivElement | null>
  onPhaseChange: (phase: ChartPhase) => void
}

function ChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing,
  enterTransition,
  revealSignature,
  chartStatus,
  loadingLabel,
  yDomainTweenDuration,
  yDomainTween,
  xDomain,
  xDomainSlotCount,
  tweenYDomainOnXDomainChange,
  children,
  containerRef,
  onPhaseChange,
}: ChartInnerProps) {
  const lines = useMemo(() => extractAreaConfigs(children), [children])

  return (
    <TimeSeriesChartInner
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      chartStatus={chartStatus}
      clipPathId="chart-area-grow-clip"
      containerRef={containerRef}
      data={data}
      enterTransition={enterTransition}
      height={height}
      lines={lines}
      loadingLabel={loadingLabel}
      margin={margin}
      onPhaseChange={onPhaseChange}
      revealSignature={revealSignature}
      tweenYDomainOnXDomainChange={tweenYDomainOnXDomainChange}
      width={width}
      xDataKey={xDataKey}
      xDomain={xDomain}
      xDomainSlotCount={xDomainSlotCount}
      yDomainTween={yDomainTween}
      yDomainTweenDuration={yDomainTweenDuration}
    >
      {children}
    </TimeSeriesChartInner>
  )
}

export function AreaChart({
  data,
  xDataKey = "date",
  margin: marginProp,
  animationDuration = 1100,
  animationEasing,
  enterTransition,
  revealSignature,
  aspectRatio = "2 / 1",
  className = "",
  status = DEFAULT_CHART_STATUS,
  loadingLabel,
  yDomainTweenDuration = DEFAULT_Y_DOMAIN_TWEEN_MS,
  yDomainTween = true,
  xDomain,
  xDomainSlotCount,
  tweenYDomainOnXDomainChange = false,
  style,
  onPhaseChange,
  children,
}: AreaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const margin = { ...DEFAULT_MARGIN, ...marginProp }
  const [chartPhase, setChartPhase] = useState<ChartPhase>(() =>
    resolveRestingChartPhase(status)
  )
  const handlePhaseChange = useCallback(
    (phase: ChartPhase) => {
      setChartPhase(phase)
      onPhaseChange?.(phase)
    },
    [onPhaseChange]
  )

  const showLoadingLabel = Boolean(
    loadingLabel?.trim() &&
    (chartPhase === "loading" ||
      chartPhase === "exiting" ||
      chartPhase === "gridTweenReady" ||
      chartPhase === "revealingLoading")
  )

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      style={{ aspectRatio, touchAction: "none", ...style }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            animationDuration={animationDuration}
            animationEasing={animationEasing}
            chartStatus={status}
            containerRef={containerRef}
            data={data}
            enterTransition={enterTransition}
            height={height}
            loadingLabel={loadingLabel}
            margin={margin}
            onPhaseChange={handlePhaseChange}
            revealSignature={revealSignature}
            tweenYDomainOnXDomainChange={tweenYDomainOnXDomainChange}
            width={width}
            xDataKey={xDataKey}
            xDomain={xDomain}
            xDomainSlotCount={xDomainSlotCount}
            yDomainTween={yDomainTween}
            yDomainTweenDuration={yDomainTweenDuration}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
      {showLoadingLabel ? (
        <ChartLoadingLabel
          exiting={chartPhase !== "loading"}
          text={loadingLabel}
        />
      ) : null}
    </div>
  )
}

export { Area, type AreaProps } from "./area"

export default AreaChart
