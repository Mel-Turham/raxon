"use client"

import { curveMonotoneX } from "@visx/curve"
import { AreaClosed, LinePath } from "@visx/shape"
import type { CurveFactory } from "@visx/vendor/d3-shape"

import { useCallback, useId, useMemo, useState } from "react"
import { AreaGradientDefs } from "./area-gradient-defs"
import { chartCssVars, useChartStable, useYScale } from "../core/chart-context"
import type { ChartPhase, LoadingStyle } from "../core/chart-phase"
import { type FadeEdges, resolveFadeSides } from "../utils/fade-edges"
import {
  type LineLoadingPulseMode,
  LineLoadingPulseStroke,
  resolveLineLoadingPulseMode,
} from "../loading/line-loading-pulse"
import { LINE_LOADING_LOOP_PAUSE_MS } from "../utils/line-loading-timing"
import { LineLoadingSweep } from "../loading/loading-sweep"
import {
  resolveDashTailBounds,
  usePathStrokeMetrics,
} from "../utils/path-stroke-utils"
import { SeriesDashTailOverlay } from "../series/series-dash-tail-overlay"
import { SeriesHighlightLayer } from "../series/series-highlight-layer"
import { SeriesHoverDim } from "../series/series-hover-dim"
import { SeriesMarkers } from "../series/series-markers"
import type { SeriesPointMarkerStyle } from "../series/series-point-marker"

export interface AreaProps {
  dataKey: string

  yAxisId?: string | number

  fill?: string

  fillOpacity?: number

  stroke?: string

  strokeWidth?: number

  curve?: CurveFactory

  animate?: boolean

  showLine?: boolean

  showHighlight?: boolean

  gradientToOpacity?: number

  gradientSpan?: number

  fadeEdges?: FadeEdges

  showMarkers?: boolean

  markers?: SeriesPointMarkerStyle

  dashFromIndex?: number

  dashArray?: string

  loadingStroke?: string

  loadingStrokeOpacity?: number

  loading?: boolean

  loadingPulseMode?: LineLoadingPulseMode

  loadingStyle?: LoadingStyle
}

function useAreaLoadingPulseState(
  chartPhase: ChartPhase,
  loading: boolean | undefined,
  loadingPulseMode: LineLoadingPulseMode | undefined,
  notifyLoadingPulseComplete?: () => void
) {
  const phasePulseMode = resolveLineLoadingPulseMode(chartPhase)
  const pulseMode =
    loading === false
      ? null
      : (loadingPulseMode ?? (loading === true ? "loop" : phasePulseMode))
  const showLoadingPulse = pulseMode != null
  const showSeriesContent =
    chartPhase === "revealing" ||
    chartPhase === "ready" ||
    chartPhase === "exitingReady"
  const [pulseEpoch, setPulseEpoch] = useState(0)

  const handleLoadingPulseComplete = useCallback(() => {
    if (pulseMode === "loop") {
      window.setTimeout(() => {
        setPulseEpoch((epoch) => epoch + 1)
      }, LINE_LOADING_LOOP_PAUSE_MS)
      return
    }
    notifyLoadingPulseComplete?.()
  }, [notifyLoadingPulseComplete, pulseMode])

  return {
    handleLoadingPulseComplete,
    pulseMode,
    pulseEpoch,
    showLoadingPulse,
    showSeriesContent,
  }
}

