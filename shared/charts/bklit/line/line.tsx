"use client"

import type { CurveFactory } from "@visx/vendor/d3-shape"
import { curveNatural } from "@visx/curve"
import { LinePath } from "@visx/shape"

import { type Ref, useCallback, useId, useMemo, useState } from "react"
import { chartCssVars, useChartStable, useYScale } from "../core/chart-context"
import type { LoadingStyle } from "../core/chart-phase"
import {
  type FadeEdges,
  fadeGradientStops,
  resolveFadeSides,
  viewportFadeGradientAttrs,
} from "../utils/fade-edges"
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
import { useAnimatedSeriesPath } from "../hooks/use-animated-series-path"

export interface LineProps {
  dataKey: string
  yAxisId?: string | number
  stroke?: string
  strokeWidth?: number
  curve?: CurveFactory
  animate?: boolean
  fadeEdges?: FadeEdges
  showHighlight?: boolean
  showMarkers?: boolean
  markers?: SeriesPointMarkerStyle
  dashFromIndex?: number
  dashArray?: string
  loading?: boolean
  loadingStroke?: string
  loadingStrokeOpacity?: number
  loadingPulseMode?: LineLoadingPulseMode
  onLoadingPulseCycleComplete?: () => void
  loadingStyle?: LoadingStyle
}

function LineSeriesStroke({
  animatedPathD,
  curve,
  getY,
  measureRef,
  renderData,
  strokeWidth,
  useDataTransitionPath,
  visibleStroke,
  xAccessor,
  xScale,
}: {
  animatedPathD: string
  curve: CurveFactory
  getY: (datum: Record<string, unknown>) => number
  measureRef: Ref<SVGPathElement>
  renderData: Record<string, unknown>[]
  strokeWidth: number
  useDataTransitionPath: boolean
  visibleStroke: string
  xAccessor: (datum: Record<string, unknown>) => Date
  xScale: (value: Date) => number | undefined
}) {
  if (useDataTransitionPath && animatedPathD) {
    return (
      <path
        d={animatedPathD}
        fill="none"
        ref={measureRef}
        stroke={visibleStroke}
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
    )
  }

  return (
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
  )
}

