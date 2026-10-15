"use client"

import { ParentSize } from "@visx/responsive"
import type { Transition } from "motion/react"
import {
  Children,
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/shared/lib/utils"
import type { LineConfig, Margin } from "../core/chart-context"
import { ChartLoadingLabel } from "../loading/chart-loading-label"
import {
  type ChartPhase,
  type ChartStatus,
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  resolveRestingChartPhase,
} from "../core/chart-phase"
import { Line, type LineProps } from "./line"
import { TimeSeriesChartInner } from "../core/time-series-chart-shell"

export interface LineChartProps {
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

const LINE_DOMAIN_EXCLUDED_NAMES = new Set([
  "LineSeriesTerminalMarker",
  "Area",
  "SeriesBar",
  "Scatter",
  "Candlestick",
  "Bar",
  "PatternArea",
])

function getChildComponentName(child: ReactElement) {
  const childType = child.type as { displayName?: string; name?: string }
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : ""
}

function registersLineDomain(
  child: ReactElement,
  props: LineProps | undefined
) {
  if (!props?.dataKey) {
    return false
  }

  const componentName = getChildComponentName(child)
  if (componentName === "Line" || child.type === Line) {
    return true
  }
  if (LINE_DOMAIN_EXCLUDED_NAMES.has(componentName)) {
    return false
  }
  return typeof props.dataKey === "string" && props.dataKey.length > 0
}

function extractLineConfigs(children: ReactNode): LineConfig[] {
  const configs: LineConfig[] = []

  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        return
      }

      const props = child.props as LineProps | undefined

      if (registersLineDomain(child, props) && props?.dataKey) {
        configs.push({
          dataKey: props.dataKey,
          stroke: props.stroke || "var(--chart-line-primary)",
          strokeWidth: props.strokeWidth || 2.5,
          yAxisId: props.yAxisId,
        })
        return
      }

      const childProps = child.props as { children?: ReactNode } | undefined
      if (childProps?.children) {
        visit(childProps.children)
      }
    })
  }

  visit(children)
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
  const lines = useMemo(() => extractLineConfigs(children), [children])

  return (
    <TimeSeriesChartInner
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      chartStatus={chartStatus}
      clipPathId="chart-grow-clip"
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

export function LineChart({
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
}: LineChartProps) {
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
      style={{
        ...(aspectRatio ? { aspectRatio } : undefined),
        touchAction: "none",
        ...style,
      }}
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

export { Line, type LineProps } from "./line"

export default LineChart
