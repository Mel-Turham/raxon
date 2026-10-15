"use client"

import { ParentSize } from "@visx/responsive"
import { scaleLinear } from "@visx/scale"

import type { OrderBook, OrderBookLevel } from "@/features/trade/types"

const MARGIN = { top: 12, right: 12, bottom: 28, left: 12 }
const TICKS = 5

const tickFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const cumulate = (levels: OrderBookLevel[]) => {
  let total = 0
  return levels.map(({ price, amount }) => ({
    price,
    total: (total += amount),
  }))
}

type DepthSide = ReturnType<typeof cumulate>

const stepPath = (
  points: DepthSide,
  x: (price: number) => number,
  y: (total: number) => number,
  baseline: number
) => {
  const [first, ...rest] = points
  if (!first) return ""
  let d = `M${x(first.price)},${baseline}L${x(first.price)},${y(first.total)}`
  let previous = first
  for (const point of rest) {
    d += `L${x(point.price)},${y(previous.total)}L${x(point.price)},${y(point.total)}`
    previous = point
  }
  return `${d}L${x(previous.price)},${baseline}`
}

const DepthPlot = ({
  book,
  width,
  height,
}: {
  book: OrderBook
  width: number
  height: number
}) => {
  const bids = cumulate(book.bids)
  const asks = cumulate(book.asks)
  const innerWidth = width - MARGIN.left - MARGIN.right
  const innerHeight = height - MARGIN.top - MARGIN.bottom
  if (innerWidth <= 0 || innerHeight <= 0) return null

  const prices = [...bids, ...asks].map((point) => point.price)
  const x = scaleLinear({
    domain: [Math.min(...prices), Math.max(...prices)],
    range: [0, innerWidth],
  })
  const y = scaleLinear({
    domain: [0, Math.max(bids.at(-1)?.total ?? 0, asks.at(-1)?.total ?? 0)],
    range: [innerHeight, 0],
    nice: true,
  })
  const sides = [
    { key: "bids", points: bids, color: "var(--chart-candle-up)" },
    { key: "asks", points: asks, color: "var(--chart-candle-down)" },
  ]

  return (
    <svg aria-label="Market depth" height={height} role="img" width={width}>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {y.ticks(TICKS).map((tick) => (
          <line
            key={tick}
            stroke="var(--chart-day-separator)"
            x1={0}
            x2={innerWidth}
            y1={y(tick)}
            y2={y(tick)}
          />
        ))}
        {sides.map(({ key, points, color }) => (
          <path
            key={key}
            d={stepPath(points, x, y, innerHeight)}
            fill={color}
            fillOpacity={0.15}
            stroke={color}
            strokeWidth={1.5}
          />
        ))}
        <line
          stroke="var(--muted-foreground)"
          strokeDasharray="3 4"
          x1={x(book.lastPrice)}
          x2={x(book.lastPrice)}
          y1={0}
          y2={innerHeight}
        />
        {x.ticks(TICKS).map((tick) => (
          <text
            key={tick}
            fill="var(--muted-foreground)"
            fontSize={11}
            textAnchor="middle"
            x={x(tick)}
            y={innerHeight + 18}
          >
            {tickFormatter.format(tick)}
          </text>
        ))}
      </g>
    </svg>
  )
}

export const DepthChart = ({ book }: { book: OrderBook }) => (
  <ParentSize debounceTime={10}>
    {({ width, height }) => (
      <DepthPlot book={book} height={height} width={width} />
    )}
  </ParentSize>
)
