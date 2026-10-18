"use client"

import { MOVING_AVERAGES } from "@/features/trade/constants"
import { useChart } from "@/shared/charts/bklit"
import type { Candle } from "@/shared/charts/lib/candles"

const TAG_WIDTH = 56
const TAG_HEIGHT = 18
const TAG_GAP = 6

const tagPriceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const VolumeBars = ({ height }: { height: number }) => {
  const { data, xScale, innerHeight, columnWidth, bandWidth } = useChart()
  const candles = data as Candle[]
  const maxVolume = Math.max(...candles.map((candle) => candle.volume))
  const barWidth = Math.min(bandWidth ?? columnWidth * 0.65, columnWidth)

  return (
    <g className="pointer-events-none">
      {candles.map((candle) => {
        const barHeight = (candle.volume / maxVolume) * height
        const isUp = candle.close >= candle.open
        return (
          <rect
            key={candle.date.getTime()}
            fill={isUp ? "var(--chart-candle-up)" : "var(--chart-candle-down)"}
            style={{ fillOpacity: "var(--chart-volume-opacity)" }}
            height={barHeight}
            width={barWidth}
            x={(xScale(candle.date) ?? 0) - barWidth / 2}
            y={innerHeight + height - barHeight + TAG_GAP}
          />
        )
      })}
    </g>
  )
}

const TAG_SPACING = TAG_HEIGHT + 2

export const MovingAverages = () => {
  const { data, xScale, yScale, innerWidth } = useChart()
  const candles = data as Candle[]

  const series = MOVING_AVERAGES.flatMap(({ key, color }) => {
    const points = candles.flatMap((candle) => {
      const value = candle[key]
      return value === undefined
        ? []
        : [{ x: xScale(candle.date) ?? 0, y: yScale(value) ?? 0, value }]
    })
    const last = points.at(-1)
    return last ? [{ key, color, points, last, tagY: last.y }] : []
  })

  const byHeight = [...series].sort((a, b) => a.last.y - b.last.y)
  byHeight.forEach((item, index) => {
    const previous = byHeight[index - 1]
    if (previous && item.tagY - previous.tagY < TAG_SPACING) {
      item.tagY = previous.tagY + TAG_SPACING
    }
  })

  return (
    <g className="pointer-events-none">
      {series.map(({ key, color, points, last, tagY }) => (
        <g key={key}>
          <path
            d={points
              .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x},${y}`)
              .join("")}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
          <polyline
            fill="none"
            points={`${last.x},${last.y} ${innerWidth},${last.y} ${innerWidth + TAG_GAP},${tagY}`}
            stroke={color}
            strokeDasharray="2 3"
          />
          <rect
            fill={color}
            height={TAG_HEIGHT}
            width={TAG_WIDTH}
            x={innerWidth + TAG_GAP}
            y={tagY - TAG_HEIGHT / 2}
          />
          <text
            dominantBaseline="central"
            fill="var(--primary-foreground)"
            fontSize={11}
            textAnchor="middle"
            x={innerWidth + TAG_GAP + TAG_WIDTH / 2}
            y={tagY}
          >
            {tagPriceFormatter.format(last.value)}
          </text>
        </g>
      ))}
    </g>
  )
}

export const LastPriceLine = () => {
  const { data, yScale, innerWidth } = useChart()
  const last = (data as Candle[]).at(-1)
  if (!last) return null

  const y = yScale(last.close) ?? 0
  const color =
    last.close >= last.open
      ? "var(--chart-candle-up)"
      : "var(--chart-candle-down)"

  return (
    <g
      className="pointer-events-none"
      style={{
        transform: `translateY(${y}px)`,
        transition: "transform 0.3s ease-out",
      }}
    >
      <line
        stroke={color}
        strokeDasharray="4 3"
        x1={0}
        x2={innerWidth + TAG_GAP}
        y1={0}
        y2={0}
      />
      <rect
        fill={color}
        height={TAG_HEIGHT}
        width={TAG_WIDTH}
        x={innerWidth + TAG_GAP}
        y={-TAG_HEIGHT / 2}
      />
      <text
        dominantBaseline="central"
        fill="var(--primary-foreground)"
        fontSize={11}
        textAnchor="middle"
        x={innerWidth + TAG_GAP + TAG_WIDTH / 2}
        y={0}
      >
        {tagPriceFormatter.format(last.close)}
      </text>
    </g>
  )
}

export const CandleTooltip = ({ candle }: { candle: Candle }) => {
  const rows = [
    ["Open", candle.open],
    ["High", candle.high],
    ["Low", candle.low],
    ["Close", candle.close],
  ] as const
  const isUp = candle.close >= candle.open

  return (
    <div className="flex min-w-36 flex-col gap-1 px-3 py-2.5 text-xs">
      <span className="text-[11px] text-muted-foreground">
        {candle.date.toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </span>
      {rows.map(([label, value]) => (
        <span key={label} className="flex justify-between gap-4">
          <span className="text-muted-foreground">{label}</span>
          <span
            className={
              label === "Close"
                ? isUp
                  ? "font-mono text-success"
                  : "font-mono text-destructive"
                : "font-mono"
            }
          >
            {tagPriceFormatter.format(value)}
          </span>
        </span>
      ))}
    </div>
  )
}
