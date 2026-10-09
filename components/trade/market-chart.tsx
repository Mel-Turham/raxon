"use client"

import { useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { AnimatedNumber } from "@/components/shared/animated-number"
import { SegmentedTabs } from "@/components/shared/segmented-tabs"
import { TokenAvatar } from "@/components/shared/token-avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CANDLE_TIMEFRAMES,
  CANDLE_ZOOM,
  CHART_VIEWS,
  type CandleTimeframe,
  type ChartView,
  DEFAULT_CANDLE_TIMEFRAME,
} from "@/constants"
import type { MarketTicker, OrderBook } from "@/lib/api/types"
import { buildCandles } from "@/lib/candles"
import { decimalFormat } from "@/lib/format"
import { cn } from "@/lib/utils"

import { type ChartToolAction, ChartToolbar } from "./chart-toolbar"
import { ChartAreaSkeleton } from "./skeletons"
import { useTradePair } from "./trade-pair-context"

// The chart stack (visx + motion) loads after first paint.
const PriceChart = dynamic(
  () => import("./price-chart").then((mod) => mod.PriceChart),
  { ssr: false, loading: () => <ChartAreaSkeleton /> }
)
const DepthChart = dynamic(
  () => import("./depth-chart").then((mod) => mod.DepthChart),
  { ssr: false, loading: () => <ChartAreaSkeleton /> }
)

const STAT_FORMAT = decimalFormat(2)

const PairOption = ({ ticker }: { ticker: MarketTicker }) => (
  <span className="flex items-center gap-2.5">
    <TokenAvatar symbol={ticker.base} className="size-8" />
    <span className="flex flex-col text-left leading-tight">
      <span className="text-[10px] text-muted-foreground">{ticker.name}</span>
      <span className="text-sm font-semibold">{ticker.pair}</span>
    </span>
  </span>
)

const TickerStats = ({ ticker }: { ticker: MarketTicker }) => {
  const stats = [
    { label: "24h High", value: ticker.high24h, className: "text-success" },
    { label: "24h Low", value: ticker.low24h, className: "text-destructive" },
    { label: `24h Vol(${ticker.base})`, value: ticker.volumeBase24h },
    { label: `24h Vol(${ticker.quote})`, value: ticker.volumeQuote24h },
  ]

  return (
    <dl className="hidden items-center gap-6 md:flex">
      {stats.map(({ label, value, className }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-[11px] text-muted-foreground">{label}</dt>
          <dd className={cn("font-mono text-sm tabular-nums", className)}>
            <AnimatedNumber format={STAT_FORMAT} value={value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

type MarketChartProps = {
  tickers: MarketTicker[]
  book: OrderBook
}

export const MarketChart = ({ tickers, book }: MarketChartProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const { pair, setPair } = useTradePair()
  const [view, setView] = useState<ChartView>("Candle")
  const [timeframe, setTimeframe] = useState<CandleTimeframe>(
    DEFAULT_CANDLE_TIMEFRAME
  )
  const [visibleCount, setVisibleCount] = useState<number>(CANDLE_ZOOM.default)
  const [showIndicators, setShowIndicators] = useState(true)
  const [showGrid, setShowGrid] = useState(true)

  const ticker = tickers.find((item) => item.pair === pair) ?? tickers[0]
  const candles = useMemo(
    () => buildCandles(ticker.pair, timeframe, ticker.lastPrice),
    [ticker, timeframe]
  )
  const visibleCandles = useMemo(
    () => candles.slice(-visibleCount),
    [candles, visibleCount]
  )

  const zoom = (delta: number) =>
    setVisibleCount((count) =>
      Math.min(CANDLE_ZOOM.max, Math.max(CANDLE_ZOOM.min, count + delta))
    )

  const handleTool = (action: ChartToolAction) => {
    switch (action) {
      case "reset":
        return setVisibleCount(CANDLE_ZOOM.default)
      case "zoomIn":
        return zoom(-CANDLE_ZOOM.step)
      case "zoomOut":
        return zoom(CANDLE_ZOOM.step)
      case "indicators":
        return setShowIndicators((on) => !on)
      case "grid":
        return setShowGrid((on) => !on)
      case "fullscreen":
        return document.fullscreenElement
          ? document.exitFullscreen()
          : cardRef.current?.requestFullscreen()
    }
  }

  return (
    <Card ref={cardRef} className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between gap-6 border-b border-border py-3">
        <Select
          value={pair}
          onValueChange={(value) => setPair(value as string)}
        >
          <SelectTrigger className="h-auto gap-3 border-0 bg-transparent px-0 py-0 dark:bg-transparent dark:hover:bg-transparent">
            <SelectValue>
              {(value: string) => (
                <PairOption
                  ticker={tickers.find((item) => item.pair === value) ?? ticker}
                />
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {tickers.map((item) => (
              <SelectItem key={item.pair} value={item.pair}>
                <PairOption ticker={item} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TickerStats ticker={ticker} />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2 py-3">
        <div className="flex items-center justify-between gap-4">
          <SegmentedTabs
            options={CHART_VIEWS}
            value={view}
            onValueChange={setView}
          />
          {view === "Candle" && (
            <ChartToolbar
              active={{ indicators: showIndicators, grid: showGrid }}
              onAction={handleTool}
            />
          )}
        </div>

        <div className="min-h-90 flex-1">
          {view === "Candle" ? (
            <PriceChart
              candles={visibleCandles}
              revealSignature={`${pair}-${timeframe}`}
              showGrid={showGrid}
              showIndicators={showIndicators}
            />
          ) : (
            <DepthChart book={book} />
          )}
        </div>

        {view === "Candle" && (
          <SegmentedTabs
            options={CANDLE_TIMEFRAMES}
            value={timeframe}
            variant="bare"
            onValueChange={setTimeframe}
          />
        )}
      </CardContent>
    </Card>
  )
}