export function Area({
  dataKey,
  yAxisId,
  fill = chartCssVars.linePrimary,
  fillOpacity = 0.4,
  stroke,
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
  showLine = true,
  showHighlight = true,
  gradientToOpacity = 0,
  gradientSpan = 1,
  fadeEdges = false,
  showMarkers = false,
  markers,
  dashFromIndex,
  dashArray = "6,4",
  loading,
  loadingStroke = chartCssVars.foreground,
  loadingStrokeOpacity = 0.5,
  loadingPulseMode,
  loadingStyle = "pulse",
}: AreaProps) {
  const {
    data,
    renderData,
    xScale,
    innerHeight,
    innerWidth,
    xAccessor,
    lines,
    chartPhase,
    notifyLoadingPulseComplete,
  } = useChartStable()
  const yScale = useYScale(yAxisId)
  const {
    handleLoadingPulseComplete,
    pulseMode,
    pulseEpoch,
    showLoadingPulse,
    showSeriesContent,
  } = useAreaLoadingPulseState(
    chartPhase,
    loading,
    loadingPulseMode,
    notifyLoadingPulseComplete
  )

  const seriesIndex = useMemo(() => {
    const index = lines.findIndex((line) => line.dataKey === dataKey)
    return index >= 0 ? index : 0
  }, [lines, dataKey])

  const { pathLength, pathD, pathRef, measureRef } = usePathStrokeMetrics()

  const uniqueId = useId()
  const gradientId = `area-gradient-${dataKey}-${uniqueId}`
  const strokeGradientId = `area-stroke-gradient-${dataKey}-${uniqueId}`
  const edgeMaskId = `area-edge-mask-${dataKey}-${uniqueId}`
  const edgeGradientId = `${edgeMaskId}-gradient`

  const isPatternFill = fill.startsWith("url(")
  const showAreaFill = isPatternFill || fillOpacity > 0
  const areaFill = isPatternFill ? fill : `url(#${gradientId})`

  const resolvedStroke =
    stroke || (isPatternFill ? chartCssVars.linePrimary : fill)

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey]
      return typeof value === "number" ? (yScale(value) ?? 0) : 0
    },
    [dataKey, yScale]
  )

  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length)

  const fadeSides = resolveFadeSides(fadeEdges)
  const useViewportEdgeFade = fadeSides.any && !isPatternFill
  let strokePaint = resolvedStroke
  if (!useViewportEdgeFade && fadeSides.any) {
    strokePaint = `url(#${strokeGradientId})`
  }
  const highlightEnabled =
    showHighlight && showLine && !showLoadingPulse && showSeriesContent
  const showSeriesStroke = showSeriesContent && showLine
  let visibleStroke = "transparent"
  if (showSeriesStroke && !hasDashTail) {
    visibleStroke = strokePaint
  }
  const shouldMeasurePath = showLine && (showSeriesContent || showLoadingPulse)

  const seriesLayers = (
    <>
      {showSeriesContent && showAreaFill ? (
        <AreaClosed
          curve={curve}
          data={renderData}
          fill={areaFill}
          x={(d) => xScale(xAccessor(d)) ?? 0}
          y={getY}
          yScale={yScale}
        />
      ) : null}

      {shouldMeasurePath ? (
        <>
          <LinePath
            curve={curve}
            data={renderData}
            innerRef={measureRef}
            stroke={visibleStroke}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            x={(d) => xScale(xAccessor(d)) ?? 0}
            y={getY}
          />
          {showSeriesStroke ? (
            <SeriesDashTailOverlay
              dashArray={dashArray}
              dashFromIndex={dashFromIndex}
              data={data}
              innerHeight={innerHeight}
              innerWidth={innerWidth}
              pathD={pathD}
              pathLength={pathLength}
              stroke={strokePaint}
              strokeWidth={strokeWidth}
              xAccessor={xAccessor}
              xScale={xScale}
            />
          ) : null}
        </>
      ) : null}
    </>
  )

  const sweepLoading =
    showLoadingPulse && innerWidth > 0 && loadingStyle === "sweep"
  const pulseLoading = showLoadingPulse && innerWidth > 0 && !sweepLoading

  return (
    <>
      <AreaGradientDefs
        edgeGradientId={edgeGradientId}
        edgeMaskId={edgeMaskId}
        fadeEdges={fadeEdges}
        fill={fill}
        fillOpacity={fillOpacity}
        gradientId={gradientId}
        gradientSpan={gradientSpan}
        gradientToOpacity={gradientToOpacity}
        innerHeight={innerHeight}
        innerWidth={innerWidth}
        isPatternFill={isPatternFill}
        resolvedStroke={resolvedStroke}
        strokeGradientId={strokeGradientId}
      />

      <SeriesHoverDim
        dimOpacity={0.6}
        enabled={showHighlight}
        seriesIndex={seriesIndex}
      >
        {useViewportEdgeFade ? (
          <g mask={`url(#${edgeMaskId})`}>{seriesLayers}</g>
        ) : (
          seriesLayers
        )}
      </SeriesHoverDim>

      <SeriesHighlightLayer
        enabled={highlightEnabled}
        height={innerHeight}
        pathRef={pathRef}
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
      />

      {showMarkers && showSeriesContent ? (
        <SeriesMarkers
          animate={animate}
          dataKey={dataKey}
          {...markers}
          fill={markers?.fill ?? resolvedStroke}
          stroke={markers?.stroke ?? markers?.fill ?? resolvedStroke}
        />
      ) : null}

      {sweepLoading ? (
        <LineLoadingSweep
          curve={curve}
          key="loading-sweep"
          mode={pulseMode ?? "loop"}
          onTransitionComplete={handleLoadingPulseComplete}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
          withArea
        />
      ) : null}
      {pulseLoading && pathD ? (
        <LineLoadingPulseStroke
          key="loading-pulse"
          loopEpoch={pulseEpoch}
          mode={pulseMode ?? undefined}
          onCycleComplete={handleLoadingPulseComplete}
          pathD={pathD}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </>
  )
}

Area.displayName = "Area"

export default Area
