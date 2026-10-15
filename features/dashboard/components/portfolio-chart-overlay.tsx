"use client"

import { useId } from "react"
import type { PortfolioSegment } from "@/features/dashboard/helpers/portfolio-series"
import { useChart } from "@/shared/charts/bklit"

const STRIP_OFFSET = 18
const LABEL_OFFSET = 44
const STRIP_HEIGHT = 8
const DASH_GAP = 9
const DIAMOND_SIZE = 7
const ACTIVE_DIAMOND_SIZE = 9
const DOT_RADIUS = 5
const CAP_WIDTH = 4
const CAP_HEIGHT = 6

const ACTIVE_COLOR = "var(--chart-1)"
const IDLE_COLOR = "var(--chart-strip)"

type OverlayProps = {
  segments: PortfolioSegment[]
}

const useActiveSegment = (segments: PortfolioSegment[]) => {
  const chart = useChart()
  const { tooltipData, xAccessor, lines } = chart

  const hoveredDate = tooltipData ? xAccessor(tooltipData.point) : null
  const activeIndex = hoveredDate
    ? segments.findIndex(
        ({ start, end }) => hoveredDate >= start && hoveredDate <= end
      )
    : -1
  const dataKey = lines[0]?.dataKey

  return {
    ...chart,
    activeIndex,
    cursorX: tooltipData?.x ?? 0,
    cursorY: dataKey ? (tooltipData?.yPositions[dataKey] ?? 0) : 0,
    stripY: chart.innerHeight + STRIP_OFFSET,
  }
}

const Diamond = ({
  x,
  y,
  size,
  fill,
}: {
  x: number
  y: number
  size: number
  fill: string
}) => (
  <rect
    fill={fill}
    height={size}
    rx={1.5}
    transform={`rotate(45 ${x} ${y})`}
    width={size}
    x={x - size / 2}
    y={y - size / 2}
  />
)

const StripDash = ({
  from,
  to,
  y,
  fill,
}: {
  from: number
  to: number
  y: number
  fill: string
}) =>
  to > from ? (
    <rect
      fill={fill}
      height={STRIP_HEIGHT}
      rx={STRIP_HEIGHT / 2}
      width={to - from}
      x={from}
      y={y - STRIP_HEIGHT / 2}
    />
  ) : null

export const PortfolioChartBackground = ({ segments }: OverlayProps) => {
  const { xScale, innerHeight, margin, activeIndex, cursorX, stripY } =
    useActiveSegment(segments)
  const patternId = useId()

  const top = -margin.top
  const fullHeight = innerHeight + margin.top + margin.bottom
  const activeSegment = segments[activeIndex]
  const boundaries = segments.flatMap(({ start }, index) =>
    index === 0 ? [] : [xScale(start)]
  )

  return (
    <g className="pointer-events-none">
      <defs>
        <pattern
          id={patternId}
          width={6}
          height={6}
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line
            stroke="var(--chart-hatch)"
            strokeWidth={2}
            x1={0}
            x2={0}
            y1={0}
            y2={6}
          />
        </pattern>
      </defs>

      {boundaries.map((x) => (
        <line
          key={x}
          stroke="var(--chart-day-separator)"
          x1={x}
          x2={x}
          y1={top}
          y2={top + fullHeight}
        />
      ))}

      {activeSegment && (
        <>
          <rect
            fill={`url(#${patternId})`}
            height={fullHeight}
            width={xScale(activeSegment.end) - xScale(activeSegment.start)}
            x={xScale(activeSegment.start)}
            y={top}
          />
          <line
            stroke={ACTIVE_COLOR}
            strokeOpacity={0.85}
            strokeWidth={1.5}
            x1={cursorX}
            x2={cursorX}
            y1={top + CAP_HEIGHT}
            y2={top + fullHeight - CAP_HEIGHT}
          />
          {[top, top + fullHeight - CAP_HEIGHT].map((y) => (
            <rect
              key={y}
              fill={ACTIVE_COLOR}
              height={CAP_HEIGHT}
              width={CAP_WIDTH}
              x={cursorX - CAP_WIDTH / 2}
              y={y}
            />
          ))}
        </>
      )}

      {segments.map(({ start, end, label }, index) => {
        const x0 = xScale(start)
        const x1 = xScale(end)
        const isActive = index === activeIndex

        return (
          <g key={start.getTime()}>
            {isActive ? (
              <>
                <StripDash
                  fill={ACTIVE_COLOR}
                  from={x0 + DASH_GAP}
                  to={cursorX - DASH_GAP}
                  y={stripY}
                />
                <StripDash
                  fill={ACTIVE_COLOR}
                  from={cursorX + DASH_GAP}
                  to={x1 - DASH_GAP}
                  y={stripY}
                />
              </>
            ) : (
              <StripDash
                fill={IDLE_COLOR}
                from={x0 + DASH_GAP}
                to={x1 - DASH_GAP}
                y={stripY}
              />
            )}
            <text
              fill={isActive ? ACTIVE_COLOR : "var(--muted-foreground)"}
              fontSize={12}
              textAnchor="middle"
              x={(x0 + x1) / 2}
              y={innerHeight + LABEL_OFFSET}
            >
              {label}
            </text>
          </g>
        )
      })}

      {[xScale(segments[0]?.start ?? 0), ...boundaries].map((x) => (
        <Diamond
          key={x}
          fill={IDLE_COLOR}
          size={DIAMOND_SIZE}
          x={x}
          y={stripY}
        />
      ))}
    </g>
  )
}

PortfolioChartBackground.displayName = "Background"

export const PortfolioChartCursor = ({ segments }: OverlayProps) => {
  const { activeIndex, cursorX, cursorY, stripY } = useActiveSegment(segments)

  if (activeIndex < 0) return null

  return (
    <g className="pointer-events-none">
      <Diamond
        fill={ACTIVE_COLOR}
        size={ACTIVE_DIAMOND_SIZE}
        x={cursorX}
        y={stripY}
      />
      <circle
        cx={cursorX}
        cy={cursorY}
        fill={ACTIVE_COLOR}
        r={DOT_RADIUS}
        stroke="var(--primary-foreground)"
        strokeWidth={2}
      />
    </g>
  )
}

PortfolioChartCursor.__isPostOverlay = true
