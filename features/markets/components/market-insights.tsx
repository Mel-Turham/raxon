"use client"

import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AnimatedNumber } from "@/shared/components/atoms/animated-number"
import { PriceFlash } from "@/shared/components/atoms/price-flash"
import { TokenAvatar } from "@/shared/components/atoms/token-avatar"
import { TrendBadge } from "@/shared/components/atoms/trend-badge"
import { FadeSwap } from "@/shared/components/molecules/fade-swap"
import { LIST_TABLE } from "@/shared/components/molecules/list-table"
import { SegmentedTabs } from "@/shared/components/molecules/segmented-tabs"
import {
  ALIGN_CLASS,
  type Align,
  SortableHeader,
} from "@/shared/components/molecules/sortable-header"
import { useSortedRows } from "@/shared/hooks/use-sorted-rows"
import { ONE_DECIMAL_FORMAT } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"
import { MARKET_INSIGHT_SEGMENTS } from "../constants"
import { quoteChange, quoteSpreadBps } from "../helpers/markets"
import { useLivePrice } from "../state/live-prices"
import type {
  MarketInsights as Insights,
  MarketInsightSegment,
  MarketQuote,
} from "../types"
import { MarketCard } from "./market-card"

const QUOTE_FORMAT = {
  maximumSignificantDigits: 6,
} as const satisfies Intl.NumberFormatOptions

const SORT_GETTERS = {
  pair: (row: MarketQuote) => row.pair,
  bid: (row: MarketQuote) => row.bid,
  ask: (row: MarketQuote) => row.ask,
  spread: quoteSpreadBps,
  low: (row: MarketQuote) => row.low,
  high: (row: MarketQuote) => row.high,
  previous: (row: MarketQuote) => row.previous,
  change: quoteChange,
}

type QuoteColumn = keyof typeof SORT_GETTERS

const COLUMNS: { key: QuoteColumn; label: string; align: Align }[] = [
  { key: "pair", label: "Pair", align: "left" },
  { key: "bid", label: "Bid", align: "right" },
  { key: "ask", label: "Ask", align: "right" },
  { key: "spread", label: "Spread", align: "right" },
  { key: "low", label: "24h Low", align: "right" },
  { key: "high", label: "24h High", align: "right" },
  { key: "previous", label: "Prev. close", align: "right" },
  { key: "change", label: "24h", align: "right" },
]

const NUMERIC_CELL = cn(LIST_TABLE.cell, "text-right font-mono tabular-nums")

const QuoteRow = ({ quote }: { quote: MarketQuote }) => {
  const live = useLivePrice(quote.base, quote.bid)
  const liveQuote = {
    ...quote,
    bid: live.price,
    ask: quote.ask * live.factor,
  }

  return (
    <TableRow className={cn(LIST_TABLE.row, "h-12")}>
      <TableCell className={LIST_TABLE.cell}>
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <TokenAvatar className="size-6" symbol={quote.base} />
          {quote.pair}
        </span>
      </TableCell>
      <TableCell className={cn(NUMERIC_CELL, "text-success")}>
        <PriceFlash delta={live.delta} flashKey={live.tick}>
          <AnimatedNumber format={QUOTE_FORMAT} value={liveQuote.bid} />
        </PriceFlash>
      </TableCell>
      <TableCell className={cn(NUMERIC_CELL, "text-destructive")}>
        <PriceFlash delta={live.delta} flashKey={live.tick}>
          <AnimatedNumber format={QUOTE_FORMAT} value={liveQuote.ask} />
        </PriceFlash>
      </TableCell>
      <TableCell className={NUMERIC_CELL}>
        <AnimatedNumber
          format={ONE_DECIMAL_FORMAT}
          suffix=" bps"
          value={quoteSpreadBps(quote)}
        />
      </TableCell>
      <TableCell className={NUMERIC_CELL}>
        <AnimatedNumber format={QUOTE_FORMAT} value={quote.low} />
      </TableCell>
      <TableCell className={NUMERIC_CELL}>
        <AnimatedNumber format={QUOTE_FORMAT} value={quote.high} />
      </TableCell>
      <TableCell className={cn(NUMERIC_CELL, "text-muted-foreground")}>
        <AnimatedNumber format={QUOTE_FORMAT} value={quote.previous} />
      </TableCell>
      <TableCell className={cn(LIST_TABLE.cell, "text-right")}>
        <TrendBadge digits={2} value={quoteChange(liveQuote)} />
      </TableCell>
    </TableRow>
  )
}

const QuotesTable = ({ quotes }: { quotes: MarketQuote[] }) => {
  const { sortedRows, sort, toggleSort } = useSortedRows(quotes, SORT_GETTERS)

  return (
    <Table className="min-w-[44rem]">
      <TableHeader className={LIST_TABLE.header}>
        <TableRow className={LIST_TABLE.row}>
          {COLUMNS.map(({ key, label, align }) => (
            <TableHead
              className={cn(LIST_TABLE.head, ALIGN_CLASS[align])}
              key={key}
            >
              <SortableHeader
                active={sort?.key === key}
                align={align}
                label={label}
                onSort={() => toggleSort(key)}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((quote) => (
          <QuoteRow key={quote.pair} quote={quote} />
        ))}
      </TableBody>
    </Table>
  )
}

export const MarketInsights = ({ insights }: { insights: Insights }) => {
  const [segment, setSegment] = useState<MarketInsightSegment>("Spot")

  return (
    <MarketCard contentClassName="gap-2" title="Market Insights">
      <SegmentedTabs
        className="max-w-full [scrollbar-width:none] overflow-x-auto"
        onValueChange={setSegment}
        options={MARKET_INSIGHT_SEGMENTS}
        value={segment}
      />
      <FadeSwap swapKey={segment}>
        <QuotesTable key={segment} quotes={insights[segment]} />
      </FadeSwap>
    </MarketCard>
  )
}