function LineLoadingOverlays({
  curve,
  handleLoadingPulseComplete,
  innerWidth,
  loadingStroke,
  loadingStrokeOpacity,
  loadingStyle,
  pathD,
  pulseEpoch,
  pulseMode,
  showLoadingPulse,
  strokeWidth,
}: {
  curve: CurveFactory
  handleLoadingPulseComplete: () => void
  innerWidth: number
  loadingStroke: string
  loadingStrokeOpacity: number
  loadingStyle: LoadingStyle
  pathD: string | null
  pulseEpoch: number
  pulseMode: LineLoadingPulseMode | null
  showLoadingPulse: boolean
  strokeWidth: number
}) {
  const sweepLoading =
    showLoadingPulse && innerWidth > 0 && loadingStyle === "sweep"
  const pulseLoading = showLoadingPulse && innerWidth > 0 && !sweepLoading

  return (
    <>
      {sweepLoading ? (
        <LineLoadingSweep
          curve={curve}
          key="loading-sweep"
          mode={pulseMode ?? "loop"}
          onTransitionComplete={handleLoadingPulseComplete}
          stroke={loadingStroke}
          strokeOpacity={loadingStrokeOpacity}
          strokeWidth={strokeWidth}
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

export function Line({
  dataKey,
  yAxisId,
  stroke = chartCssVars.linePrimary,
  strokeWidth = 2.5,
  curve = curveNatural,
  animate = true,
  fadeEdges = true,
  showHighlight = true,
  showMarkers = false,
  markers,
  dashFromIndex,
  dashArray = "6,4",
  loading,
  loadingStroke = chartCssVars.foreground,
  loadingStrokeOpacity = 0.5,
  loadingPulseMode,
  onLoadingPulseCycleComplete,
  loadingStyle = "pulse",
}: LineProps) {
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
    yDomainTweenDuration,
  } = useChartStable()
  const yScale = useYScale(yAxisId)
  const useDataTransitionPath = animate && chartPhase === "ready"
  const { pathD: animatedPathD } = useAnimatedSeriesPath({
    chartPhase,
    curve,
    dataKey,
    durationMs: yDomainTweenDuration,
    enabled: useDataTransitionPath,
    innerWidth,
    renderData,
    xAccessor,
    xScale,
    yScale,
  })

  const phasePulseMode = resolveLineLoadingPulseMode(chartPhase)
  const pulseMode =
    loading === false
      ? null
      : (loadingPulseMode ?? (loading === true ? "loop" : phasePulseMode))
  const showLoadingPulse = pulseMode != null
  const [pulseEpoch, setPulseEpoch] = useState(0)
  const effectiveShowHighlight = showHighlight && !showLoadingPulse

  const handleLoadingPulseComplete = useCallback(() => {
    onLoadingPulseCycleComplete?.()
    if (pulseMode === "loop") {
      window.setTimeout(() => {
        setPulseEpoch((epoch) => epoch + 1)
      }, LINE_LOADING_LOOP_PAUSE_MS)
      return
    }
    notifyLoadingPulseComplete?.()
  }, [notifyLoadingPulseComplete, onLoadingPulseCycleComplete, pulseMode])

  const seriesIndex = useMemo(() => {
    const index = lines.findIndex((line) => line.dataKey === dataKey)
    return index >= 0 ? index : 0
  }, [lines, dataKey])

  const { pathLength, pathD, pathRef, measureRef } = usePathStrokeMetrics()

  const reactId = useId()
  const gradientId = `line-gradient-${dataKey}-${reactId}`

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const value = d[dataKey]
      return typeof value === "number" ? (yScale(value) ?? 0) : 0
    },
    [dataKey, yScale]
  )

  const hasDashTail = resolveDashTailBounds(dashFromIndex, data.length)
  const fadeSides = resolveFadeSides(fadeEdges)
  const lineStroke = fadeSides.any ? `url(#${gradientId})` : stroke
  const fadeStops = fadeSides.any ? fadeGradientStops(fadeSides) : null
  const showSeriesStroke =
    chartPhase === "revealing" ||
    chartPhase === "ready" ||
    chartPhase === "exitingReady"
  let visibleStroke = "transparent"
  if (showSeriesStroke && !hasDashTail) {
    visibleStroke = lineStroke
  }

  return (
    <>
      {fadeStops ? (
        <defs>
          <linearGradient
            id={gradientId}
            {...viewportFadeGradientAttrs(innerWidth)}
          >
            {fadeStops.map((stop) => (
              <stop
                key={stop.offset}
                offset={stop.offset}
                style={{ stopColor: stroke, stopOpacity: stop.opacity }}
              />
            ))}
          </linearGradient>
        </defs>
      ) : null}

      <SeriesHoverDim
        dimOpacity={0.3}
        enabled={effectiveShowHighlight}
        seriesIndex={seriesIndex}
      >
        <LineSeriesStroke
          animatedPathD={animatedPathD}
          curve={curve}
          getY={getY}
          measureRef={measureRef}
          renderData={renderData}
          strokeWidth={strokeWidth}
          useDataTransitionPath={useDataTransitionPath}
          visibleStroke={visibleStroke}
          xAccessor={xAccessor}
          xScale={xScale}
        />

        <SeriesDashTailOverlay
          dashArray={dashArray}
          dashFromIndex={dashFromIndex}
          data={data}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          pathD={pathD}
          pathLength={pathLength}
          stroke={lineStroke}
          strokeWidth={strokeWidth}
          xAccessor={xAccessor}
          xScale={xScale}
        />
      </SeriesHoverDim>

      {showMarkers ? (
        <SeriesMarkers
          animate={animate}
          dataKey={dataKey}
          {...markers}
          fill={markers?.fill ?? stroke}
          stroke={markers?.stroke ?? markers?.fill ?? stroke}
        />
      ) : null}

      <SeriesHighlightLayer
        enabled={effectiveShowHighlight}
        height={innerHeight}
        pathRef={pathRef}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <LineLoadingOverlays
        curve={curve}
        handleLoadingPulseComplete={handleLoadingPulseComplete}
        innerWidth={innerWidth}
        loadingStroke={loadingStroke}
        loadingStrokeOpacity={loadingStrokeOpacity}
        loadingStyle={loadingStyle}
        pathD={pathD}
        pulseEpoch={pulseEpoch}
        pulseMode={pulseMode}
        showLoadingPulse={showLoadingPulse}
        strokeWidth={strokeWidth}
      />
    </>
  )
}

Line.displayName = "Line"

export default Line
