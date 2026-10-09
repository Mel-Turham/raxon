"use client"

import { useChart } from "@/components/charts/chart-context"
import { AnimatedNumber } from "@/components/shared/animated-number"
import type { PortfolioHistoryPoint } from "@/lib/portfolio-history"

const ACTIVITY_HEIGHT = 0.42
const LABEL_COUNT = 7
const LABEL_OFFSET = 22

type HistoryBackdropProps = {
  labelFormat: Intl.DateTimeFormatOptions
}

/**
 * Activity bars behind the line + period labels under the plot.
 * Named "Background" so the chart shell draws it under the series.
 */
export const HistoryBackdrop = ({ labelFormat }: HistoryBackdropProps) => {
  const { data, xScale, innerHeight, columnWidth } = useChart()
  const points = data as PortfolioHistoryPoint[]
  const barWidth = Math.max(2, columnWidth * 0.6)
  const formatter = new Intl.DateTimeFormat("en-GB", labelFormat)
  const labelStep = Math.max(
    1,
    Math.round((points.length - 1) / (LABEL_COUNT - 1))
  )

  return (
    <g className="pointer-events-none">
      {points.map((point) => {
        const height = point.activity * innerHeight * ACTIVITY_HEIGHT
        return (
          <rect
            key={point.date.getTime()}
            fill="var(--chart-activity)"
            height={height}
            width={barWidth}
            x={(xScale(point.date) ?? 0) - barWidth / 2}
            y={innerHeight - height}
          />
        )
      })}
      {points
        .filter((_, index) => index % labelStep === 0)
        .map((point, index, labels) => (
          <text
            key={point.date.getTime()}
            fill="var(--muted-foreground)"
            fontSize={11}
            textAnchor={
              index === 0
                ? "start"
                : index === labels.length - 1
                  ? "end"
                  : "middle"
            }
            x={xScale(point.date) ?? 0}
            y={innerHeight + LABEL_OFFSET}
          >
            {formatter.format(point.date)}
          </text>
        ))}
    </g>
  )
}

HistoryBackdrop.displayName = "Background"

const TIP = { width: 160, height: 44, gap: 16, caret: 8 }
const TIP_FORMAT = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
} as const

/**
 * Hover point with a value bubble centered above it (caret pointing down);
 * flips below the point near the top edge. Drawn above the line.
 */
export const HistoryPointTooltip = () => {
  const { tooltipData, lines } = useChart()
  const dataKey = lines[0]?.dataKey
  if (!tooltipData || !dataKey) return null

  const point = tooltipData.point as PortfolioHistoryPoint
  const x = tooltipData.x
  const y = tooltipData.yPositions[dataKey] ?? 0
  const below = y < TIP.height + TIP.gap
  const boxY = below ? y + TIP.gap : y - TIP.gap - TIP.height

  return (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} fill="var(--chart-point-halo)" r={13} />
      <circle cx={x} cy={y} fill="var(--chart-1)" r={7} />
      <foreignObject
        height={TIP.height + TIP.caret}
        overflow="visible"
        width={TIP.width}
        x={x - TIP.width / 2}
        y={below ? boxY - TIP.caret : boxY}
      >
        <div
          className={
            below
              ? "flex h-full flex-col-reverse items-center"
              : "flex h-full flex-col items-center"
          }
        >
          <div className="flex h-[44px] items-center bg-popover px-4 text-lg font-semibold text-popover-foreground shadow-(--chart-tooltip-shadow)">
            <AnimatedNumber format={TIP_FORMAT} value={point.value} />
          </div>
          {/* Caret pointing at the point. */}
          <span
            aria-hidden
            className={
              below
                ? "size-0 border-x-[8px] border-b-[8px] border-x-transparent border-b-popover"
                : "size-0 border-x-[8px] border-t-[8px] border-x-transparent border-t-popover"
            }
          />
        </div>
      </foreignObject>
    </g>
  )
}

HistoryPointTooltip.__isPostOverlay = true
